import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Image as ImageIcon, FileCode, File } from 'lucide-react';
import { clsx } from 'clsx';

const FileIcon = ({ name }) => {
    const ext = name.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
        return <ImageIcon size={14} className="text-purple-400/80" />;
    }
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'json', 'css', 'html'].includes(ext)) {
        return <FileCode size={14} className="text-yellow-400/80" />;
    }
    if (ext === 'ipynb') {
        return <FileCode size={14} className="text-orange-400/80" />;
    }
    if (ext === 'pdf') {
        return <File size={14} className="text-red-400/80" />;
    }
    return <FileText size={14} className="text-gray-500" />;
};

const TreeNode = ({ node, basePath = '/research' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Construct full path for this node
    // Ensure basePath doesn't end with slash and node.path doesn't start with slash to avoid double slash, 
    // but typically node.path is relative 'foo/bar.md'
    const fullPath = `${basePath}/${node.path}`.replace(/\/+/g, '/');

    // Check if this node or any of its children are active
    const isActive = location.pathname === fullPath;
    const isChildActive = location.pathname.startsWith(fullPath + '/');
    const isFolder = node.type === 'tree';

    React.useEffect(() => {
        if (isFolder && isChildActive) {
            setIsOpen(true);
        }
    }, [isChildActive, isFolder]);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    if (isFolder) {
        return (
            <div className="select-none">
                <div
                    className={clsx(
                        "flex items-center gap-1.5 py-1.5 px-2 cursor-pointer rounded-md transition-colors duration-200 group mb-0.5",
                        isChildActive || isOpen ? "text-gray-200" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                    )}
                    onClick={handleToggle}
                >
                    <span className={clsx("transition-transform duration-200 opacity-60", isOpen ? "rotate-90" : "")}>
                        <ChevronRight size={12} />
                    </span>
                    <span className={clsx("transition-colors", isOpen ? "text-blue-400/80" : "opacity-70 group-hover:text-blue-400/60")}>
                        {isOpen ? <FolderOpen size={14} /> : <Folder size={14} />}
                    </span>
                    <span className="text-[13px] font-medium truncate tracking-tight">{node.name}</span>
                </div>

                {isOpen && (
                    <div className="relative ml-2.5 pl-2 border-l border-gray-800/60">
                        {/* Optional: Add hover guide line */}
                        <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gray-700/0 hover:bg-gray-700/50 transition-colors"></div>

                        {node.children.map(child => (
                            <TreeNode key={child.path} node={child} basePath={basePath} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // File
    return (
        <Link
            to={fullPath}
            className={clsx(
                "flex items-center gap-2 py-1.5 px-2 rounded-md transition-all duration-200 group text-[13px] mb-0.5 relative",
                isActive
                    ? "bg-blue-500/10 text-blue-400 font-medium"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
            )}
        >
            {/* Active Indicator Line */}
            {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-blue-400 rounded-r shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}

            <span className={clsx("ml-1", isActive ? "opacity-100" : "opacity-70")}>
                <FileIcon name={node.name} />
            </span>
            <span className="truncate leading-none py-0.5">
                {node.name.replace(/\.(md|ipynb|txt|pdf)$/, '')}
            </span>
        </Link>
    );
};

const Sidebar = ({ tree, loading, basePath }) => {
    return (
        <nav className="w-full h-full overflow-y-auto bg-black pb-20 select-none">
            <div className="px-3 py-3 sticky top-0 bg-black/95 backdrop-blur-xl z-20 mb-2 border-b border-gray-800/30 supports-[backdrop-filter]:bg-black/80">
                <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5 opacity-80 pl-1">Explorer</h2>
                <div className="text-xs font-semibold text-gray-300 tracking-tight pl-1">Personal Research</div>
            </div>

            {loading ? (
                <div className="px-4 py-2 space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-800/30 rounded animate-pulse w-3/4"></div>
                    ))}
                </div>
            ) : (
                <div className="px-2">
                    {tree.map(node => (
                        <TreeNode key={node.path} node={node} basePath={basePath} />
                    ))}
                    {tree.length === 0 && (
                        <div className="text-gray-500 text-sm p-4 text-center italic">No research notes found.</div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Sidebar;
