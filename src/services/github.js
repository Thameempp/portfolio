// import { Octokit } from 'octokit'; // Removed unused import to avoid install


// Simple in-memory cache for the session
// We also use localStorage for persistence across reloads
const CACHE_PREFIX = 'gh_cache_v2_';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// Configuration for the target repository
// This could be moved to a context or environment variable later
export const DEFAULT_REPO_CONFIG = {
    owner: 'thameem', // Default owner, should be configurable
    repo: 'research', // Default repo
    branch: 'main',
    path: '',
    token: ''
};

// Configuration handling
const CONFIG_KEY = 'gh_config_v1';

export const getRepoConfig = () => {
    try {
        const stored = localStorage.getItem(CONFIG_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_REPO_CONFIG;
    } catch {
        return DEFAULT_REPO_CONFIG;
    }
};

export const saveRepoConfig = (config) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    // Clear cache when config changes to avoid stale data from old repo
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
};

// Rate limit handling
let rateLimitResetTime = null;

const getCacheKey = (key) => `${CACHE_PREFIX}${key}`;

const getFromCache = (key) => {
    try {
        const item = localStorage.getItem(getCacheKey(key));
        if (!item) return null;

        const parsed = JSON.parse(item);
        if (Date.now() > parsed.expiry) {
            localStorage.removeItem(getCacheKey(key));
            return null;
        }
        return parsed.data;
    } catch (e) {
        return null;
    }
};

const saveToCache = (key, data) => {
    try {
        const item = {
            data,
            expiry: Date.now() + CACHE_DURATION
        };
        localStorage.setItem(getCacheKey(key), JSON.stringify(item));
    } catch (e) {
        console.warn('Failed to save to cache', e);
    }
};

const handleApiError = (error) => {
    if (error.status === 403 && error.response?.headers?.['x-ratelimit-reset']) {
        rateLimitResetTime = parseInt(error.response.headers['x-ratelimit-reset']) * 1000;
        const minutes = Math.ceil((rateLimitResetTime - Date.now()) / 60000);
        throw new Error(`API rate limit exceeded. Try again in ${minutes} minutes.`);
    }
    throw error;
};

const getHeaders = (config) => {
    const headers = {
        'Accept': 'application/vnd.github.v3+json'
    };
    // Use config token if available, otherwise check default/localstorage? 
    // Ideally config passed in IS the complete config.
    if (config && config.token) {
        headers['Authorization'] = `token ${config.token}`;
    }
    return headers;
};

