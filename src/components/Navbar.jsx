import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [clickedItem, setClickedItem] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Journey', id: 'experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
    { label: 'Research', id: 'research', path: '/research' }
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
      // Only run scroll spy on home page
      if (location.pathname !== '/') {
        setActiveSection('')
        return
      }

      const sections = navItems.filter(item => !item.path).map(item => item.id)
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
  }, [navItems, location.pathname])

  const handleClick = (item) => {
    setClickedItem(item.id)
    setTimeout(() => setClickedItem(''), 400)

    if (item.path) {
      navigate(item.path)
      setIsOpen(false)
    } else {
      // It's a section link
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: item.id } })
      } else {
        const element = document.getElementById(item.id)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }
      setIsOpen(false)
    }
  }

  // Handle scroll after navigation
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
        // Clear state
        navigate('/', { replace: true, state: {} })
      }
    }
  }, [location])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('nav')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${scrolled
        ? 'bg-black/95 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
        }`}
      style={{
        borderBottom: scrolled ? '1px solid rgb(31, 41, 55)' : '1px solid transparent',
        transition: 'border-color 0.5s ease-in-out, background-color 0.5s ease-in-out, backdrop-filter 0.5s ease-in-out'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-center items-center h-14 sm:h-16 relative">
          {/* Desktop Menu - Centered (unchanged) */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              // Check if strictly active (path match) or section active (scroll spy)
              const isPathActive = item.path && (
                item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
              )
              const isSectionActive = !item.path && activeSection === item.id
              const isActive = isPathActive || isSectionActive

              const isClicked = clickedItem === item.id

              return (
                <a
                  key={item.id}
                  href={item.path ? item.path : `#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleClick(item)
                  }}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${isActive
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-white'
                    }`}
                >
                  <span className={`transition-all duration-200 ${isClicked ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
                    } inline-block`}
                    style={item.id === 'research' ? { fontFamily: "'Caveat', cursive", fontSize: '1.25rem', fontWeight: 700, color: '#93c5fd' } : {}}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 rounded-full"></span>
                  )}
                </a>
              )
            })}
          </div>

          {/* Mobile Menu Button - Top Right Corner */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            className="md:hidden absolute right-0 p-2 text-white hover:text-blue-400 transition-all rounded-lg hover:bg-gray-800/50 active:scale-95"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'
                }`}
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

        {/* Mobile/Tablet Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100 pb-3' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="bg-black/95 backdrop-blur-md rounded-xl mt-2 p-2 border border-gray-800 shadow-xl">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id && !item.path
              const isClicked = clickedItem === item.id

              return (
                <a
                  key={item.id}
                  href={item.path ? item.path : `#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    if (item.path) {
                      handleClick(item)
                    } else {
                      handleClick(item)
                      const element = document.getElementById(item.id)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                      setTimeout(() => setIsOpen(false), 300)
                    }
                  }}
                  className={`block px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'text-gray-300 hover:bg-gray-800/80 hover:text-white active:bg-gray-700'
                    }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 40}ms` : '0ms',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
                  }}
                >
                  <span className={`transition-all duration-200 ${isClicked ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
                    } flex items-center justify-between`}>
                    <span className="flex items-center gap-2">
                      {/* Icon indicator */}
                      <span className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-white' : 'bg-gray-600'
                        }`}></span>
                      <span style={item.id === 'research' ? { fontFamily: "'Caveat', cursive", fontSize: '1.25rem', fontWeight: 700, color: '#93c5fd' } : {}}>
                        {item.label}
                      </span>
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></span>
                    )}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  )
}

export default Navbar
