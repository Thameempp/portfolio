import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function ConnectedWaveMesh() {
  const meshRef = useRef()
  const pointsRef = useRef()
  const width = 80
  const depth = 40
  const count = width * depth
  
  const positions = useRef(new Float32Array(count * 3))
  
  // Initialize positions
  for (let i = 0; i < count; i++) {
    const x = (i % width) - width / 2
    const z = Math.floor(i / width) - depth / 2
    
    positions.current[i * 3] = x * 0.3
    positions.current[i * 3 + 1] = 0
    positions.current[i * 3 + 2] = z * 0.4
  }
  
  // Create faces
  const indices = []
  for (let z = 0; z < depth - 1; z++) {
    for (let x = 0; x < width - 1; x++) {
      const a = x + z * width
      const b = x + 1 + z * width
      const c = x + (z + 1) * width
      const d = x + 1 + (z + 1) * width
      
      indices.push(a, b, c)
      indices.push(b, d, c)
    }
  }
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const pos = positions.current
    
    for (let i = 0; i < count; i++) {
      const x = pos[i * 3]
      const z = pos[i * 3 + 2]
      
      const wave1 = Math.sin(x * 0.25 + time * 1.5) * 0.8
      const wave2 = Math.cos(x * 0.2 - time * 1.2) * 0.5
      const wave3 = Math.sin(z * 0.3 + time * 0.8) * 0.3
      const ripple = Math.sin((x * 0.15 + z * 0.12) - time * 2) * 0.6
      
      const bumpX = Math.sin(x * 0.1 + time * 0.5) * Math.cos(z * 0.1 + time * 0.3)
      const bump = bumpX > 0.7 ? bumpX * 1.2 : 0
      
      pos[i * 3 + 1] = wave1 + wave2 + wave3 + ripple + bump
    }
    
    if (meshRef.current) {
      meshRef.current.geometry.attributes.position.needsUpdate = true
      meshRef.current.geometry.computeVertexNormals()
    }
    
    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <group rotation={[-Math.PI / 4, 0, 0]}>
      <mesh ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions.current}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={new Uint16Array(indices)}
            itemSize={1}
          />
        </bufferGeometry>
        <meshBasicMaterial
          color="#0099ff"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions.current}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#00bbff"
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

const GridWave3D = () => {
  return (
    <div className="w-full h-52 relative -mt-8 -mb-12">
      <Canvas
        camera={{ position: [0, 3.5, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        gl={{ 
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[20, 10, 15]} intensity={1.5} color="#0099ff" />
        <pointLight position={[-20, 8, 10]} intensity={1} color="#00bbff" />
        <pointLight position={[0, 15, -10]} intensity={0.8} color="#0088ff" />
        
        <ConnectedWaveMesh />
        
        <fog attach="fog" args={['#000000', 10, 22]} />
      </Canvas>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black via-black/90 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black via-black/70 to-transparent"></div>
      </div>
    </div>
  )
}

export default GridWave3D
