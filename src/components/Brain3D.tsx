"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function Brain3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      if (!renderer.getContext()) {
        setWebglError(true);
        renderer.dispose();
        return;
      }
    } catch {
      setWebglError(true);
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create neural network-like sphere
    const coreGeometry = new THREE.IcosahedronGeometry(2, 3);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Inner glow sphere
    const innerGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const inner = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(inner);

    // Particles (neural nodes)
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 1.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Orbiting rings
    const ringGeometry = new THREE.TorusGeometry(3, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.15,
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    camera.position.z = 5;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      core.rotation.x += 0.002;
      core.rotation.y += 0.003;
      inner.rotation.x -= 0.003;
      inner.rotation.y -= 0.002;
      particles.rotation.y += 0.001;
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.001;

      // Mouse-follow
      core.rotation.x += mouseY * 0.005;
      core.rotation.y += mouseX * 0.005;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglError) {
    return (
      <div className="w-full h-full flex items-center justify-center border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]">
        <div className="text-center space-y-2">
          <p className="text-[var(--accent-cyan)] text-4xl">⬡</p>
          <p className="text-xs tracking-widest text-[var(--text-secondary)]">
            3D RENDER UNAVAILABLE
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full" />;
}
