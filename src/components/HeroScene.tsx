"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';

const GRID_COLUMNS = 44;
const GRID_ROWS = 24;
const GRID_SPACING = 1.45;

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDesktop, prefersReducedMotion, ready } = useMotionPreferences(1024);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas || !ready || prefersReducedMotion || !isDesktop) {
      return;
    }

    let animationFrame = 0;
    let disposed = false;
    let scrollProgress = 0;
    let animationActive = true;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
    camera.position.set(0, 0, 34);

    const fieldGroup = new THREE.Group();
    fieldGroup.rotation.x = -0.22;
    fieldGroup.rotation.y = 0.18;
    fieldGroup.scale.set(1.18, 1.1, 1);
    scene.add(fieldGroup);

    const pointCount = GRID_COLUMNS * GRID_ROWS;
    const basePositions = new Float32Array(pointCount * 3);
    const pointPositions = new Float32Array(pointCount * 3);
    const pointIndicesForLines: number[] = [];

    const getPointIndex = (column: number, row: number) => row * GRID_COLUMNS + column;

    for (let row = 0; row < GRID_ROWS; row += 1) {
      for (let column = 0; column < GRID_COLUMNS; column += 1) {
        const index = getPointIndex(column, row);
        const x = (column - (GRID_COLUMNS - 1) / 2) * GRID_SPACING;
        const y = (row - (GRID_ROWS - 1) / 2) * GRID_SPACING;
        const radialDistance = Math.sqrt(x * x + y * y);
        const z = Math.cos(radialDistance * 0.28) * 1.9;
        const offset = index * 3;

        basePositions[offset] = x;
        basePositions[offset + 1] = y;
        basePositions[offset + 2] = z;

        pointPositions[offset] = x;
        pointPositions[offset + 1] = y;
        pointPositions[offset + 2] = z;

        if (column < GRID_COLUMNS - 1) {
          pointIndicesForLines.push(index, getPointIndex(column + 1, row));
        }

        if (row < GRID_ROWS - 1) {
          pointIndicesForLines.push(index, getPointIndex(column, row + 1));
        }

      }
    }

    const pointGeometry = new THREE.BufferGeometry();
    const pointPositionAttribute = new THREE.BufferAttribute(pointPositions, 3);
    pointGeometry.setAttribute('position', pointPositionAttribute);

    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({
        color: '#d6abff',
        size: 0.2,
        transparent: true,
        opacity: 0.82,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    fieldGroup.add(points);

    const linePositions = new Float32Array(pointIndicesForLines.length * 3);
    const lineGeometry = new THREE.BufferGeometry();
    const linePositionAttribute = new THREE.BufferAttribute(linePositions, 3);
    lineGeometry.setAttribute('position', linePositionAttribute);

    const lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: '#9238d6',
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    fieldGroup.add(lines);

    const createGlowTexture = (innerColor: string, outerColor: string) => {
      const size = 256;
      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = size;
      glowCanvas.height = size;
      const context = glowCanvas.getContext('2d');

      if (!context) {
        return null;
      }

      const gradient = context.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, innerColor);
      gradient.addColorStop(0.38, outerColor);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(glowCanvas);
      texture.needsUpdate = true;
      return texture;
    };

    const primaryGlowTexture = createGlowTexture('rgba(196, 91, 255, 0.9)', 'rgba(86, 27, 131, 0.22)');
    const accentGlowTexture = createGlowTexture('rgba(124, 200, 255, 0.7)', 'rgba(38, 70, 160, 0.14)');

    const primaryGlow = primaryGlowTexture
      ? new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: primaryGlowTexture,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        )
      : null;

    const accentGlow = accentGlowTexture
      ? new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: accentGlowTexture,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        )
      : null;

    if (primaryGlow) {
      primaryGlow.scale.set(54, 28, 1);
      primaryGlow.position.set(-6, 2, -6);
      fieldGroup.add(primaryGlow);
    }

    if (accentGlow) {
      accentGlow.scale.set(30, 18, 1);
      accentGlow.position.set(10, -2, -2);
      fieldGroup.add(accentGlow);
    }

    const pointer = { targetX: 0, targetY: 0, x: 0, y: 0 };

    const updateRendererSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const updateScrollProgress = () => {
      scrollProgress = THREE.MathUtils.clamp(window.scrollY / Math.max(window.innerHeight, 1), 0, 1);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      const withinBounds =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!withinBounds) {
        pointer.targetX = 0;
        pointer.targetY = 0;
        return;
      }

      const relativeX = (event.clientX - bounds.left) / bounds.width;
      const relativeY = (event.clientY - bounds.top) / bounds.height;
      pointer.targetX = (relativeX - 0.5) * 2;
      pointer.targetY = (0.5 - relativeY) * 2;
    };

    const handlePointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    const syncLineGeometry = () => {
      for (let i = 0; i < pointIndicesForLines.length; i += 1) {
        const pointIndex = pointIndicesForLines[i] * 3;
        const targetOffset = i * 3;
        linePositions[targetOffset] = pointPositions[pointIndex];
        linePositions[targetOffset + 1] = pointPositions[pointIndex + 1];
        linePositions[targetOffset + 2] = pointPositions[pointIndex + 2];
      }
      linePositionAttribute.needsUpdate = true;
    };

    const renderFrame = (time: number) => {
      if (disposed || !animationActive) {
        return;
      }

      pointer.x = THREE.MathUtils.lerp(pointer.x, pointer.targetX, 0.08);
      pointer.y = THREE.MathUtils.lerp(pointer.y, pointer.targetY, 0.08);

      const t = time * 0.00042;
      const stabilizer = scrollProgress * 0.7;
      const pointerX = pointer.x * 19;
      const pointerY = pointer.y * 10;

      for (let point = 0; point < pointCount; point += 1) {
        const offset = point * 3;
        const baseX = basePositions[offset];
        const baseY = basePositions[offset + 1];
        const baseZ = basePositions[offset + 2];
        const pointerDistance = Math.hypot(baseX - pointerX, baseY - pointerY);
        const pointerInfluence = Math.max(0, 1 - pointerDistance / 12);
        const wave =
          Math.sin(t + baseX * 0.32 + baseY * 0.22) * 0.9 +
          Math.cos(t * 1.35 + baseX * 0.15 - baseY * 0.18) * 0.45;
        const orderedWave = THREE.MathUtils.lerp(wave, 0.12, stabilizer);

        pointPositions[offset] = baseX + pointerInfluence * pointer.x * 0.7;
        pointPositions[offset + 1] = baseY + pointerInfluence * pointer.y * 0.5;
        pointPositions[offset + 2] = baseZ + orderedWave + pointerInfluence * 1.2 + scrollProgress * 0.55;
      }

      pointPositionAttribute.needsUpdate = true;
      syncLineGeometry();

      fieldGroup.rotation.z = Math.sin(t * 0.8) * 0.045;
      fieldGroup.position.y = Math.sin(t * 1.05) * 0.35;

      if (primaryGlow) {
        primaryGlow.position.x = -6 + Math.sin(t * 0.65) * 3;
        primaryGlow.position.y = 2 + Math.cos(t * 0.45) * 1.2;
        primaryGlow.material.opacity = 0.22 + (Math.sin(t * 0.95) + 1) * 0.04;
      }

      if (accentGlow) {
        accentGlow.position.x = 10 + Math.cos(t * 0.75) * 2.5;
        accentGlow.position.y = -2 + Math.sin(t * 0.6) * 1.8;
        accentGlow.material.opacity = 0.12 + (Math.cos(t * 1.1) + 1) * 0.03;
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        animationActive = false;
        window.cancelAnimationFrame(animationFrame);
        return;
      }

      if (!animationActive) {
        animationActive = true;
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    updateRendererSize();
    updateScrollProgress();
    syncLineGeometry();

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', updateRendererSize);
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    animationFrame = window.requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      animationActive = false;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', updateRendererSize);
      window.removeEventListener('scroll', updateScrollProgress);
      document.removeEventListener('visibilitychange', handleVisibility);
      pointGeometry.dispose();
      lineGeometry.dispose();
      (points.material as THREE.Material).dispose();
      (lines.material as THREE.Material).dispose();
      if (primaryGlowTexture) primaryGlowTexture.dispose();
      if (accentGlowTexture) accentGlowTexture.dispose();
      if (primaryGlow) (primaryGlow.material as THREE.Material).dispose();
      if (accentGlow) (accentGlow.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [isDesktop, prefersReducedMotion, ready]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-40 hidden overflow-hidden lg:block"
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-90 hero-field-mask" />
    </div>
  );
}
