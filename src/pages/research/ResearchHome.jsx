import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ICON_MAP } from '../../data/researchTopics';
import { Book } from 'lucide-react'; // Fallback icon

const TopicCard = ({ title, icon: Icon, path, description, color }) => (
    <Link
        to={path}
        className="group relative p-6 rounded-xl bg-gray-900/40 border border-gray-800/60 hover:border-gray-700 hover:bg-gray-900/60 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${color}`}>
            {Icon && <Icon size={100} />}
        </div>

        <div className={`w-12 h-12 rounded-lg bg-gray-800/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${color}`}>
            {Icon && <Icon size={24} />}
        </div>

        <h3 className="text-xl font-bold text-gray-100 mb-2 z-10">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed z-10">{description}</p>

        <div className="mt-auto pt-4 flex items-center text-xs font-medium text-gray-500 group-hover:text-blue-400 transition-colors z-10">
            <span>Explore notes</span>
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
    </Link>
);

const ResearchHome = () => {
    const { topics } = useOutletContext();

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Research Notes</h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    A collection of my technical notes, learnings, and experiments.
                    Select a topic below to verify the archives.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic, index) => {
                    const IconComponent = ICON_MAP[topic.icon] || Book;
                    return (
                        <TopicCard
                            key={topic.id || index}
                            {...topic}
                            icon={IconComponent}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ResearchHome;
