import { useState, useEffect } from 'react'

const Background = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Pure Black Background */}
      <div className="fixed inset-0 bg-black -z-10" />

      {/* Interactive Blue Gradient - Follows Mouse */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      />

      {/* Optional: Subtle Ambient Orbs */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1s' }} />
    </>
  )
}

export default Background
