import React, { useEffect, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import { githubService, DEFAULT_REPO_CONFIG, getRepoConfig } from '../../services/github';
import { Loader, Calendar, User, Github, AlertTriangle, ExternalLink, Image as ImageIcon, FileCode } from 'lucide-react';
import { format } from 'date-fns';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css'; // Syntax highlighting theme

const TableOfContents = ({ content }) => {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        if (!content) return;
        const lines = content.split('\n');
        const extracted = [];
        lines.forEach(line => {
            const match = line.match(/^(#{2,4})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2];
                const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                extracted.push({ id, text, level });
            }
        });
        setHeadings(extracted);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: '0px 0px -80% 0px' }
        );
        document.querySelectorAll('h2, h3, h4').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="hidden xl:block w-64 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto pr-4">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-6 px-4 opactiy-80">On this page</h4>
            <ul className="space-y-1">
                {headings.map((heading, index) => (
                    <li key={`${heading.id}-${index}`} className={`relative`}>
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                setActiveId(heading.id);
                            }}
                            className={`
                                block py-1.5 text-[13px] leading-snug transition-all duration-200 border-l-2 pl-4 pr-2 rounded-r-md
                                ${activeId === heading.id
                                    ? 'border-blue-500 text-blue-400 bg-blue-500/5 font-medium'
                                    : 'border-transparent hover:border-gray-700'}
                                ${activeId !== heading.id && heading.level === 2 ? 'text-gray-200 font-semibold hover:text-white' : ''}
                                ${activeId !== heading.id && heading.level >= 3 ? 'text-gray-400 italic font-normal hover:text-gray-300' : ''}
                                ${heading.level === 3 ? 'ml-2' : ''}
                                ${heading.level === 4 ? 'ml-4' : ''}
                            `}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const FileViewer = () => {
    const location = useLocation();
    const { topics } = useOutletContext();
    const [content, setContent] = useState('');
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filePath = decodeURIComponent(location.pathname.replace(/^\/research\/[\w-]+\//, '')); // Remove /research/topic-name/ prefix more robustly or just rely on the logic below
    // Actually, logical way:
    const currentTopic = topics?.find(t => location.pathname.startsWith(t.path));
    // If path is /research/topic/folder/file.md, and topic path is /research/topic
    // Relative path is location.pathname.replace(currentTopic.path + '/', '')

    const relativePath = currentTopic
        ? decodeURIComponent(location.pathname.substring(currentTopic.path.length + 1))
        : '';

    const extension = relativePath.split('.').pop().toLowerCase();
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension);
    const isMarkdown = ['md', 'txt'].includes(extension);
    const isNotebook = extension === 'ipynb';
    const isPdf = extension === 'pdf';
    const isCode = !isImage && !isMarkdown && !isNotebook && !isPdf;

    useEffect(() => {
        if (!relativePath || !currentTopic) return;

        let currentBlobUrl = null;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const topicConfig = currentTopic.repoConfig;
                if (!topicConfig || !topicConfig.owner || !topicConfig.repo) {
                    throw new Error("Repository configuration is missing or invalid.");
                }

                // Merge token from global settings if topic doesn't have one
                const globalConfig = getRepoConfig();
                const config = {
                    ...topicConfig,
                    token: topicConfig.token || globalConfig.token || ''
                };

                if (isPdf) {
                    // Fetch blob and metadata in parallel, metadata is non-blocking
                    const blobPromise = githubService.fetchFileBlob(config, relativePath);
                    const metaPromise = githubService.fetchFileMetadata(config, relativePath).catch(() => null);

                    const [fileBlob, fileMetadata] = await Promise.all([blobPromise, metaPromise]);
                    const pdfBlob = new Blob([fileBlob], { type: 'application/pdf' });
                    currentBlobUrl = URL.createObjectURL(pdfBlob);
                    setContent(currentBlobUrl);
                    setMetadata(fileMetadata);
                } else if (isImage) {
                    // Use blob approach for images too (works for private repos)
                    const blobPromise = githubService.fetchFileBlob(config, relativePath);
                    const metaPromise = githubService.fetchFileMetadata(config, relativePath).catch(() => null);

                    const [fileBlob, fileMetadata] = await Promise.all([blobPromise, metaPromise]);
                    const mimeType = extension === 'svg' ? 'image/svg+xml' : `image/${extension === 'jpg' ? 'jpeg' : extension}`;
                    const imgBlob = new Blob([fileBlob], { type: mimeType });
                    currentBlobUrl = URL.createObjectURL(imgBlob);
                    setContent(currentBlobUrl);
                    setMetadata(fileMetadata);
                } else {
                    // Text-based files: md, txt, ipynb, csv, js, ts, py, json, etc.
                    const contentPromise = githubService.fetchFileContent(config, relativePath);
                    const metaPromise = githubService.fetchFileMetadata(config, relativePath).catch(() => null);

                    const [fileContent, fileMetadata] = await Promise.all([contentPromise, metaPromise]);

                    if (isNotebook) {
                        try {
                            const notebook = JSON.parse(fileContent);
                            let mdContent = '';
                            notebook.cells.forEach(cell => {
                                if (cell.cell_type === 'markdown') {
                                    mdContent += cell.source.join('') + '\n\n';
                                } else if (cell.cell_type === 'code') {
                                    mdContent += '```python\n' + cell.source.join('') + '\n```\n\n';
                                }
                            });
                            setContent(mdContent);
                        } catch (e) {
                            throw new Error("Failed to parse notebook file");
                        }
                    } else if (isCode) {
                        setContent(`\`\`\`${extension}\n${fileContent}\n\`\`\``);
                    } else {
                        setContent(fileContent);
                    }
                    setMetadata(fileMetadata);
                }
            } catch (err) {
                console.error("Failed to fetch file:", err);
                setError(err.message || "Failed to load content");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            if (currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
            }
        };
    }, [relativePath, extension, currentTopic]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
                <Loader className="animate-spin mb-4" size={32} />
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-400">
                <AlertTriangle size={48} className="mb-4 opacity-50" />
                <h2 className="text-xl font-bold mb-2">Error Loading File</h2>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    if (!currentTopic || !currentTopic.repoConfig) return null;

    const { owner, repo, branch } = currentTopic.repoConfig;
    const cleanRepo = repo.replace(/\.git$/, '');
    const githubUrl = `https://github.com/${owner}/${cleanRepo}/blob/${branch}/${relativePath}`;

    return (
        <div className="flex relative">
            <div className="flex-1 min-w-0 pb-10">
                {/* Header */}
                <div className="mb-12 pb-8 border-b border-gray-800/50 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        {isImage ? <ImageIcon className="text-blue-400 opacity-80" size={48} /> :
                            isCode ? <FileCode className="text-green-400 opacity-80" size={48} /> : null}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 break-words tracking-tight leading-tight max-w-4xl mx-auto">
                        {filePath.split('/').pop().replace(/\.(md|ipynb|txt)$/, '')}
                    </h1>

                    <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-blue-400 transition-colors mt-2 opacity-60 hover:opacity-100">
                        <Github size={12} />
                        <span>View source on GitHub</span>
                    </a>
                </div>

                {/* Content */}
                {isPdf ? (
                    <div className="w-full h-[85vh] bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                        <iframe
                            src={content}
                            className="w-full h-full border-0"
                            title="PDF Viewer"
                        />
                    </div>
                ) : isImage ? (
                    <div className="flex justify-center bg-gray-900/30 rounded-xl border border-gray-800 p-4">
                        <img src={content} alt={filePath} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
                    </div>
                ) : (
                    <article className="prose prose-invert prose-lg max-w-3xl mx-auto
                        prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-gray-100
                        prose-h1:text-4xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-gray-800
                        prose-p:text-gray-300 prose-p:leading-7 prose-p:mb-6
                        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-100 prose-strong:font-semibold
                        prose-code:text-blue-300 prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-gray-700/50 prose-pre:rounded-xl prose-pre:shadow-sm
                        prose-li:text-gray-300 prose-li:my-1.5
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-gray-800/50
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500/50 prose-blockquote:bg-blue-500/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-300
                        prose-hr:border-gray-800/50 prose-hr:my-12
                    ">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeHighlight, rehypeKatex]}
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-bold border-b border-gray-800 pb-4 mb-8 mt-10 scroll-mt-32 tracking-tight text-white" {...props} />,
                                h2: ({ node, ...props }) => {
                                    const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                    return <h2 id={id} className="text-2xl md:text-3xl font-bold mt-16 mb-6 scroll-mt-32 group flex items-center tracking-tight text-white" {...props}>
                                        {props.children}
                                        <a href={`#${id}`} className="ml-3 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-400 no-underline text-lg">#</a>
                                    </h2>
                                },
                                h3: ({ node, ...props }) => {
                                    const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                    return <h3 id={id} className="text-xl md:text-2xl font-semibold mt-10 mb-4 scroll-mt-32 group flex items-center text-gray-100 tracking-tight" {...props}>
                                        {props.children}
                                        <a href={`#${id}`} className="ml-2 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-400 no-underline text-base">#</a>
                                    </h3>
                                },
                                h4: ({ node, ...props }) => <h4 className="text-lg md:text-xl font-semibold mt-8 mb-3 text-gray-200 scroll-mt-32" {...props} />,
                                h5: ({ node, ...props }) => <h5 className="text-base md:text-lg font-medium mt-6 mb-2 text-gray-300 scroll-mt-32 uppercase tracking-wide" {...props} />,
                                h6: ({ node, ...props }) => <h6 className="text-base font-medium mt-6 mb-2 text-gray-400 scroll-mt-32 italic" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-2 my-4 text-gray-300" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 space-y-2 my-4 text-gray-300" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1 leading-relaxed" {...props} />,
                                paragraph: ({ node, ...props }) => <p className="mb-6 leading-7 text-[17px] text-gray-300/90" {...props} />,
                                // Special handling for code blocks to fix double-rendering issues
                                pre: ({ node, ...props }) => <pre {...props} />,
                                code: ({ node, inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <div className="relative group my-8 rounded-xl overflow-hidden border border-gray-700/50 shadow-sm">
                                            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-700/50">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono font-medium uppercase tracking-wider">
                                                    {match[1]}
                                                </div>
                                            </div>
                                            <code className={`${className} !p-6 block overflow-x-auto text-sm leading-relaxed font-mono bg-[#282c34]`} {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    ) : (
                                        <code className="bg-gray-800/50 px-1.5 py-0.5 rounded text-[0.9em] text-blue-300 font-mono border border-gray-700/50" {...props}>
                                            {children}
                                        </code>
                                    )
                                },
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-blue-500 bg-blue-500/5 pl-6 py-4 my-8 rounded-r-lg text-gray-300 italic shadow-sm" {...props} />
                                ),
                                img: ({ node, ...props }) => (
                                    <figure className="my-10">
                                        <img className="rounded-xl border border-gray-800 shadow-2xl block mx-auto" {...props} />
                                        {props.alt && (
                                            <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
                                                {props.alt}
                                            </figcaption>
                                        )}
                                    </figure>
                                ),
                                a: ({ node, children, ...props }) => {
                                    const isExternal = props.href && (props.href.startsWith('http') || props.href.startsWith('https'));
                                    return (
                                        <a
                                            {...props}
                                            className="text-blue-400 hover:text-blue-300 transition-colors border-b border-blue-400/30 hover:border-blue-300 pb-0.5 no-underline hover:no-underline inline-flex items-center gap-0.5 font-medium"
                                            target={isExternal ? "_blank" : undefined}
                                            rel={isExternal ? "noopener noreferrer" : undefined}
                                        >
                                            {children}
                                            {isExternal && <ExternalLink size={12} className="inline ml-0.5 opacity-70" />}
                                        </a>
                                    );
                                },
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </article>
                )}
            </div>

            {/* TOC only for Markdown/Notebooks */}
            {(isMarkdown || isNotebook) && <TableOfContents content={content} />}
        </div>
    );
};

export default FileViewer;
