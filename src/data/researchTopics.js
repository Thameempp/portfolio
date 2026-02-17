import { Book, Code, Database, FileText, Server, Terminal } from 'lucide-react';
import { DEFAULT_REPO_CONFIG } from '../services/github';

export const ICON_MAP = {
    Book,
    Code,
    Database,
    FileText,
    Server,
    Terminal
};

// Helper to create topic with default config
const createTopic = (id, title, path, description, icon, color, repoConfig = {}) => ({
    id,
    title,
    path, // e.g., "/research/machine-learning"
    description,
    icon, // String name corresponding to ICON_MAP key
    color,
    repoConfig: { ...DEFAULT_REPO_CONFIG, ...repoConfig }
});

export const INITIAL_TOPICS = [
    createTopic(1, "Machine Learning", "/research/machine-learning", "Supervised and unsupervised learning algorithms, model evaluation, and neural networks.", "Book", "text-blue-400"),
    createTopic(2, "Python Basics", "/research/python", "Core concepts, data structures, and advanced features of the Python language.", "Code", "text-yellow-400"),
    createTopic(3, "Data Analytics", "/research/data-analytics", "Data processing, visualization, and statistical analysis techniques.", "Database", "text-purple-400"),
    createTopic(4, "Mathematics for ML", "/research/math", "Linear algebra, calculus, probability, and statistics foundations.", "FileText", "text-red-400"),
    createTopic(5, "Flask Framework", "/research/flask", "Building web applications and REST APIs with Flask.", "Server", "text-green-400"),
    createTopic(6, "System Design", "/research/system-design", "Scalable architecture patterns and distributed systems.", "Terminal", "text-orange-400")
];
