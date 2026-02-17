import React, { useState, useEffect, useRef } from 'react';
import { Book, Code, Briefcase, Plus, Save, Trash2, Edit2, X, Check, Image as ImageIcon, RefreshCw, AlertTriangle, Key, Eye, EyeOff, Upload, Link as LinkIcon, ExternalLink, Github, Map, Calendar, Tag, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import { INITIAL_TOPICS } from '../data/researchTopics';
import { dbService } from '../services/db';
import { getRepoConfig, saveRepoConfig } from '../services/github';
import { getImageKitConfig, saveImageKitConfig, uploadToImageKit } from '../services/imagekit';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('research');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [permissionError, setPermissionError] = useState(false); // New state for permission errors

    // Data States
    const [researchTopics, setResearchTopics] = useState([]);
    const [projects, setProjects] = useState([]);
    const [journey, setJourney] = useState([]);

    // Load Data
    const fetchData = async () => {
        setLoading(true);
        setPermissionError(false);
        try {
            // Topics
            const topics = await dbService.getCollection('topics');
            if (topics.length === 0) {
                // Seed initial topics if empty
                console.log("Seeding initial topics...");
                // Remove IDs from seed data regarding potential collision, but Firestore ID is auto.
                // Actually INITIAL_TOPICS has simple IDs. We should let Firestore generate IDs.
                for (const t of INITIAL_TOPICS) {
                    const { id, ...data } = t; // remove hardcoded ID
                    await dbService.addDocument('topics', data);
                }
                const seeded = await dbService.getCollection('topics');
                setResearchTopics(seeded);
            } else {
                setResearchTopics(topics);
            }

            // Projects
            const projs = await dbService.getCollection('projects');
            setProjects(projs);

            // Journey
            const journeyData = await dbService.getCollection('journey');
            if (journeyData.length === 0) {
                console.log("Seeding initial journey entries...");
                const INITIAL_JOURNEY = [
                    { date: 'Now', title: 'Building Next-Gen AI Projects', description: 'Currently developing advanced AI/ML applications and exploring LLM integrations', status: 'active', tags: ['AI', 'LLM', 'React'] },
                    { date: 'Now', title: 'NumPy', description: 'Exploring efficient numerical computing and data manipulation with Python', status: 'active', tags: ['Python'] },
                    { date: '', title: 'AI Chat App', description: 'A real-time AI chat application built with FastAPI and streaming responses.', status: 'milestone', tags: ['FastAPI', 'SQLite'] },
                    { date: '', title: 'AI Video Generator', description: 'Educational platform with voice synthesis and live tutorials', status: 'completed', tags: ['React', 'FastAPI', 'OpenAI'] },
                    { date: '', title: 'Food-order Management', description: 'Full-stack ordering system with admin dashboard', status: 'milestone', tags: ['Python', 'PostgreSQL'] }
                ];
                for (const entry of INITIAL_JOURNEY) {
                    await dbService.addDocument('journey', entry);
                }
                const seeded = await dbService.getCollection('journey');
                setJourney(seeded);
            } else {
                setJourney(journeyData);
            }

        } catch (e) {
            console.error("Error loading admin data:", e);
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) {
                setPermissionError(true);
            } else {
                alert("Failed to load data from Firebase. Check console.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);


    // Handlers - Research
    const handleAddTopic = async () => {
        const newTopic = {
            title: "New Research Topic",
            description: "Description here...",
            path: `/research/new-topic-${Date.now()}`,
            icon: "Book",
            color: "text-blue-400",
            repoConfig: { owner: '', repo: '', branch: 'main' }
        };
        try {
            const saved = await dbService.addDocument('topics', newTopic);
            setResearchTopics([...researchTopics, saved]);
        } catch (e) {
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) setPermissionError(true);
            else alert("Failed to add topic");
        }
    };

    const handleUpdateTopic = async (id, data) => {
        try {
            await dbService.updateDocument('topics', id, data);
            setResearchTopics(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
        } catch (e) {
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) setPermissionError(true);
            else alert("Failed to update topic");
        }
    };

    const handleDeleteTopic = async (id) => {
        if (!window.confirm("Delete this topic?")) return;
        try {
            await dbService.deleteDocument('topics', id);
            setResearchTopics(prev => prev.filter(t => t.id !== id));
        } catch (e) {
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) setPermissionError(true);
            else alert("Failed to delete topic");
        }
    };

    // Handlers - Projects
    const handleAddProject = async () => {
        const newProject = {
            title: "New Project",
            description: "Project description...",
            tech: ["React"],
            features: ["Feature 1"],
            link: "#",
            demoLink: "#",
            githubLink: "#",
            image: "https://via.placeholder.com/600x400"
        };
        try {
            const saved = await dbService.addDocument('projects', newProject);
            setProjects([...projects, saved]);
        } catch (e) {
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) setPermissionError(true);
            else alert("Failed to add project");
        }
    };

    const handleUpdateProject = async (id, data) => {
        try {
            await dbService.updateDocument('projects', id, data);
            setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        } catch (e) {
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) setPermissionError(true);
            else alert("Failed to update project");
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            await dbService.deleteDocument('projects', id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) setPermissionError(true);
            else alert("Failed to delete project");
        }
    };

    // Handlers - Journey
    const handleAddJourney = async () => {
        const newEntry = {
            date: 'Now',
            title: 'New Entry',
            description: 'Description...',
            status: 'completed',
            tags: ['Tag']
        };
        try {
            const saved = await dbService.addDocument('journey', newEntry);
            setJourney([...journey, saved]);
        } catch (e) {
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) setPermissionError(true);
            else alert('Failed to add journey entry');
        }
    };

    const handleUpdateJourney = async (id, data) => {
        try {
            await dbService.updateDocument('journey', id, data);
            setJourney(prev => prev.map(j => j.id === id ? { ...j, ...data } : j));
        } catch (e) {
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) setPermissionError(true);
            else alert('Failed to update journey entry');
        }
    };

    const handleDeleteJourney = async (id) => {
        if (!window.confirm('Delete this journey entry?')) return;
        try {
            await dbService.deleteDocument('journey', id);
            setJourney(prev => prev.filter(j => j.id !== id));
        } catch (e) {
            if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) setPermissionError(true);
            else alert('Failed to delete journey entry');
        }
    };

    // Auth Handler (same)
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'pp786') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid password');
        }
    };

    if (!isAuthenticated) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        placeholder="Enter admin password"
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg">Login</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans">
            <Navbar />
            <div className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10">
                    <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Admin Dashboard</h1>
                    <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                        <button
                            onClick={() => setActiveTab('research')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'research' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            <Book size={16} /> Research
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            <Code size={16} /> Projects
                        </button>
                        <button
                            onClick={() => setActiveTab('journey')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'journey' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            <Map size={16} /> Journey
                        </button>
                    </div>
                </div>

                {permissionError && (
                    <div className="bg-red-900/40 border border-red-500/50 text-white p-4 rounded-xl mb-8 flex items-start gap-4 shadow-lg backdrop-blur-sm">
                        <AlertTriangle className="shrink-0 text-red-500 mt-1" />
                        <div>
                            <h3 className="font-bold text-lg text-red-100">Database Permission Locked</h3>
                            <p className="text-sm text-gray-300 mt-1">
                                Your Firebase Database is currently locked, preventing you from saving or loading requests.
                                To fix this, you need to update your <b>Security Rules</b> in the Firebase Console.
                            </p>
                            <div className="mt-3 bg-black/50 p-3 rounded-lg border border-red-500/30">
                                <p className="text-xs text-gray-400 mb-1">Copy and paste this into your Firestore Rules:</p>
                                <code className="text-xs font-mono text-green-400 block whitespace-pre">
                                    {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                                </code>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 min-h-[60vh]">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-blue-400 animate-pulse">
                            <RefreshCw className="animate-spin mr-2" /> Loading data from Firebase...
                        </div>
                    ) : (
                        <>
                            {activeTab === 'research' && (
                                <ResearchManager
                                    data={researchTopics}
                                    onAdd={handleAddTopic}
                                    onUpdate={handleUpdateTopic}
                                    onDelete={handleDeleteTopic}
                                />
                            )}
                            {activeTab === 'projects' && (
                                <ProjectManager
                                    data={projects}
                                    onAdd={handleAddProject}
                                    onUpdate={handleUpdateProject}
                                    onDelete={handleDeleteProject}
                                />
                            )}
                            {activeTab === 'journey' && (
                                <JourneyManager
                                    data={journey}
                                    onAdd={handleAddJourney}
                                    onUpdate={handleUpdateJourney}
                                    onDelete={handleDeleteJourney}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Sub-components for Managers ---

const ResearchManager = ({ data, onAdd, onUpdate, onDelete }) => {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [ghToken, setGhToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [tokenSaved, setTokenSaved] = useState(false);
    const [tokenSaving, setTokenSaving] = useState(false);

    useEffect(() => {
        // Load from Firebase first, fallback to localStorage
        const loadToken = async () => {
            const fbConfig = await dbService.getConfig('github');
            if (fbConfig && fbConfig.token) {
                setGhToken(fbConfig.token);
                // Sync to localStorage for services
                const localConfig = getRepoConfig();
                saveRepoConfig({ ...localConfig, token: fbConfig.token });
            } else {
                const localConfig = getRepoConfig();
                setGhToken(localConfig.token || '');
            }
        };
        loadToken();
    }, []);

    const handleSaveToken = async () => {
        setTokenSaving(true);
        try {
            // Save to Firebase
            await dbService.saveConfig('github', { token: ghToken });
            // Also sync to localStorage for services
            const config = getRepoConfig();
            saveRepoConfig({ ...config, token: ghToken });
            setTokenSaved(true);
            setTimeout(() => setTokenSaved(false), 2000);
        } catch (e) {
            alert('Failed to save token to database');
        } finally {
            setTokenSaving(false);
        }
    };

    const startEdit = (topic) => {
        setEditingId(topic.id);
        setEditForm({ ...topic, repoConfig: { ...topic.repoConfig } });
    };

    const handleSave = () => {
        onUpdate(editingId, editForm);
        setEditingId(null);
    };

    const handleChange = (e, section = null) => {
        const { name, value } = e.target;
        let finalValue = value;

        // Auto-clean repo name if user types it manually
        if (name === 'repo' && section === 'repoConfig') {
            finalValue = value.replace(/\.git$/, '');
        }

        if (section === 'repoConfig') {
            setEditForm(prev => ({
                ...prev,
                repoConfig: { ...prev.repoConfig, [name]: finalValue }
            }));
        } else {
            setEditForm(prev => ({ ...prev, [name]: finalValue }));
        }
    };

    return (
        <div>
            {/* GitHub Token Configuration */}
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-lg mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Key size={16} className="text-yellow-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">GitHub Access Token</h3>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                    Required for private repos and to avoid API rate limits (60 req/hr → 5,000 req/hr).
                    Generate one at{' '}
                    <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/settings/tokens</a>.
                </p>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type={showToken ? 'text' : 'password'}
                            value={ghToken}
                            onChange={(e) => setGhToken(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 pr-10 text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                            {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                    <button
                        onClick={handleSaveToken}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${tokenSaved
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                    >
                        {tokenSaved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save</>}
                    </button>
                </div>
                {ghToken && (
                    <p className="text-xs text-green-500/70 mt-2 flex items-center gap-1">
                        <Check size={12} /> Token configured — authenticated API access enabled.
                    </p>
                )}
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Manage Research Topics</h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    <Plus size={16} /> Add Topic
                </button>
            </div>
            <div className="grid gap-4">
                {data.map((item) => (
                    <div key={item.id} className="bg-gray-900 border border-gray-800 p-6 rounded-lg transition-colors">
                        {editingId === item.id ? (
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1 uppercase">Topic Title</label>
                                        <input
                                            name="title"
                                            value={editForm.title}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1 uppercase">URL Path</label>
                                        <input
                                            name="path"
                                            value={editForm.path}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm"
                                            placeholder="/research/topic-name"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-800 pt-4 mt-2">
                                    <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                                        <Code size={14} /> Repository Configuration
                                    </h4>

                                    {/* Helper URL Input */}
                                    <div className="mb-3">
                                        <label className="block text-xs text-gray-500 mb-1">Quick Import from URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                defaultValue={editForm.repoConfig?.owner && editForm.repoConfig?.repo ? `https://github.com/${editForm.repoConfig.owner}/${editForm.repoConfig.repo}` : ''}
                                                placeholder="https://github.com/owner/repo"
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                                onChange={(e) => {
                                                    const url = e.target.value;
                                                    try {
                                                        const urlObj = new URL(url);
                                                        if (urlObj.hostname === 'github.com') {
                                                            const parts = urlObj.pathname.split('/').filter(Boolean);
                                                            if (parts.length >= 2) {
                                                                setEditForm(prev => ({
                                                                    ...prev,
                                                                    repoConfig: {
                                                                        ...prev.repoConfig,
                                                                        owner: parts[0],
                                                                        repo: parts[1].replace(/\.git$/, ''), // Strip .git
                                                                        // If URL has /tree/branch, extract it?
                                                                        // e.g. github.com/owner/repo/tree/main
                                                                        branch: (parts[2] === 'tree' && parts[3]) ? parts[3] : (prev.repoConfig?.branch || 'main')
                                                                    }
                                                                }));
                                                            }
                                                        }
                                                    } catch (e) {
                                                        // Ignore invalid URLs while typing
                                                    }
                                                }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-600 mt-1">Paste a GitHub URL to auto-fill details below.</p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Owner</label>
                                            <input
                                                name="owner"
                                                value={editForm.repoConfig?.owner || ''}
                                                onChange={(e) => handleChange(e, 'repoConfig')}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Repo Name</label>
                                            <input
                                                name="repo"
                                                value={editForm.repoConfig?.repo || ''}
                                                onChange={(e) => handleChange(e, 'repoConfig')}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Branch</label>
                                            <input
                                                name="branch"
                                                value={editForm.repoConfig?.branch || ''}
                                                onChange={(e) => handleChange(e, 'repoConfig')}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="px-4 py-2 text-gray-400 hover:text-white text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium flex items-center gap-2"
                                    >
                                        <Save size={14} /> Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                                        <span className="text-xs bg-gray-800 text-blue-300 px-2 py-0.5 rounded font-mono">
                                            {item.path}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1 mb-3">{item.description}</p>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            {item.repoConfig?.owner}/{item.repoConfig?.repo}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                            {item.repoConfig?.branch}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(item)}
                                        className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-blue-400 transition-colors"
                                        title="Edit Settings"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProjectManager = ({ data, onAdd, onUpdate, onDelete }) => {
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({});
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    // ImageKit config
    const [ikConfig, setIkConfig] = useState({ urlEndpoint: '', publicKey: '', privateKey: '' });
    const [showIkKey, setShowIkKey] = useState(false);
    const [ikSaved, setIkSaved] = useState(false);
    const [ikSaving, setIkSaving] = useState(false);

    useEffect(() => {
        // Load from Firebase first, fallback to localStorage
        const loadIkConfig = async () => {
            const fbConfig = await dbService.getConfig('imagekit');
            if (fbConfig) {
                const merged = {
                    urlEndpoint: fbConfig.urlEndpoint || '',
                    publicKey: fbConfig.publicKey || '',
                    privateKey: fbConfig.privateKey || ''
                };
                setIkConfig(merged);
                // Sync to localStorage for services
                saveImageKitConfig(merged);
            } else {
                const localConfig = getImageKitConfig();
                setIkConfig(localConfig);
            }
        };
        loadIkConfig();
    }, []);

    const handleSaveIkConfig = async () => {
        setIkSaving(true);
        try {
            // Save to Firebase
            await dbService.saveConfig('imagekit', ikConfig);
            // Also sync to localStorage for services
            saveImageKitConfig(ikConfig);
            setIkSaved(true);
            setTimeout(() => setIkSaved(false), 2000);
        } catch (e) {
            alert('Failed to save ImageKit config to database');
        } finally {
            setIkSaving(false);
        }
    };

    const startEdit = (project) => {
        setEditingId(project.id);
        setForm({
            title: project.title || '',
            description: project.description || '',
            tech: (project.tech || []).join(', '),
            features: (project.features || []).join(', '),
            link: project.link || '#',
            demoLink: project.demoLink || '#',
            githubLink: project.githubLink || '#',
            image: project.image || ''
        });
        setUploadError('');
    };

    const handleSave = () => {
        const updated = {
            title: form.title,
            description: form.description,
            tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
            features: form.features.split(',').map(f => f.trim()).filter(Boolean),
            link: form.link,
            demoLink: form.demoLink,
            githubLink: form.githubLink,
            image: form.image
        };
        onUpdate(editingId, updated);
        setEditingId(null);
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file');
            return;
        }
        setUploading(true);
        setUploadError('');
        try {
            const result = await uploadToImageKit(file);
            setForm(prev => ({ ...prev, image: result.url }));
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleImageUpload(file);
    };

    return (
        <div>
            {/* ImageKit Configuration Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                        <ImageIcon size={16} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">ImageKit Configuration</h3>
                        <p className="text-gray-500 text-xs">Required for project image uploads</p>
                    </div>
                    {ikConfig.urlEndpoint && ikConfig.publicKey && (
                        <span className="ml-auto text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full border border-green-800/50">
                            ✓ Configured
                        </span>
                    )}
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">URL Endpoint</label>
                        <input
                            type="text"
                            value={ikConfig.urlEndpoint}
                            onChange={(e) => setIkConfig(prev => ({ ...prev, urlEndpoint: e.target.value }))}
                            placeholder="https://ik.imagekit.io/your_id"
                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Public Key</label>
                        <input
                            type="text"
                            value={ikConfig.publicKey}
                            onChange={(e) => setIkConfig(prev => ({ ...prev, publicKey: e.target.value }))}
                            placeholder="public_xxxxxxx"
                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Private Key</label>
                        <div className="flex gap-2">
                            <input
                                type={showIkKey ? 'text' : 'password'}
                                value={ikConfig.privateKey || ''}
                                onChange={(e) => setIkConfig(prev => ({ ...prev, privateKey: e.target.value }))}
                                placeholder="private_xxxxxxx"
                                className="flex-1 bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                            />
                            <button
                                onClick={() => setShowIkKey(!showIkKey)}
                                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 text-sm"
                            >
                                {showIkKey ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleSaveIkConfig}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm font-medium flex items-center gap-2"
                    >
                        <Save size={14} />
                        {ikSaved ? 'Saved ✓' : 'Save Config'}
                    </button>
                </div>
            </div>

            {/* Project List Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Manage Projects</h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    <Plus size={16} /> Add Project
                </button>
            </div>

            {/* Project Cards */}
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors">
                        {editingId === item.id ? (
                            /* ── Edit Mode ── */
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-white font-semibold">Editing Project</h3>
                                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Image Upload Area */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="relative h-48 bg-black border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg overflow-hidden cursor-pointer transition-colors group"
                                >
                                    {form.image ? (
                                        <>
                                            <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-sm font-medium flex items-center gap-2">
                                                    <Upload size={16} /> Change Image
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <Upload size={32} className="mb-2" />
                                            <span className="text-sm">Drop image here or click to browse</span>
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e.target.files[0])}
                                />

                                {uploadError && (
                                    <p className="text-red-400 text-xs flex items-center gap-1">
                                        <AlertTriangle size={12} /> {uploadError}
                                    </p>
                                )}

                                {/* Or paste image URL */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Or paste image URL</label>
                                    <input
                                        type="text"
                                        value={form.image}
                                        onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                                        placeholder="https://..."
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                    />
                                </div>

                                {/* Title & Description */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={form.description}
                                            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Tech & Features */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Tech Stack (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={form.tech}
                                            onChange={(e) => setForm(prev => ({ ...prev, tech: e.target.value }))}
                                            placeholder="React, Node.js, MongoDB"
                                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Features (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={form.features}
                                            onChange={(e) => setForm(prev => ({ ...prev, features: e.target.value }))}
                                            placeholder="Real-time Chat, Auth, Dashboard"
                                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Links */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Demo Link</label>
                                        <input
                                            type="text"
                                            value={form.demoLink}
                                            onChange={(e) => setForm(prev => ({ ...prev, demoLink: e.target.value }))}
                                            placeholder="https://demo.example.com"
                                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">GitHub Link</label>
                                        <input
                                            type="text"
                                            value={form.githubLink}
                                            onChange={(e) => setForm(prev => ({ ...prev, githubLink: e.target.value }))}
                                            placeholder="https://github.com/user/repo"
                                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Save / Cancel */}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="px-4 py-2 text-gray-400 hover:text-white text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium flex items-center gap-2"
                                    >
                                        <Save size={14} /> Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ── View Mode ── */
                            <div className="flex gap-0">
                                {/* Thumbnail */}
                                <div className="w-48 h-36 flex-shrink-0 bg-gray-800 overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 p-4 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-white text-lg truncate">{item.title}</h3>
                                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                                        </div>
                                        <div className="flex gap-1 ml-3 flex-shrink-0">
                                            <button
                                                onClick={() => startEdit(item)}
                                                className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-blue-400 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tech Tags */}
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {(item.tech || []).map((t, i) => (
                                            <span key={i} className="text-xs bg-gray-800 text-blue-300 px-2 py-0.5 rounded">{t}</span>
                                        ))}
                                    </div>

                                    {/* Links */}
                                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                                        {item.githubLink && item.githubLink !== '#' && (
                                            <a href={item.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                                <Github size={12} /> GitHub
                                            </a>
                                        )}
                                        {item.demoLink && item.demoLink !== '#' && (
                                            <a href={item.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                                <ExternalLink size={12} /> Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const STATUS_CONFIG = {
    active: { label: 'Active', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/40', dot: 'bg-green-500' },
    milestone: { label: 'Milestone', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/40', dot: 'bg-purple-500' },
    completed: { label: 'Completed', color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-600/40', dot: 'bg-gray-500' }
};

const JourneyManager = ({ data, onAdd, onUpdate, onDelete }) => {
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({});

    const startEdit = (entry) => {
        setEditingId(entry.id);
        setForm({
            date: entry.date || '',
            title: entry.title || '',
            description: entry.description || '',
            status: entry.status || 'completed',
            tags: (entry.tags || []).join(', ')
        });
    };

    const handleSave = () => {
        const updated = {
            date: form.date,
            title: form.title,
            description: form.description,
            status: form.status,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
        };
        onUpdate(editingId, updated);
        setEditingId(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Manage Journey</h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    <Plus size={16} /> Add Entry
                </button>
            </div>

            {/* Status Legend */}
            <div className="flex gap-4 mb-6">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                        <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                        <span className={cfg.color}>{cfg.label}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {data.map((item) => {
                    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.completed;

                    return (
                        <div key={item.id} className={`bg-gray-900 border rounded-lg overflow-hidden transition-colors ${editingId === item.id ? 'border-blue-500/50' : `${status.border} hover:border-gray-600`
                            }`}>
                            {editingId === item.id ? (
                                /* ── Edit Mode ── */
                                <div className="p-5 space-y-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-white font-semibold">Editing Journey Entry</h3>
                                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {/* Status & Date Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Status</label>
                                            <div className="relative">
                                                <select
                                                    value={form.status}
                                                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="active">🟢 Active</option>
                                                    <option value="milestone">🟣 Milestone</option>
                                                    <option value="completed">⚪ Completed</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Date</label>
                                            <input
                                                type="text"
                                                value={form.date}
                                                onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                                                placeholder="Now, 2024, Jan 2024, etc."
                                                className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                                        <textarea
                                            value={form.description}
                                            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                            rows={2}
                                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none resize-none"
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Tags (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={form.tags}
                                            onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                                            placeholder="React, AI, Python"
                                            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    {/* Save / Cancel */}
                                    <div className="flex justify-end gap-3 pt-1">
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-2 text-gray-400 hover:text-white text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium flex items-center gap-2"
                                        >
                                            <Save size={14} /> Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* ── View Mode ── */
                                <div className="flex items-center gap-4 p-4">
                                    {/* Status Dot */}
                                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                        <div className={`w-3 h-3 rounded-full ${status.dot} ${item.status === 'active' ? 'animate-pulse shadow-lg shadow-green-500/50' : ''}`} />
                                    </div>

                                    {/* Date */}
                                    <div className="w-20 text-right flex-shrink-0">
                                        <span className={`text-sm font-mono ${status.color}`}>{item.date || '—'}</span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-semibold text-white truncate">{item.title}</h3>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${status.bg} ${status.color} border ${status.border}`}>
                                                {status.label.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm truncate">{item.description}</p>
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {item.tags.map((tag, i) => (
                                                    <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => startEdit(item)}
                                            className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-blue-400 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {data.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Map size={32} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No journey entries yet. Add your first one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
