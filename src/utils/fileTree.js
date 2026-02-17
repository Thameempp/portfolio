
/**
 * Converts a flat list of GitHub file objects into a nested tree structure.
 * @param {Array} flatItems - Array of items from GitHub API { path, type, ... }
 * @returns {Array} - Array of root nodes with children
 */
export const buildFileTree = (flatItems) => {
    const root = [];
    const map = {};

    // First pass: create all nodes
    flatItems.forEach(item => {
        // Create map entries for ALL items (files and folders)
        map[item.path] = {
            ...item,
            name: item.path.split('/').pop(),
            children: []
        };
    });

    // Second pass: connect nodes
    flatItems.forEach(item => {
        const node = map[item.path];
        // Should not happen if map is built correctly
        if (!node) return;

        const parts = item.path.split('/');

        if (parts.length === 1) {
            // Root level item
            root.push(node);
        } else {
            const parentPath = parts.slice(0, -1).join('/');

            if (map[parentPath]) {
                // Parent exists in our list, add as child
                map[parentPath].children.push(node);
            } else {
                // Parent does not exist in our list (maybe filtered out upstream or partial fetch), add to root
                root.push(node);
            }
        }
    });

    // Helper to sort: Folders first, then files, alphabetical
    const sortTree = (nodes) => {
        nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'tree' ? -1 : 1;
        });
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                sortTree(node.children);
            }
        });
    };

    sortTree(root);
    return root;
};
