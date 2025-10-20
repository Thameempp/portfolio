import { useState, useEffect, useRef } from 'react'
import SkillsCube from './SkillsCube'
import styles from './Hero.module.css'

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [currentRole, setCurrentRole] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      {/* 3D Skills Cube - Smaller on mobile, fully visible */}
      <div className={`absolute pointer-events-none ${
        isMobile 
          ? 'inset-0 z-0 flex items-center justify-center opacity-20 scale-75' 
          : 'bottom-60 right-0 md:right-10 w-full md:w-[700px] h-[700px] md:h-[600px] opacity-80 z-0'
      }`}>
        <SkillsCube isMobile={isMobile} />
      </div>

      {/* Content - Moved higher on mobile */}
      <div className={`${styles.heroContent} relative z-10 ${
        isMobile ? 'flex flex-col items-center text-center px-4 pt-16' : ''
      }`}>
        {/* Welcome text - Moved to very top */}
        <p className={`${styles.welcomeText} font-mono ${styles.fadeIn} ${
          isMobile ? 'text-xs mb-2' : 'text-sm mb-4'
        }`}>
          <span className="text-gray-700">{'// '}</span>Welcome to my digital space
        </p>

        {/* "Hi, I'm Thameem" - Bigger text, moved up */}
        <h1 className={`font-bold ${styles.fadeIn} ${
          isMobile ? 'text-5xl mb-2' : 'text-6xl md:text-8xl mb-6'
        }`}>
          <span className={styles.greetingText}>
            H
            <span className={styles.dotContainer}>
              <span className={styles.noDot}>ı</span>
              <span className={styles.customDot}></span>
            </span>
            , I&apos;m 
          </span>
          <span className="block mt-2" style={{ minHeight: isMobile ? '70px' : '100px' }}>
            <span 
              className={styles.nameGradient}
              style={{ 
                display: 'inline-block', 
                minWidth: isMobile ? '240px' : '300px'
              }}
            >
              {displayedText || 'Thameem'}
            </span>
            {!isTypingComplete && (
              <span className={styles.cursor}>|</span>
            )}
          </span>
        </h1>

        {/* Roles - Moved higher */}
        <div className={`relative overflow-hidden ${
          isMobile ? 'h-10 w-full flex justify-center mb-3' : 'h-10 md:h-10 mb-6'
        }`}>
          {roles.map((role, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center ${
                isMobile ? 'justify-center' : ''
              } transition-all duration-500 ${
                currentRole === index
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <span className={`${styles.roleText} ${isMobile ? 'text-base' : 'text-xl'}`}>
                {role}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className={`${styles.descriptionText} leading-relaxed ${
          isMobile ? 'text-xs max-w-sm px-2 mb-5' : 'text-xl max-w-2xl mb-10'
        }`}>
          Architecting and delivering robust, end-to-end <span className={styles.accentBlue}>AI, ML</span> systems to create efficient, scalable, high-performance solutions to tackle complex challenges via <span className={styles.accentPurple}>Data Science</span>.
        </p>

        {/* Buttons - Increased width */}
        <div className={`flex gap-3 ${
          isMobile ? 'flex-col items-center w-full max-w-sm mb-6' : 'flex-wrap mb-12'
        }`}>
          <a
            href="#projects"
            className={`${styles.btnPrimary} flex items-center justify-center gap-2 group ${
              isMobile ? 'py-2.5 px-8 text-sm w-full' : 'px-6 py-3'
            }`}
          >
            <span>View Projects</span>
            <svg className={`group-hover:translate-x-1 transition-transform ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#contact"
            className={`${styles.btnSecondary} text-center ${
              isMobile ? 'py-2.5 px-8 text-sm w-full' : 'px-6 py-3'
            }`}
          >
            Let&apos;s Talk
          </a>
          <a
            href="#about"
            className={`${styles.btnTertiary} flex items-center justify-center gap-2 ${
              isMobile ? 'py-2.5 px-8 text-sm w-full' : 'px-6 py-3'
            }`}
          >
            <span>Learn more</span>
            <svg className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Tech Tags */}
        <div className={`border-t border-b border-gray-800 overflow-hidden ${
          isMobile ? 'w-full py-3' : 'py-6'
        }`}>
          <div className={`flex items-center gap-4 sm:gap-8 ${styles.techTagMarquee}`}>
            {['Python', 'React', 'FastAPI', 'TensorFlow', 'PostgreSQL', 'Docker', 'TypeScript', 'OpenAI'].map((tech, index) => (
              <span key={index} className={`${styles.techTag} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {tech}
              </span>
            ))}
            {['Python', 'React', 'FastAPI', 'TensorFlow', 'PostgreSQL', 'Docker', 'TypeScript', 'OpenAI'].map((tech, index) => (
              <span key={`dup-${index}`} className={`${styles.techTag} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Arrow */}
      <button
        onClick={scrollToAbout}
        className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-2 text-gray-400 hover:text-blue-400 transition-all cursor-pointer group ${
          isMobile ? 'bottom-6' : 'bottom-8'
        }`}
        aria-label="Scroll to next section"
      >
        <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Scroll</span>
        <div className="relative">
          <div className={styles.scrollIndicator}></div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col gap-1">
            <svg 
              className={`animate-bounce ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
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
