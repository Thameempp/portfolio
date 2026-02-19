import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Link as RouterLink } from 'react-router-dom';
import Sidebar from '../components/research/Sidebar';
import Navbar from '../components/Navbar';
import SearchModal from '../components/research/SearchModal';
import { githubService, getRepoConfig } from '../services/github.js';
import { buildFileTree } from '../utils/fileTree.js';
import { Menu, X, Search, Settings, AlertCircle } from 'lucide-react';
import { INITIAL_TOPICS } from '../data/researchTopics';
import { dbService } from '../services/db';

const ResearchLayout = () => {
    const [tree, setTree] = useState([]);
    const [flatFiles, setFlatFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [error, setError] = useState(null);
    const [configVersion, setConfigVersion] = useState(0); // Trigger reload
    const location = useLocation();
    const isResearchHome = location.pathname === '/research' || location.pathname === '/research/';

    // Load topics from Firestore
    const [topics, setTopics] = useState(INITIAL_TOPICS);
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await dbService.getCollection('topics');
                if (data && data.length > 0) {
                    setTopics(data);
                }
            } catch (e) {
                console.error("Failed to load topics from Firebase", e);
            }
        };
        fetchTopics();
    }, [configVersion]); // Reload if version changes

    // Determine current topic based on URL
    const currentTopic = topics.find(t => location.pathname.startsWith(t.path));

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const loadTree = async () => {
            setLoading(true);
            setError(null);

            // If we are on the main research page or no topic matches, don't load tree
            if (!currentTopic) {
                setTree([]);
                setFlatFiles([]);
                setLoading(false);
                return;
            }

            try {
                const config = currentTopic.repoConfig;

                if (!config || !config.owner || !config.repo) {
                    throw new Error("Repository configuration is missing for this topic.");
                }

                // Grab the token from global settings (SettingsModal) if available
                const globalConfig = getRepoConfig();
                const token = config.token || globalConfig.token || '';

                // Fetch tree
                const flatItems = await githubService.fetchTree({
                    owner: config.owner,
                    repo: config.repo,
                    branch: config.branch,
                    token: token
                });

                // Keep only files for search
                const filesOnly = flatItems.filter(item => {
                    if (item.type !== 'blob') return false;
                    const ext = item.path.split('.').pop().toLowerCase();
                    return ['md', 'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'js', 'jsx', 'ts', 'tsx', 'py', 'json', 'css', 'html', 'ipynb'].includes(ext);
                });
                setFlatFiles(filesOnly);

                const treeData = buildFileTree(flatItems);
                setTree(treeData);
            } catch (error) {
                console.error("Failed to load research tree", error);
                setError(error.message || "Failed to load research notes.");
            } finally {
                setLoading(false);
            }
        };
        loadTree();
    }, [currentTopic, configVersion]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-400 p-4 font-sans">
                <div className="bg-red-900/10 border border-red-900/50 p-8 rounded-lg max-w-md text-center shadow-2xl">
                    <div className="flex justify-center mb-4 text-red-500">
                        <AlertCircle size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-red-500 mb-2">Connection Error</h2>
                    <p className="mb-4 text-gray-300">{error}</p>
                    <p className="text-sm text-gray-500 mb-6">
                        Please check the repository settings for <strong>{currentTopic?.title}</strong> in the Admin Dashboard.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded transition-colors"
                        >
                            Retry
                        </button>
                        <RouterLink
                            to="/admin"
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors flex items-center gap-2"
                        >
                            <Settings size={16} />
                            Go to Admin
                        </RouterLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black text-gray-300 font-indie selection:bg-blue-500/30">
            <Navbar />
            <div className="md:hidden h-16" /> {/* Mobile spacer for fixed navbar */}

            <SearchModal
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                files={flatFiles}
            />

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-black z-50 sticky top-0">
                <div className="font-bold text-lg text-white">Research</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        <Search size={20} />
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Sidebar - Hide on Research Home */}
            {!isResearchHome && (
                <>
                    {/* Sidebar Overlay for Mobile */}
                    {mobileMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                    )}

                    <aside className={`
                        fixed inset-y-0 left-0 z-40 w-56 bg-black transform transition-transform duration-300 ease-in-out md:sticky md:translate-x-0 border-r border-gray-800/30 flex flex-col
                        md:top-0 md:h-screen pt-20
                        ${mobileMenuOpen ? 'translate-x-0 top-16 h-[calc(100vh-4rem)]' : '-translate-x-full'}
                    `}>
                        <div className="p-3 border-b border-gray-800/50 space-y-2">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="w-full flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors group"
                            >
                                <Search size={14} />
                                <span>Search notes...</span>
                                <kbd className="ml-auto text-xs bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-500 group-hover:text-gray-400">⌘K</kbd>
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <Sidebar
                                tree={tree}
                                loading={loading}
                                basePath={currentTopic ? currentTopic.path : '/research'}
                            />
                        </div>


                    </aside>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full min-w-0 pt-24">
                <Outlet context={{ topics }} />
            </main>
        </div>
    );
};

export default ResearchLayout;
