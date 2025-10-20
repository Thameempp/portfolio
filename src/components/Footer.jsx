import { useState, useEffect, useRef } from 'react'
import { 
  FaEnvelope, FaMapMarkerAlt, FaArrowUp, 
  FaHome, FaUser, FaBriefcase, FaCode, FaPhoneAlt 
} from 'react-icons/fa'
import { HiCode } from 'react-icons/hi'

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef(null)

  const quickLinks = [
    { name: 'Home', href: '#home', icon: FaHome },
    { name: 'About', href: '#about', icon: FaUser },
    { name: 'Projects', href: '#projects', icon: FaBriefcase },
    { name: 'Skills', href: '#skills', icon: FaCode },
    { name: 'Contact', href: '#contact', icon: FaPhoneAlt }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer 
      ref={footerRef}
      className="bg-black text-white relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Top Section */}
        <div className={`grid md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-800 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <HiCode className="text-blue-400" />
              <span className="text-blue-400">&lt;</span>
              Thameem
              <span className="text-blue-400">/&gt;</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Building intelligent solutions with AI and crafting seamless web experiences.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-gray-400">Available for opportunities</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon
                return (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-all hover:translate-x-1 inline-flex items-center gap-2 text-sm group"
                    >
                      <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      {link.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-semibold mb-4 text-white">Get In Touch</h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:your@email.com"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <FaEnvelope className="text-lg group-hover:scale-110 transition-transform" />
                <span>muhammedthameempp@email.com</span>
              </a>
              <a
                href="https://www.google.com/maps?q=Malappuram,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <FaMapMarkerAlt className="text-lg text-red-500" />
                <span>Malappuram, India</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Thameem. All rights reserved.
          </p>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all hover:scale-105"
          >
            <span className="text-sm text-gray-300">Back to Top</span>
            <FaArrowUp className="text-blue-400 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Decorative Line */}
        <div className={`mt-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
