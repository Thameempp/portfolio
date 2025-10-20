import { useState, useEffect, useRef } from 'react'
import { 
  FaRobot, FaCode, FaGraduationCap, FaMapMarkerAlt, 
  FaBriefcase, FaRocket, FaLightbulb, FaBullseye, 
  FaSync, FaHandshake 
} from 'react-icons/fa'
import { 
  HiLightningBolt, HiChartBar, HiVideoCamera 
} from 'react-icons/hi'
import { 
  SiOpenai, SiReact, SiFastapi, SiPostgresql, 
  SiDocker, SiPython 
} from 'react-icons/si'
import { IoMdAnalytics } from 'react-icons/io'

const About = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredStat, setHoveredStat] = useState(null)
  const sectionRef = useRef(null)

  const stats = [
    { label: 'Projects Completed', value: '5+', color: 'from-blue-500 to-cyan-500' },
    { label: 'Technologies', value: '18+', color: 'from-purple-500 to-pink-500' },
    { label: 'Years Experience', value: '2+', color: 'from-green-500 to-emerald-500' },
    { label: 'Mini useful tools', value: '10+', color: 'from-orange-500 to-red-500' }
  ]

  const highlights = [
    { 
      icon: FaRobot, 
      title: 'AI Integration Expert',
      description: 'Specialized in OpenAI, voice synthesis, and video generation',
      tech: ['OpenAI', 'LangChain', 'Hugging Face']
    },
    { 
      icon: HiLightningBolt, 
      title: 'Full-Stack Developer',
      description: 'Building scalable applications with modern frameworks',
      tech: ['React', 'FastAPI', 'PostgreSQL']
    },
    { 
      icon: FaGraduationCap, 
      title: 'Educational Platforms',
      description: 'Creating innovative learning management systems',
      tech: ['Video Gen', 'Progress Tracking', 'Analytics']
    }
  ]

  const techIcons = {
    'AI/ML': FaRobot,
    'Python': SiPython,
    'FastAPI': SiFastapi,
    'React': SiReact,
    'AI APIs': SiOpenai,
    'PostgreSQL': SiPostgresql,
    'Docker': SiDocker
  }

  const details = [
    { icon: FaMapMarkerAlt, label: 'Location', value: 'Malappuram, India', color: 'text-blue-400' },
    { icon: FaBriefcase, label: 'Role', value: 'AI/ML Engineer', color: 'text-purple-400' },
    { icon: FaGraduationCap, label: 'Education', value: 'Bachelor of Science', color: 'text-green-400' },
    { icon: FaRocket, label: 'Passion', value: 'AI & Innovation', color: 'text-orange-400' }
  ]

  const qualities = [
    { icon: FaLightbulb, title: 'Problem Solving', desc: 'Creative solutions to complex challenges' },
    { icon: FaBullseye, title: 'Detail Oriented', desc: 'Pixel-perfect implementation' },
    { icon: FaSync, title: 'Continuous Learning', desc: 'Always exploring new technologies' },
    { icon: FaHandshake, title: 'Team Player', desc: 'Collaborative and communicative' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-20 px-4 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-white mb-3">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-sky-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className={`lg:col-span-2 space-y-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                Who I Am
              </h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  I'm a passionate <span className="text-blue-400 font-semibold">AI/ML Engineer</span> and <span className="text-purple-400 font-semibold">Python Backend Specialist</span> with a deep interest in building intelligent, data-driven web applications that merge powerful backend logic with smart, interactive frontends.
                </p>
                <p>
                  With expertise across <span className="text-green-400 font-semibold">Machine learning, Data science</span> and <span className="text-cyan-400 font-semibold">Modern Web Technologies and AI-powered solutions</span>, I specialize in developing scalable APIs, AI-integrated systems, and automation-driven platforms that bring intelligence to everyday software.
                </p>
                <p>
                 Driven by curiosity and precision, building intelligent systems where AI meets scalable performance.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {Object.entries(techIcons).map(([tech, Icon], i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all cursor-default flex items-center gap-2"
                  >
                    <Icon className="w-3 h-3" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {highlights.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all hover:-translate-y-1 group"
                  >
                    <div className="text-3xl mb-3 text-blue-400 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-gray-400 mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tech.map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-800/50 text-gray-500 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHoveredStat(index)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div className={`bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 transition-all ${hoveredStat === index ? 'scale-105 border-gray-600' : ''}`}>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-gray-400 leading-tight">
                        {stat.label}
                      </div>
                    </div>
                    {hoveredStat === index && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 rounded-xl blur-lg transition-opacity`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Details</h3>
              <div className="space-y-3">
                {details.map((detail, index) => {
                  const IconComponent = detail.icon
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <span className={detail.color}>
                        <IconComponent className="w-5 h-5" />
                      </span>
                      <div>
                        <div className="text-xs text-gray-500">{detail.label}</div>
                        <div className="text-sm text-white">{detail.value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <a
              href="#contact"
              className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-900 text-white text-center rounded-xl font-medium hover:from-blue-500 hover:to-blue-700 transition-all hover:shadow-lg hover:shadow-purple-500/50"
            >
              Let&apos;s Work Together
            </a>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
            <h3 className="text-xl font-bold text-white mb-4 text-center">What I Bring</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {qualities.map((item, i) => {
                const IconComponent = item.icon
                return (
                  <div key={i} className="text-center group">
                    <div className="text-3xl mb-2 text-blue-400 inline-block group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
