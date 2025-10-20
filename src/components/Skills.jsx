import { useState, useEffect, useRef } from 'react'
import GridWave3D from './GridWave3D'
import { 
  SiTensorflow, SiPytorch, SiOpenai, SiPython, 
  SiFastapi, SiDjango, SiPostgresql, SiRedis, 
  SiDocker, SiReact, SiTypescript, SiTailwindcss,
  SiAmazon, // Changed from SiAmazonaws to SiAmazon
  SiKubernetes
} from 'react-icons/si'
import { FaRobot, FaEye, FaCloud } from 'react-icons/fa'
import { HiLightningBolt } from 'react-icons/hi'

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSkill, setActiveSkill] = useState(null)
  const sectionRef = useRef(null)

  const skills = [
    {
      category: 'AI & ML',
      primary: true,
      skills: [
        { name: 'TensorFlow', level: 1, color: '#FF6F00', icon: SiTensorflow },
        { name: 'PyTorch', level: 1, color: '#EE4C2C', icon: SiPytorch },
        { name: 'OpenAI API', level: 1, color: '#10A37F', icon: SiOpenai },
        { name: 'Hugging Face', level: 1, color: '#FFD21E', icon: FaRobot },
        { name: 'LangChain', level: 1, color: '#1C3C3C', icon: HiLightningBolt },
        { name: 'Computer Vision', level: 1, color: '#00D4FF', icon: FaEye }
      ]
    },
    {
      category: 'Backend',
      primary: true,
      skills: [
        { name: 'Python', level: 82, color: '#3776AB', icon: SiPython },
        { name: 'FastAPI', level: 79, color: '#009688', icon: SiFastapi },
        { name: 'Django', level: 75, color: '#092E20', icon: SiDjango },
        { name: 'PostgreSQL', level: 88, color: '#336791', icon: SiPostgresql },
        { name: 'Redis', level: 1, color: '#DC382D', icon: SiRedis },
        { name: 'Docker', level: 20, color: '#2496ED', icon: SiDocker }
      ]
    },
    {
      category: 'Frontend (Using AI)',
      primary: false,
      skills: [
        { name: 'React', level: 88, color: '#61DAFB', icon: SiReact },
        { name: 'TypeScript', level: 82, color: '#3178C6', icon: SiTypescript },
        { name: 'Tailwind', level: 85, color: '#06B6D4', icon: SiTailwindcss }
      ]
    },
    {
      category: 'DevOps',
      primary: false,
      skills: [
        { name: 'AWS', level: 1, color: '#FF9900', icon: SiAmazon }, // Fixed icon
        { name: 'CI/CD', level: 1, color: '#2088FF', icon: HiLightningBolt },
        { name: 'Kubernetes', level: 1, color: '#326CE5', icon: SiKubernetes }
      ]
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-16 px-4 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-white mb-2">Technical Stack</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-sky-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((category, catIndex) => (
            <div
              key={catIndex}
              className={`relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{
                transitionDelay: `${catIndex * 0.1}s`
              }}
            >
              <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 hover:border-gray-600 transition-all duration-300 ${category.primary ? 'md:col-span-1' : ''}`}>
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {category.category}
                </h3>

                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => {
                    const isActive = activeSkill === `${catIndex}-${skillIndex}`
                    const IconComponent = skill.icon
                    
                    return (
                      <div
                        key={skillIndex}
                        className="group relative"
                        onMouseEnter={() => setActiveSkill(`${catIndex}-${skillIndex}`)}
                        onMouseLeave={() => setActiveSkill(null)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${
                              isActive ? 'scale-110 shadow-lg' : 'scale-100'
                            }`}
                            style={{
                              backgroundColor: `${skill.color}20`,
                              color: skill.color,
                              boxShadow: isActive ? `0 0 20px ${skill.color}40` : 'none'
                            }}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-white truncate">
                                {skill.name}
                              </span>
                              <span className="text-[10px] text-gray-500 ml-2">
                                {skill.level}%
                              </span>
                            </div>

                            <div className="relative h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                              <div
                                className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: isVisible ? `${skill.level}%` : '0%',
                                  backgroundColor: skill.color,
                                  boxShadow: `0 0 10px ${skill.color}60`,
                                  transitionDelay: `${(catIndex * 0.1) + (skillIndex * 0.05)}s`
                                }}
                              >
                                <div
                                  className="absolute inset-0 opacity-50"
                                  style={{
                                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                                    animation: 'shimmer 2s infinite',
                                    transform: isActive ? 'translateX(0)' : 'translateX(-100%)'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`absolute -inset-2 rounded-lg pointer-events-none transition-opacity duration-300 ${
                            isActive ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            background: `radial-gradient(circle at center, ${skill.color}10, transparent)`,
                            filter: 'blur(10px)'
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Grid Wave Animation */}
        <div className={`mt-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <GridWave3D />
        </div>
      </div>
    </section>
  )
}

export default Skills
