
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId: number;

    try {
      // Scene Setup
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x020617, 0.001);

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      camera.position.z = 400;
      camera.position.y = 50;

      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
      mountRef.current.appendChild(renderer.domElement);

      // --- Dynamic Particle Field (The Neural Web) ---
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 1500;
      const posArray = new Float32Array(particleCount * 3);
      
      for(let i=0; i<particleCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 1500;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
          size: 2,
          color: 0x00f3ff,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
      });
      
      const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particleMesh);

      // --- Central Data Core (Rotating Geometric Shapes) ---
      const coreGroup = new THREE.Group();
      scene.add(coreGroup);

      // Icosahedron (The Knowledge Core)
      const coreGeometry = new THREE.IcosahedronGeometry(120, 1);
      const coreMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x3b82f6, 
          wireframe: true,
          transparent: true,
          opacity: 0.15 
      });
      const sphere = new THREE.Mesh(coreGeometry, coreMaterial);
      coreGroup.add(sphere);

      // Orbiting Rings
      const ringGeo = new THREE.TorusGeometry(200, 1, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.2 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      coreGroup.add(ring);
      
      const ringGeo2 = new THREE.TorusGeometry(250, 0.5, 16, 100);
      const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.2 });
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.x = Math.PI / 3;
      ring2.rotation.y = Math.PI / 4;
      coreGroup.add(ring2);


      // --- Mouse Interaction ---
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e: MouseEvent) => {
          mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
          mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
      };
      document.addEventListener('mousemove', handleMouseMove);

      // --- Animation Loop ---
      const animate = () => {
          frameId = requestAnimationFrame(animate);

          targetX = mouseX * 0.5;
          targetY = mouseY * 0.5;

          // Smooth rotation based on mouse
          coreGroup.rotation.y += 0.002;
          coreGroup.rotation.x += (targetY - coreGroup.rotation.x) * 0.05;
          coreGroup.rotation.z += (targetX - coreGroup.rotation.z) * 0.05;

          particleMesh.rotation.y += 0.0005;

          // Ring Animations
          ring.rotation.z -= 0.002;
          ring2.rotation.z += 0.003;

          // Camera float
          camera.position.x += (mouseX * 100 - camera.position.x) * 0.05;
          camera.position.y += (-mouseY * 100 - camera.position.y) * 0.05 + 50;
          camera.lookAt(scene.position);

          if (renderer) renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
          if (!renderer) return;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      const handleContextLost = (event: Event) => {
        event.preventDefault();
        cancelAnimationFrame(frameId);
        setWebglError(true);
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

      return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(frameId);
          
          if (renderer) {
            renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
            renderer.dispose();
            if (mountRef.current && renderer.domElement.parentElement === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
          }

          // Dispose geometries and materials
          particlesGeometry.dispose();
          particlesMaterial.dispose();
          coreGeometry.dispose();
          coreMaterial.dispose();
          ringGeo.dispose();
          ringMat.dispose();
          ringGeo2.dispose();
          ringMat2.dispose();
      };
    } catch (e) {
      console.error("WebGL initialization failed:", e);
      setWebglError(true);
      return () => {};
    }
  }, []);

  if (webglError) {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 0,
          background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
          pointerEvents: 'none' 
        }} 
      />
    );
  }

  return (
    <div 
        ref={mountRef} 
        style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 0,
            pointerEvents: 'none' 
        }} 
    />
  );
};

export default ThreeBackground;
