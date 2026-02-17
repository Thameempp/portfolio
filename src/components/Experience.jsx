import { useState, useEffect, useRef } from 'react'
import { dbService } from '../services/db'

const Experience = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [timeline, setTimeline] = useState([])
  const sectionRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const data = await dbService.getCollection('journey')
        if (data && data.length > 0) {
          setTimeline(data)
        }
      } catch (e) {
        console.error('Failed to load journey from Firebase', e)
      }
    }
    fetchJourney()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current) }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const sectionHeight = rect.height
        const windowHeight = window.innerHeight

        if (rect.top < windowHeight && rect.bottom > 0) {
          const progress = Math.min(Math.max((windowHeight - rect.top) / sectionHeight, 0), 1)
          setScrollProgress(progress)
        }

        itemRefs.current.forEach((ref, index) => {
          if (ref) {
            const itemRect = ref.getBoundingClientRect()
            const itemCenter = itemRect.top + itemRect.height / 2
            const viewportCenter = windowHeight / 2

            if (Math.abs(itemCenter - viewportCenter) < 150) {
              setActiveIndex(index)
            }
          }
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-12 px-4 bg-transparent relative"
    >
      <div className="max-w-3xl mx-auto">
        <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-white mb-2">Journey</h2>
          <p className="text-gray-400 text-sm">Scroll to explore my timeline</p>
        </div>

        <div className="relative">
          <div
            className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 transition-all duration-300 shadow-lg"
            style={{
              height: `${scrollProgress * 100}%`,
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
            }}
          ></div>

          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>

          <div className="space-y-4">
            {timeline.map((item, index) => {
              const isActive = item.status === 'active'
              const isInFocus = activeIndex === index
              const itemProgress = Math.min(Math.max((scrollProgress - index * 0.15) * 4, 0), 1)

              return (
                <div
                  key={index}
                  ref={el => itemRefs.current[index] = el}
                  className="relative pl-16 transition-all duration-500"
                  style={{
                    opacity: itemProgress,
                    transform: `translateX(${(1 - itemProgress) * -50}px) scale(${0.9 + itemProgress * 0.1})`
                  }}
                >
                  <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-gray-900 transition-all duration-300 ${isActive
                    ? 'bg-green-500 animate-pulse scale-150 shadow-lg shadow-green-500/50'
                    : isInFocus
                      ? 'bg-purple-500 scale-125 shadow-lg shadow-purple-500/50'
                      : item.status === 'milestone'
                        ? 'bg-purple-500 scale-100'
                        : 'bg-gray-600 scale-90'
                    }`}>
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                    )}
                  </div>

                  <div
                    className={`backdrop-blur-sm rounded-2xl p-3 border transition-all duration-300 ${isActive
                      ? 'bg-gray-800/60 border-green-500/50 shadow-xl shadow-green-500/20'
                      : isInFocus
                        ? 'bg-gray-800/50 border-purple-500/40 shadow-lg scale-105'
                        : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/40 hover:border-gray-600/50'
                      }`}
                    style={{
                      transform: isInFocus ? 'translateX(8px)' : 'translateX(0)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold transition-colors ${isActive ? 'text-green-400' : isInFocus ? 'text-purple-400' : 'text-gray-500'
                        }`}>{item.date}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full border border-green-500/30 animate-pulse">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <h3 className={`font-bold mb-1 transition-all duration-300 ${isActive
                      ? 'text-green-400 text-base'
                      : isInFocus
                        ? 'text-purple-400 text-base'
                        : 'text-white text-sm'
                      }`}>
                      {item.title}
                    </h3>

                    <p className={`text-gray-400 text-xs mb-2 leading-relaxed transition-all duration-300 ${isInFocus ? 'text-gray-300' : ''
                      }`}>
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 text-[10px] rounded-full transition-all duration-300 ${isInFocus
                            ? 'bg-gray-700/60 text-gray-300'
                            : 'bg-gray-700/40 text-gray-400'
                            }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {isInFocus && (
                      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${isActive
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                          style={{ width: `${itemProgress * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`absolute left-8 top-8 w-8 h-px transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-green-500/50 to-transparent'
                      : 'bg-gradient-to-r from-purple-500/50 to-transparent'
                      }`}
                    style={{
                      opacity: isInFocus ? 1 : 0,
                      transform: `scaleX(${isInFocus ? 1 : 0})`
                    }}
                  ></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