// Core service
export const githubService = {
    /**
     * Fetch the file tree of the repository recursively
     */
    async fetchTree(config, recursive = true) {
        const { owner, repo, branch: sha } = config;

        // Clean repo name just in case
        const cleanRepo = repo.replace(/\.git$/, '');
        const cacheKey = `tree_${owner}_${cleanRepo}_${sha}`;
        const cached = getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // Fetch the tree directly using Git Database API for recursion
            // First getting the branch SHA if not provided specific SHA
            let treeSha = sha;
            if (sha === 'main' || sha === 'master') {
                const branchRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/branches/${sha}`, {
                    headers: getHeaders(config)
                });
                if (!branchRes.ok) {
                    if (branchRes.status === 404) throw new Error('Branch or repository not found');
                    if (branchRes.status === 401) throw new Error('Unauthorized or Private Repo (Check Token)');
                    if (branchRes.status === 403) throw new Error('API rate limit exceeded or access denied. Add a GitHub Token in Settings for higher limits.');
                    throw new Error(`Failed to fetch branch info (HTTP ${branchRes.status})`);
                }
                const branchData = await branchRes.json();
                treeSha = branchData.commit.sha;
            }

            const url = `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/${treeSha}?recursive=${recursive ? 1 : 0}`;
            const response = await fetch(url, { headers: getHeaders(config) });

            if (!response.ok) {
                if (response.status === 404) return []; // Repo empty or not found
                await handleApiError({ status: response.status, response });
            }

            const data = await response.json();

            // Filter for relevant files and folders
            const relevantItems = data.tree.filter(item => {
                if (item.type === 'tree') return true;
                const ext = item.path.split('.').pop().toLowerCase();
                return ['md', 'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'js', 'jsx', 'ts', 'tsx', 'py', 'json', 'css', 'html', 'ipynb'].includes(ext);
            });

            saveToCache(cacheKey, relevantItems);
            return relevantItems;
        } catch (error) {
            console.error("Error fetching contents:", error);
            throw error;
        }
    },

    /**
     * Fetch raw content of a file
     */
    async fetchFileContent(config, path) {
        const { owner, repo, branch } = config;
        const cleanRepo = repo.replace(/\.git$/, '');
        const cacheKey = `content_${owner}_${cleanRepo}_${branch}_${path}`;
        const cached = getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // Primary: Use GitHub API with raw media type (works with token auth for private repos)
            const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/contents/${path}?ref=${branch}`;
            const headers = getHeaders(config);
            headers['Accept'] = 'application/vnd.github.v3.raw';

            const response = await fetch(apiUrl, { headers });

            if (response.ok) {
                const text = await response.text();
                saveToCache(cacheKey, text);
                return text;
            }

            // Fallback: Use raw.githubusercontent.com (works for public repos without token)
            console.warn('API fetch failed, trying raw URL fallback...', response.status);
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/${branch}/${path}`;
            const rawResponse = await fetch(rawUrl);

            if (!rawResponse.ok) {
                throw new Error(`Failed to fetch file: ${rawResponse.statusText}`);
            }

            const text = await rawResponse.text();
            saveToCache(cacheKey, text);
            return text;
        } catch (error) {
            console.error("Error fetching file content:", error);
            throw error;
        }
    },

    /**
     * Fetch file as Blob (for PDFs, specific images)
     */
    async fetchFileBlob(config, path) {
        const { owner, repo, branch } = config;
        const cleanRepo = repo.replace(/\.git$/, '');

        try {
            // Use API endpoint with raw media type to get binary content
            // This works better for private repos than raw.githubusercontent.com
            const url = `https://api.github.com/repos/${owner}/${cleanRepo}/contents/${path}?ref=${branch}`;
            const headers = getHeaders(config);
            headers['Accept'] = 'application/vnd.github.v3.raw';

            const response = await fetch(url, { headers });

            if (!response.ok) {
                console.warn("API fetch failed, trying raw URL fallback...", response.status);
                const rawUrl = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/${branch}/${path}`;
                const rawResponse = await fetch(rawUrl, { headers: getHeaders(config) });

                if (!rawResponse.ok) {
                    throw new Error(`Failed to fetch file: ${rawResponse.statusText}`);
                }
                return await rawResponse.blob();
            }

            return await response.blob();
        } catch (error) {
            console.error("Error fetching file blob:", error);
            throw error;
        }
    },

    /**
     * Fetch latest commit info for a file (for metadata)
     */
    async fetchFileMetadata(config, path) {
        const { owner, repo } = config;
        const cleanRepo = repo.replace(/\.git$/, '');
        const cacheKey = `meta_${owner}_${cleanRepo}_${path}`;
        const cached = getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const url = `https://api.github.com/repos/${owner}/${cleanRepo}/commits?path=${path}&per_page=1`;
            const response = await fetch(url, { headers: getHeaders(config) });

            if (!response.ok) {
                // If rate limited, just return null for metadata so we don't break the page
                return null;
            }

            const data = await response.json();
            const latestCommit = data[0];

            if (!latestCommit) return null;

            const metadata = {
                lastUpdated: latestCommit.commit.committer.date,
                author: latestCommit.commit.author.name,
                authorUrl: latestCommit.author?.html_url,
                commitUrl: latestCommit.html_url,
                sha: latestCommit.sha
            };

            saveToCache(cacheKey, metadata);
            return metadata;
        } catch (error) {
            console.warn("Failed to metadata", error);
            return null;
        }
    }
};
