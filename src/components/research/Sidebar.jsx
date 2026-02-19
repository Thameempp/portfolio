import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

const TreeNode = ({ node, basePath = '/research', level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Construct full path for this node
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

    // Padding based on level to create the tree structure visual
    const paddingLeft = level * 12 + 12; // 12px step + base 12px

    if (isFolder) {
        return (
            <div className="select-none">
                <div
                    className={clsx(
                        "flex items-center justify-between py-2 pr-3 cursor-pointer transition-all duration-200 group border-b border-gray-900/50 font-indie",
                        isChildActive || isOpen
                            ? "text-white font-semibold bg-gradient-to-r from-gray-800/40 to-transparent border-l-2 border-gray-600"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-2 border-transparent"
                    )}
                    style={{ paddingLeft: isChildActive || isOpen ? `${paddingLeft - 2}px` : `${paddingLeft}px` }}
                    onClick={handleToggle}
                >
                    <span className="text-sm font-medium tracking-wide">{node.name}</span>
                    <span className={clsx("transition-transform duration-200 opacity-50", isOpen ? "rotate-90" : "")}>
                        <ChevronRight size={14} />
                    </span>
                </div>

                {isOpen && (
                    <div>
                        {node.children.map(child => (
                            <TreeNode key={child.path} node={child} basePath={basePath} level={level + 1} />
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
                "flex items-center py-2 pr-3 border-b border-gray-900/50 transition-all duration-200 block text-sm font-indie",
                isActive
                    ? "text-blue-400 font-bold bg-gradient-to-r from-blue-600/20 to-transparent border-l-2 border-blue-500 pl-3"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5 pl-4 border-l-2 border-transparent"
            )}
            style={{ paddingLeft: isActive ? `${paddingLeft - 2}px` : `${paddingLeft}px` }}
        >
            <span className="truncate">
                {node.name.replace(/\.(md|ipynb|txt|pdf|html)$/, '')}
            </span>
        </Link>
    );
};

const Sidebar = ({ tree, loading, basePath }) => {
    return (
        <nav className="w-full h-full overflow-y-auto bg-black pb-20 select-none font-indie">
            {/* Header matches the screenshot style "Technical Scripter 2026" */}
            <div className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/50 flex items-center justify-between sticky top-0 bg-black z-10 font-sans">
                <span>Explorer</span>
            </div>

            {loading ? (
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-6 bg-gray-800/30 rounded animate-pulse w-full"></div>
                    ))}
                </div>
            ) : (
                <div className="">
                    {tree.map(node => (
                        <TreeNode key={node.path} node={node} basePath={basePath} />
                    ))}
                    {tree.length === 0 && (
                        <div className="text-gray-600 text-sm p-6 text-center italic">No items found.</div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Sidebar;
