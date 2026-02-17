import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, X } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, files }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = files.filter(file =>
            file.path.toLowerCase().includes(lowerQuery) ||
            (file.name && file.name.toLowerCase().includes(lowerQuery))
        ).slice(0, 10); // Limit results
        setResults(filtered);
    }, [query, files]);

    const handleSelect = (path) => {
        navigate(`/research/${path}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-[#0F1419] border border-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[60vh] overflow-hidden animate-fade-in">
                <div className="flex items-center px-4 py-3 border-b border-gray-800">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search notes..."
                        className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') onClose();
                        }}
                    />
                    <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded text-gray-400">
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto">
                    {results.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {results.map((file) => (
                                <button
                                    key={file.path}
                                    onClick={() => handleSelect(file.path)}
                                    className="w-full flex items-center px-3 py-3 hover:bg-blue-900/20 hover:text-blue-400 rounded-lg group transition-colors text-left"
                                >
                                    <FileText className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-400" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-200 truncate group-hover:text-blue-300">
                                            {file.name || file.path.split('/').pop()}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {file.path}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : query ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-xs uppercase tracking-wider">
                            Type to search filenames
                        </div>
                    )}
                </div>

                <div className="px-4 py-2 border-t border-gray-800 bg-[#0B0F14] text-xs text-gray-500 flex justify-between">
                    <span>Pro tip: Search maps directly to file paths</span>
                    <span>ESC to close</span>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
