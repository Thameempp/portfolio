import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [clickedItem, setClickedItem] = useState('')

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Journey', id: 'experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about')
      
      if (aboutSection) {
        const aboutTop = aboutSection.offsetTop
        const aboutHeight = aboutSection.offsetHeight
        const halfwayPoint = aboutTop + (aboutHeight * 0.5)
        const currentScroll = window.scrollY
        
        setScrolled(currentScroll >= halfwayPoint)
      } else {
        setScrolled(window.scrollY > 200)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id)
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navItems])

  const handleClick = (id) => {
    setClickedItem(id)
    setTimeout(() => setClickedItem(''), 400)
  }

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
      style={{
        borderBottom: scrolled ? '1px solid rgb(31, 41, 55)' : '1px solid transparent',
        transition: 'border-color 0.5s ease-in-out, background-color 0.5s ease-in-out, backdrop-filter 0.5s ease-in-out'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              const isClicked = clickedItem === item.id
              
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => handleClick(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-400' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className={`transition-all duration-200 ${
                    isClicked ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
                  } inline-block`}>
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 rounded-full"></span>
                  )}
                </a>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:text-blue-400 transition-all"
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6 transition-transform duration-300"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-black/95 backdrop-blur-md rounded-lg mt-2 p-2 border border-gray-800">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id
              const isClicked = clickedItem === item.id
              
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    handleClick(item.id)
                    setTimeout(() => setIsOpen(false), 200)
                  }}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <span className={`transition-all duration-200 ${
                    isClicked ? 'opacity-70' : 'opacity-100'
                  } flex items-center justify-between`}>
                    {item.label}
                    {isActive && (
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    )}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
