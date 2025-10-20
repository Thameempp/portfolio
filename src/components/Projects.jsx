import { useState, useEffect, useRef } from 'react'

// Import your project images
import project1Image from '../assets/projects/project1.jpg'
import project2Image from '../assets/projects/project2.jpg'
import project3Image from '../assets/projects/project3.jpg'
import project4Image from '../assets/projects/project4.jpg'

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const sectionRef = useRef(null)

  const projects = [
    {
      title: 'AI Video Generator',
      description: 'Educational platform with AI-powered video generation, voice synthesis, and live tutorials',
      tech: ['React', 'FastAPI', 'AI APIs', 'FFmpeg'],
      link: '#',
      demoLink: '#',
      githubLink: '#',
      features: ['Voice Synthesis', 'Live Tutorials', 'Video Generation'],
      image: project1Image // Add image
    },
    {
      title: 'Task Tracker',
      description: 'Comprehensive task management system with mentor-student architecture and progress analytics',
      tech: ['React', 'FastAPI', 'PostgreSQL', 'JWT'],
      link: '#',
      demoLink: '#',
      githubLink: '#',
      features: ['Progress Analytics', 'Real-time Tracking', 'Leaderboards'],
      image: project2Image // Add image
    },
    {
      title: 'Food Ordering System',
      description: 'Full-stack ordering platform with admin dashboard and customer management',
      tech: ['JavaScript', 'Python', 'SQLite'],
      link: '#',
      demoLink: '#',
      githubLink: '#',
      features: ['Admin Dashboard', 'Order Tracking', 'Inventory Management'],
      image: project3Image // Add image
    },
    {
      title: 'AI Chat App',
      description: 'WebSocket-based messaging platform with end-to-end encryption',
      tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      link: '#',
      demoLink: '#',
      githubLink: '#',
      features: ['End-to-End Encryption', 'File Sharing', 'Group Chats'],
      image: project4Image // Add image
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const sectionHeight = rect.height
        
        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollProgress = (windowHeight - rect.top) / (windowHeight + sectionHeight)
          const offset = scrollProgress * 3000
          setScrollOffset(offset)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <section 
        ref={sectionRef}
        id="projects" 
        className="py-20 px-4 bg-transparent relative overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3">
              Featured Projects
            </h2>
            <p className="text-gray-400">
              A collection of my recent work
            </p>
          </div>

          <div className="relative overflow-hidden py-8">
            <div 
              className="flex gap-6"
              style={{
                transform: `translateX(calc(100% - ${scrollOffset}px))`,
                transition: 'transform 0.1s linear'
              }}
            >
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 group relative"
                  onMouseEnter={() => setHoveredProject(index)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 h-full flex flex-col">
                    
                    {/* Image Preview Section */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                      {/* Project Image */}
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                      />
                      
                      {/* Code Preview Overlay (shows on hover) */}
                      <div className={`absolute inset-0 p-3 transition-all duration-300 ${hoveredProject === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                        <div className="bg-gray-900/95 rounded-lg h-full p-2 border border-gray-700">
                          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-gray-700">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-1.5 bg-blue-500/20 rounded w-3/4"></div>
                            <div className="h-1.5 bg-gray-700 rounded w-1/2"></div>
                            <div className="h-1.5 bg-gray-700 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>

                      {/* Buttons with Blur Background */}
                      <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ${hoveredProject === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {/* Blur background */}
                        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-md"></div>
                        
                        {/* Buttons */}
                        <a href={project.demoLink} className="relative z-10 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-500 transition-all shadow-lg hover:scale-105">
                          Demo
                        </a>
                        <a href={project.githubLink} className="relative z-10 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg font-medium hover:bg-gray-700 transition-all border border-gray-600 shadow-lg hover:scale-105">
                          Code
                        </a>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-1">
                        {project.description}
                      </p>
                      <div className="mb-3 space-y-1">
                        {project.features.slice(0, 2).map((feature, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="text-blue-500 text-[10px]">●</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tech.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600/50">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <a href={project.link} className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium group/link">
                        <span>Learn more</span>
                        <span className="group-hover/link:translate-x-0.5 transition-transform text-xs">→</span>
                      </a>
                    </div>

                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${hoveredProject === index ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="absolute inset-0 rounded-xl bg-blue-500/5 blur-xl"></div>
                    </div>
                  </div>

                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 right-4 text-gray-500 text-sm pointer-events-none flex items-center gap-2">
              <span>Scroll to reveal</span>
              <span className="animate-pulse">↓</span>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setShowAllProjects(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-all border border-gray-700 hover:border-gray-600"
            >
              <span>View All Projects</span>
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal - Same as before but with images */}
      {showAllProjects && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAllProjects(false)}>
          <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-3xl font-bold text-white">All Projects</h2>
                <p className="text-gray-400 text-sm mt-1">Complete portfolio showcase</p>
              </div>
              <button
                onClick={() => setShowAllProjects(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all hover:-translate-y-1">
                  <div className="relative h-40 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href={project.demoLink} className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-500 transition-all text-center">
                        Demo
                      </a>
                      <a href={project.githubLink} className="flex-1 px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg font-medium hover:bg-gray-600 transition-all text-center">
                        Code
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Projects
