'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useConfettiStore } from '@/stores/useConfettiStore'

interface ConfettiProps {
  duration?: number
  particleCount?: number
}

export default function Confetti3D({ duration = 5000, particleCount = 200 }: ConfettiProps) {
  const isActive = useConfettiStore((s) => s.isActive)
  const hide = useConfettiStore((s) => s.hide)

  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    particles: THREE.Mesh[]
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!isActive || !mountRef.current) return

    const mount = mountRef.current

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    mount.appendChild(renderer.domElement)

    camera.position.z = 30

    const colors = [0x0ea5e9, 0x38bdf8, 0x7dd3fc, 0xfbbf24, 0xf59e0b, 0x10b981, 0x34d399, 0xf43f5e, 0xfb7185]

    const particles: THREE.Mesh[] = []
    const geometries = [
      new THREE.PlaneGeometry(0.4, 0.6),
      new THREE.CircleGeometry(0.25, 8),
      new THREE.PlaneGeometry(0.3, 0.3)
    ]

    for (let i = 0; i < particleCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
      })

      const particle = new THREE.Mesh(geometry, material)

      particle.position.x = (Math.random() - 0.5) * 60
      particle.position.y = Math.random() * 40 + 20
      particle.position.z = (Math.random() - 0.5) * 20

      particle.rotation.x = Math.random() * Math.PI
      particle.rotation.y = Math.random() * Math.PI
      particle.rotation.z = Math.random() * Math.PI

      particle.userData = {
        velocityY: -(Math.random() * 0.15 + 0.1),
        velocityX: (Math.random() - 0.5) * 0.1,
        rotationSpeedX: (Math.random() - 0.5) * 0.1,
        rotationSpeedY: (Math.random() - 0.5) * 0.1,
        rotationSpeedZ: (Math.random() - 0.5) * 0.1,
        swayAmount: Math.random() * 0.02,
        swayOffset: Math.random() * Math.PI * 2
      }

      scene.add(particle)
      particles.push(particle)
    }

    let time = 0

    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      time += 0.016

      particles.forEach((particle) => {
        const data = particle.userData

        particle.position.y += data.velocityY
        particle.position.x += data.velocityX + Math.sin(time + data.swayOffset) * data.swayAmount

        particle.rotation.x += data.rotationSpeedX
        particle.rotation.y += data.rotationSpeedY
        particle.rotation.z += data.rotationSpeedZ

        // Recycle particles that fall past the bottom
        if (particle.position.y < -30) {
          particle.position.y = Math.random() * 20 + 30
          particle.position.x = (Math.random() - 0.5) * 60
        }
      })

      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    sceneRef.current = { scene, camera, renderer, particles, animationId: 0 }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Fade out, then clear the flag so the component unmounts
    const fadeTimeout = setTimeout(() => {
      const fadeInterval = setInterval(() => {
        let allFaded = true

        particles.forEach((particle) => {
          const material = particle.material as THREE.MeshBasicMaterial
          if (material.opacity > 0) {
            material.opacity -= 0.02
            allFaded = false
          }
        })

        if (allFaded) {
          clearInterval(fadeInterval)
          hide()
        }
      }, 16)
    }, duration - 1000)

    return () => {
      clearTimeout(fadeTimeout)
      window.removeEventListener('resize', handleResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }

      particles.forEach((particle) => {
        scene.remove(particle)
        particle.geometry.dispose()
        ;(particle.material as THREE.Material).dispose()
      })

      geometries.forEach((geometry) => geometry.dispose())
      renderer.dispose()

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }

      sceneRef.current = null
    }
  }, [isActive, duration, particleCount, hide])

  if (!isActive) return null

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-9999" aria-hidden="true" />
}
