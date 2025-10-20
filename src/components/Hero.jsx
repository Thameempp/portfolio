import { useState, useEffect, useRef } from 'react'
import SkillsCube from './SkillsCube'
import styles from './Hero.module.css'

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [currentRole, setCurrentRole] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef(null)
  const fullText = 'Thameem'
  
  const roles = [
    'AI/ML Developer',
    'Full-Stack AI Developer',
    'Machine Learning Specialist',
    'Python Backend Developer',
    'AI Architect',
    'Deep Learning Enthusiast',
    'AI Product Developer',
    'Tech Innovator',
    'Data Science Practitioner',
    'AI Systems Builder',
    'Backend Automation Developer',
    'Generative AI Creator',
    'AI Infrastructure Developer',
    'Software Innovator (AI & Python)',
    'ML Ops Enthusiast'
  ]

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        setIsTypingComplete(true)
        clearInterval(typingInterval)
      }
    }, 150)

    return () => clearInterval(typingInterval)
  }, [])

  useEffect(() => {
    if (isTypingComplete) {
      const roleInterval = setInterval(() => {
        setCurrentRole((prev) => (prev + 1) % roles.length)
      }, 3000)

      return () => clearInterval(roleInterval)
    }
  }, [isTypingComplete])

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const sectionHeight = rect.height
        const scrolled = -rect.top
        const progress = Math.min(scrolled / (sectionHeight * 0.5), 1)
        setScrollProgress(progress)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      ref={sectionRef}
      id="home" 
      className={styles.heroSection}
      style={{
        opacity: 1 - scrollProgress * 0.8,
        transform: `translateY(${scrollProgress * -50}px) scale(${1 - scrollProgress * 0.1})`
      }}
    >
      {/* 3D Skills Cube */}
      <div className="absolute bottom-60 right-0 md:right-10 w-full md:w-[700px] h-[700px] md:h-[600px] opacity-80 hidden md:block pointer-events-none z-0">
        <SkillsCube />
      </div>

      <div className={styles.heroContent}>
        <p className={`${styles.welcomeText} text-sm mb-4 font-mono ${styles.fadeIn}`}>
          <span className="text-gray-700">{'// '}</span>Welcome to my digital space
        </p>

       <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${styles.fadeIn}`}>
  <span className={styles.greetingText}>
    H
    <span className={styles.dotContainer}>
      {/* i without its dot (using lowercase L or custom font) */}
      <span className={styles.noDot}>ı</span>
      {/* Custom animated dot */}
      <span className={styles.customDot}></span>
    </span>
    , I&apos;m 
  </span>
  <span className="block mt-2" style={{ minHeight: '100px' }}>
    <span 
      className={styles.nameGradient}
      style={{ display: 'inline-block', minWidth: '300px' }}
    >
      {displayedText || 'Thameem'}
    </span>
    {!isTypingComplete && (
      <span className={styles.cursor}>|</span>
    )}
  </span>
</h1>


        <div className="h-10 mb-6 relative overflow-hidden">
          {roles.map((role, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center transition-all duration-500 ${
                currentRole === index
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <span className={`${styles.roleText} text-xl`}>{role}</span>
            </div>
          ))}
        </div>

        <p className={`text-xl ${styles.descriptionText} mb-10 max-w-2xl leading-relaxed`}>
          Crafting intelligent solutions with <span className={styles.accentBlue}>AI</span> and building seamless experiences with <span className={styles.accentPurple}>modern web technologies</span>.
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <a
            href="#projects"
            className={`${styles.btnPrimary} flex items-center gap-2 group`}
          >
            <span>View Projects</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#contact"
            className={styles.btnSecondary}
          >
            Let&apos;s Talk
          </a>
          <a
            href="#about"
            className={`${styles.btnTertiary} flex items-center gap-2`}
          >
            <span>Learn more</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        <div className="border-t border-b border-gray-800 py-6 overflow-hidden">
          <div className={`flex items-center gap-8 ${styles.techTagMarquee}`}>
            {['Python', 'React', 'FastAPI', 'TensorFlow', 'PostgreSQL', 'Docker', 'TypeScript', 'OpenAI'].map((tech, index) => (
              <span key={index} className={styles.techTag}>
                {tech}
              </span>
            ))}
            {['Python', 'React', 'FastAPI', 'TensorFlow', 'PostgreSQL', 'Docker', 'TypeScript', 'OpenAI'].map((tech, index) => (
              <span key={`dup-${index}`} className={styles.techTag}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Scroll Arrow */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 hover:text-blue-400 transition-all cursor-pointer group"
        aria-label="Scroll to next section"
      >
        <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Scroll</span>
        <div className="relative">
          {/* Line */}
          <div className={styles.scrollIndicator}></div>
          {/* Animated Arrows */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col gap-1">
            <svg 
              className="w-4 h-4 animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ animationDelay: '0s' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </button>
    </section>
  )
}

export default Hero
