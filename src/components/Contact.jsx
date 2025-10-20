import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { 
  FaEnvelope, FaLinkedin, FaGithub, 
  FaTwitter, FaPaperPlane, FaComments 
} from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'
import { BsTwitterX } from 'react-icons/bs'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const sectionRef = useRef(null)
  const formRef = useRef(null)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSending(true)
    setStatusMessage('')
    
    // Create template params that match your EmailJS template
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'Thameem', // Your name
    }
    
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setStatusMessage('✅ Message sent successfully! I\'ll get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setIsSending(false)
    })
    .catch((error) => {
      setStatusMessage('❌ Failed to send message. Please try emailing me directly.')
      setIsSending(false)
      console.error('EmailJS Error:', error)
    })
  }

  const contactCards = [
    {
      icon: FaEnvelope,
      title: 'Email',
      subtitle: 'Drop me a line',
      value: 'muhammedthameempp@gmail.com',
      link: 'mailto:muhammedthameempp@gmail.com',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: FaLinkedin,
      title: 'LinkedIn',
      subtitle: 'Let\'s connect',
      value: '@Thameem Pp',
      link: 'https://www.linkedin.com/in/thameem-pp/',
      color: 'from-blue-700 to-blue-900'
    },
    {
      icon: FaGithub,
      title: 'GitHub',
      subtitle: 'Check my repos',
      value: '@Thameempp',
      link: 'https://github.com/Thameempp',
      color: 'from-gray-700 to-gray-900'
    },
    {
      icon: BsTwitterX,
      title: 'X',
      subtitle: 'Follow updates',
      value: '@Thameem_pp',
      link: 'https://x.com/Thameem_pp',
      color: 'from-gray-900 to-black-800'
    }
  ]

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="py-20 px-4 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-gray-400 text-lg">Let&apos;s build something amazing together</p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-sky-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {contactCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <a
                key={index}
                href={card.link}
                target={card.link.startsWith('http') ? '_blank' : '_self'}
                rel={card.link.startsWith('http') ? 'noopener noreferrer' : ''}
                className={`group bg-gradient-to-br ${card.color} rounded-xl p-6 hover:scale-105 transition-all shadow-lg hover:shadow-2xl`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-10 h-10" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{card.title}</h3>
                <p className="text-white/70 text-xs mb-2">{card.subtitle}</p>
                <p className="text-white/90 text-sm font-medium">{card.value}</p>
              </a>
            )
          })}
        </div>

        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-gray-700/30">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Send a Message</h3>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  name="from_name"
                  className="w-full px-5 py-4 rounded-xl border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  name="from_email"
                  className="w-full px-5 py-4 rounded-xl border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <textarea
                  rows="5"
                  name="message"
                  className="w-full px-5 py-4 rounded-xl border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project or just say hi!"
                  required
                ></textarea>
              </div>

              {statusMessage && (
                <div className={`text-center p-4 rounded-xl ${
                  statusMessage.includes('✅') 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-900 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-700 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <span>Sending...</span>
                    <FaPaperPlane className="w-5 h-5 animate-pulse" />
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className={`text-center mt-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <FaComments className="w-4 h-4" />
            <span className="text-white font-medium">Open to opportunities!</span> 
            Quick turn around guaranteed
          </p>
        </div>
      </div>
    </section>
  )
}

export default Contact
