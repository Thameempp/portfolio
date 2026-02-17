import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { getRepoConfig, saveRepoConfig, DEFAULT_REPO_CONFIG } from '../../services/github';

const SettingsModal = ({ isOpen, onClose, onSave }) => {
    const [config, setConfig] = useState(DEFAULT_REPO_CONFIG);
    const [repoUrl, setRepoUrl] = useState('');

    useEffect(() => {
        if (isOpen) {
            const currentConfig = getRepoConfig();
            setConfig(currentConfig);
            // Construct URL from config for display if it matches standard patterns
            if (currentConfig.owner && currentConfig.repo) {
                setRepoUrl(`https://github.com/${currentConfig.owner}/${currentConfig.repo}`);
            } else {
                setRepoUrl('');
            }
        }
    }, [isOpen]);

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setRepoUrl(url);

        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'github.com') {
                const parts = urlObj.pathname.split('/').filter(Boolean);
                if (parts.length >= 2) {
                    setConfig(prev => ({
                        ...prev,
                        owner: parts[0],
                        repo: parts[1],
                        // Only set branch if strictly found in tree/blob url, otherwise keep existing
                        branch: (parts[2] === 'tree' || parts[2] === 'blob') && parts[3] ? parts[3] : prev.branch
                    }));
                }
            }
        } catch (e) {
            // invalid url, ignore
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveRepoConfig(config);
        onSave();
        onClose();
    };

    const handleReset = () => {
        setConfig(DEFAULT_REPO_CONFIG);
        setRepoUrl(`https://github.com/${DEFAULT_REPO_CONFIG.owner}/${DEFAULT_REPO_CONFIG.repo}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-[#0F1419] border border-gray-800 rounded-xl shadow-2xl p-6 animate-scale-up">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Repository Settings</h2>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* URL Input Section */}
                    <div className="bg-blue-900/10 border border-blue-900/30 p-3 rounded-lg mb-4">
                        <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                            Quick Import
                        </label>
                        <input
                            type="url"
                            value={repoUrl}
                            onChange={handleUrlChange}
                            placeholder="Paste GitHub Repository URL..."
                            className="w-full bg-[#0B0F14] border border-blue-900/30 rounded px-3 py-2 text-sm text-blue-100 placeholder-blue-900/50 focus:outline-none focus:border-blue-500 transition-colors"
                            autoFocus
                        />
                        <p className="text-[10px] text-blue-500/70 mt-1.5">
                            Paste a URL (e.g. <code>https://github.com/facebook/react</code>) to auto-fill the fields below.
                        </p>
                    </div>

                    <div className="border-t border-gray-800 pt-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                            Manual Configuration
                        </label>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">GitHub Owner</label>
                                <input
                                    type="text"
                                    name="owner"
                                    value={config.owner}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="username"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Repository Name</label>
                                <input
                                    type="text"
                                    name="repo"
                                    value={config.repo}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="repo-name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Branch</label>
                                    <input
                                        type="text"
                                        name="branch"
                                        value={config.branch}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="main"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Path (Optional)</label>
                                    <input
                                        type="text"
                                        name="path"
                                        value={config.path}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="docs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Personal Access Token (Optional)
                                    <span className="text-xs text-gray-600 block font-normal">Required for private repos or higher rate limits</span>
                                </label>
                                <input
                                    type="password"
                                    name="token"
                                    value={config.token || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="github_pat_..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
                        >
                            <RotateCcw size={12} /> Reset to User Defaults
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                        >
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
