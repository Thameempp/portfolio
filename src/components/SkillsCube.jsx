import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { 
  SiDjango, SiPython, SiFastapi, 
  SiPostgresql, SiDocker 
} from 'react-icons/si'
import { FaRobot } from 'react-icons/fa'

function AdvancedDiamond({ scrollProgress, mousePos, isMobile }) {
  const diamondRef = useRef()
  const innerRef = useRef()
  const skillsGroupRef = useRef()
  const skillRefs = useRef([])

  const fixedColor = '#3b82f6'

  const skills = [
    { name: 'Django', color: '#092E20', icon: SiDjango },
    { name: 'Python', color: '#3776AB', icon: SiPython },
    { name: 'FastAPI', color: '#009688', icon: SiFastapi },
    { name: 'AI/ML', color: '#ff6b6b', icon: FaRobot },
    { name: 'Docker', color: '#2496ED', icon: SiDocker },
    { name: 'PostgreSQL', color: '#336791', icon: SiPostgresql }
  ]

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    if (diamondRef.current) {
      const rotationSpeed = isMobile ? 0.15 : 0.2
      const targetRotX = mousePos.y * (isMobile ? 0.15 : 0.3)
      const targetRotY = time * rotationSpeed + mousePos.x * (isMobile ? 0.15 : 0.3)
      
      diamondRef.current.rotation.x += (targetRotX - diamondRef.current.rotation.x) * 0.05
      diamondRef.current.rotation.y += (targetRotY - diamondRef.current.rotation.y) * 0.05
      diamondRef.current.rotation.z = Math.sin(time * 0.3) * 0.05
      
      diamondRef.current.position.y = Math.sin(time * 0.5) * 0.1
    }

    if (innerRef.current) {
      const innerSpeed = isMobile ? 0.25 : 0.3
      innerRef.current.rotation.x = -time * innerSpeed
      innerRef.current.rotation.y = -time * (innerSpeed - 0.05)
    }

    if (skillsGroupRef.current) {
      const groupSpeed = isMobile ? 0.08 : 0.1
      skillsGroupRef.current.rotation.y = time * groupSpeed
    }

    skillRefs.current.forEach((skillRef) => {
      if (skillRef) {
        const worldPos = skillRef.getWorldPosition(skillRef.position.clone())
        const depth = worldPos.z
        const scale = 0.6 + (depth + 3) * 0.1
        const clampedScale = Math.max(0.6, Math.min(1.0, scale))
        skillRef.scale.setScalar(clampedScale)
      }
    })
  })

  const getSkillRadius = () => {
    const baseRadius = isMobile ? 2.0 : 2.4
    const minRadius = isMobile ? 0.4 : 0.5
    const smoothProgress = Math.max(0, Math.min(1, scrollProgress))
    return baseRadius - (baseRadius - minRadius) * smoothProgress * 0.8
  }

  return (
    <>
      <Sparkles
        count={isMobile ? 20 : 30}
        scale={isMobile ? 4 : 5}
        size={isMobile ? 1.5 : 2}
        speed={0.3}
        color={fixedColor}
        opacity={isMobile ? 0.4 : 0.3}
      />

      <group ref={diamondRef} scale={isMobile ? 0.8 : 1}>
        <mesh>
          <octahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial
            color={fixedColor}
            wireframe
            transparent
            opacity={isMobile ? 0.5 : 0.4}
          />
        </mesh>

        <group ref={innerRef}>
          <mesh scale={0.6}>
            <octahedronGeometry args={[1.5, 0]} />
            <meshBasicMaterial
              color={fixedColor}
              transparent
              opacity={isMobile ? 0.3 : 0.2}
              wireframe
            />
          </mesh>
        </group>

        {[
          [0, 1.5, 0], [0, -1.5, 0],
          [1.5, 0, 0], [-1.5, 0, 0],
          [0, 0, 1.5], [0, 0, -1.5]
        ].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial
              color={fixedColor}
              transparent
              opacity={isMobile ? 0.6 : 0.5}
            />
          </mesh>
        ))}
      </group>

      <group ref={skillsGroupRef}>
        {skills.map((skill, i) => {
          const angle = (i / skills.length) * Math.PI * 2
          const radius = getSkillRadius()
          const smoothProgress = Math.max(0, Math.min(1, scrollProgress))
          const heightOffset = Math.sin(angle * 2) * 0.4 * (1 - smoothProgress * 0.5)
          const IconComponent = skill.icon
          
          return (
            <Float 
              key={i} 
              speed={isMobile ? 1.2 : 1.5} 
              rotationIntensity={isMobile ? 0.08 : 0.1} 
              floatIntensity={isMobile ? 0.15 : 0.2}
            >
              <group
                ref={(el) => (skillRefs.current[i] = el)}
                position={[
                  Math.cos(angle) * radius,
                  heightOffset,
                  Math.sin(angle) * radius
                ]}
              >
                <Html
                  position={[0, 0, 0]}
                  center
                  distanceFactor={isMobile ? 9 : 10}
                  style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: isMobile ? '5px' : '8px'
                    }}
                  >
                    <IconComponent 
                      style={{ 
                        fontSize: isMobile ? '14px' : '16px',
                        color: skill.color,
                        filter: `drop-shadow(0 0 ${isMobile ? '8px' : '10px'} ${skill.color}80)`,
                        opacity: isMobile ? 0.9 : 1
                      }} 
                    />
                    
                    <div
                      style={{
                        color: skill.color,
                        fontSize: isMobile ? '8px' : '9px',
                        fontWeight: '600',
                        fontFamily: '"Courier New", monospace',
                        letterSpacing: '0.8px',
                        textShadow: `0 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px ${skill.color}80`,
                        opacity: isMobile ? 0.95 : 1
                      }}
                    >
                      {skill.name}
                    </div>
                  </div>
                </Html>
              </group>
            </Float>
          )
        })}
      </group>
    </>
  )
}

const SkillsDiamond = ({ isMobile = false }) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = 1000
      const progress = Math.max(0, Math.min(scrolled / maxScroll, 1))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobile) {
      const handleTouch = (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0]
          const x = (touch.clientX / window.innerWidth) * 2 - 1
          const y = -(touch.clientY / window.innerHeight) * 2 + 1
          setMousePos({ x: x * 0.5, y: y * 0.5 })
        }
      }

      window.addEventListener('touchmove', handleTouch, { passive: true })
      return () => window.removeEventListener('touchmove', handleTouch)
    } else {
      let ticking = false

      const handleMouseMove = (e) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = -(e.clientY / window.innerHeight) * 2 + 1
            setMousePos({ x, y })
            ticking = false
          })
          ticking = true
        }
      }

      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobile])

  return (
    <Canvas
      camera={{ position: [0, 0, isMobile ? 5.5 : 6], fov: isMobile ? 55 : 50 }}
      style={{ background: 'transparent' }}
      dpr={isMobile ? [1, 2] : [1, 2]}
      gl={{ 
        alpha: true,
        antialias: true,
        powerPreference: isMobile ? 'default' : 'high-performance'
      }}
      frameloop="always"
    >
      <ambientLight intensity={isMobile ? 0.6 : 0.5} />
      <pointLight position={[10, 10, 10]} intensity={isMobile ? 1.0 : 0.8} color="#3b82f6" />
      <pointLight position={[-10, -10, -10]} intensity={isMobile ? 0.5 : 0.4} color="#60a5fa" />

      <AdvancedDiamond scrollProgress={scrollProgress} mousePos={mousePos} isMobile={isMobile} />

      {!isMobile && (
        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      )}
    </Canvas>
  )
}

export default SkillsDiamond
