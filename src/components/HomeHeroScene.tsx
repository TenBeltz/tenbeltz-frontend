"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';

const GRID_COLUMNS = 30;
const GRID_ROWS = 18;
const GRID_SPACING = 1.35;

type GridNode = {
  column: number;
  row: number;
};

type HeroNodeDefinition = GridNode & {
  color: string;
  scale: number;
  phase: number;
  emphasis: number;
};

const ROUTES: GridNode[][] = [
  [
    { column: 2, row: 12 },
    { column: 5, row: 10 },
    { column: 9, row: 8 },
    { column: 13, row: 7 },
    { column: 18, row: 8 },
    { column: 24, row: 6 },
    { column: 27, row: 4 },
  ],
  [
    { column: 4, row: 3 },
    { column: 7, row: 5 },
    { column: 12, row: 6 },
    { column: 16, row: 5 },
    { column: 20, row: 6 },
    { column: 24, row: 8 },
    { column: 27, row: 10 },
  ],
  [
    { column: 3, row: 14 },
    { column: 7, row: 13 },
    { column: 11, row: 11 },
    { column: 16, row: 11 },
    { column: 20, row: 12 },
    { column: 24, row: 13 },
    { column: 27, row: 15 },
  ],
  [
    { column: 6, row: 2 },
    { column: 9, row: 4 },
    { column: 13, row: 5 },
    { column: 17, row: 7 },
    { column: 21, row: 9 },
    { column: 25, row: 11 },
  ],
  [
    { column: 8, row: 15 },
    { column: 11, row: 13 },
    { column: 15, row: 10 },
    { column: 18, row: 8 },
    { column: 21, row: 7 },
    { column: 25, row: 6 },
  ],
];

const HERO_NODES: HeroNodeDefinition[] = [
  { column: 5, row: 10, color: '#79CAFF', scale: 1.1, phase: 0.2, emphasis: 1.05 },
  { column: 13, row: 7, color: '#E4D7FF', scale: 1.26, phase: 0.9, emphasis: 1.3 },
  { column: 18, row: 8, color: '#C45BFF', scale: 1.18, phase: 1.6, emphasis: 1.2 },
  { column: 20, row: 12, color: '#79CAFF', scale: 1.08, phase: 2.4, emphasis: 1.05 },
  { column: 24, row: 6, color: '#BBDFFF', scale: 1.02, phase: 3.1, emphasis: 0.94 },
];

const ROUTE_COLORS = ['#79CAFF', '#D5C7FF', '#A1E4FF', '#C45BFF', '#8BD1FF'];
const ROUTE_ANCHORS = ROUTES.flat();

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function getPointIndex(column: number, row: number) {
  return row * GRID_COLUMNS + column;
}

function drawRadialTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.34, 'rgba(255, 255, 255, 0.38)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function drawRingTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (!context) {
    return null;
  }

  context.clearRect(0, 0, size, size);
  context.strokeStyle = 'rgba(255, 255, 255, 1)';
  context.lineWidth = 12;
  context.beginPath();
  context.arc(size / 2, size / 2, size * 0.28, 0, Math.PI * 2);
  context.stroke();

  const glow = context.createRadialGradient(size / 2, size / 2, size * 0.2, size / 2, size / 2, size * 0.44);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0)');
  glow.addColorStop(0.72, 'rgba(255, 255, 255, 0.24)');
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function HomeHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { prefersReducedMotion, ready } = useMotionPreferences(960);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas || !ready) {
      return;
    }

    let animationFrame = 0;
    let animationActive = !prefersReducedMotion;
    let disposed = false;
    let scrollProgress = 0;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 140);
    camera.position.set(0, 0.2, 28.4);

    const fieldGroup = new THREE.Group();
    fieldGroup.rotation.set(-0.72, -0.46, -0.1);
    fieldGroup.position.set(3.8, -1, 0);
    fieldGroup.scale.setScalar(1.18);
    scene.add(fieldGroup);

    const pointCount = GRID_COLUMNS * GRID_ROWS;
    const flatHeights = new Float32Array(pointCount);
    const elevatedHeights = new Float32Array(pointCount);
    const basePositions = new Float32Array(pointCount * 3);
    const pointPositions = new Float32Array(pointCount * 3);
    const linePointIndices: number[] = [];

    for (let row = 0; row < GRID_ROWS; row += 1) {
      for (let column = 0; column < GRID_COLUMNS; column += 1) {
        const index = getPointIndex(column, row);
        const x = (column - (GRID_COLUMNS - 1) / 2) * GRID_SPACING;
        const y = (row - (GRID_ROWS - 1) / 2) * GRID_SPACING;
        const radialDistance = Math.hypot(x, y);
        const blueprintHeight = Math.sin(radialDistance * 0.18) * 0.05;

        let routeField = 0;
        for (const anchor of ROUTE_ANCHORS) {
          const distance = Math.hypot(column - anchor.column, row - anchor.row);
          routeField += Math.max(0, 1 - distance / 4.5) * 0.12;
        }

        let nodeField = 0;
        for (const node of HERO_NODES) {
          const distance = Math.hypot(column - node.column, row - node.row);
          nodeField += Math.max(0, 1 - distance / 3.8) * 0.22 * node.emphasis;
        }

        const elevatedHeight =
          Math.cos(radialDistance * 0.34) * 0.44 +
          Math.sin(x * 0.24 + y * 0.18) * 0.18 +
          routeField * 1.08 +
          nodeField * 0.56;

        const offset = index * 3;
        flatHeights[index] = blueprintHeight;
        elevatedHeights[index] = elevatedHeight;

        basePositions[offset] = x;
        basePositions[offset + 1] = y;
        basePositions[offset + 2] = blueprintHeight;

        pointPositions[offset] = x;
        pointPositions[offset + 1] = y;
        pointPositions[offset + 2] = blueprintHeight;

        if (column < GRID_COLUMNS - 1) {
          linePointIndices.push(index, getPointIndex(column + 1, row));
        }

        if (row < GRID_ROWS - 1) {
          linePointIndices.push(index, getPointIndex(column, row + 1));
        }

        if (column < GRID_COLUMNS - 1 && row < GRID_ROWS - 1 && (column + row) % 5 === 0) {
          linePointIndices.push(index, getPointIndex(column + 1, row + 1));
        }
      }
    }

    const pointGeometry = new THREE.BufferGeometry();
    const pointPositionAttribute = new THREE.BufferAttribute(pointPositions, 3);
    pointGeometry.setAttribute('position', pointPositionAttribute);

    const pointsMaterial = new THREE.PointsMaterial({
      color: '#DAE6FF',
      size: 0.1,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(pointGeometry, pointsMaterial);
    fieldGroup.add(points);

    const linePositions = new Float32Array(linePointIndices.length * 3);
    const lineGeometry = new THREE.BufferGeometry();
    const linePositionAttribute = new THREE.BufferAttribute(linePositions, 3);
    lineGeometry.setAttribute('position', linePositionAttribute);

    const linesMaterial = new THREE.LineBasicMaterial({
      color: '#79CAFF',
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, linesMaterial);
    fieldGroup.add(lines);

    const radialTexture = drawRadialTexture();
    const ringTexture = drawRingTexture();

    const getElevatedVector = (column: number, row: number) => {
      const index = getPointIndex(column, row);
      const offset = index * 3;
      return new THREE.Vector3(basePositions[offset], basePositions[offset + 1], elevatedHeights[index] + 0.22);
    };

    const routes = ROUTES.map((route, routeIndex) => {
      const pathPoints = route.map(({ column, row }) => getElevatedVector(column, row));
      const curve = new THREE.CatmullRomCurve3(pathPoints, false, 'centripetal');
      const sampledPoints = curve.getPoints(160);

      const baseGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
      const coreGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
      baseGeometry.setDrawRange(0, 0);
      coreGeometry.setDrawRange(0, 0);

      const baseMaterial = new THREE.LineBasicMaterial({
        color: ROUTE_COLORS[routeIndex % ROUTE_COLORS.length],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const coreMaterial = new THREE.LineBasicMaterial({
        color: routeIndex === 3 ? '#E1C5FF' : ROUTE_COLORS[routeIndex % ROUTE_COLORS.length],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const baseLine = new THREE.Line(baseGeometry, baseMaterial);
      const coreLine = new THREE.Line(coreGeometry, coreMaterial);
      fieldGroup.add(baseLine);
      fieldGroup.add(coreLine);

      return {
        curve,
        pointCount: sampledPoints.length,
        baseGeometry,
        coreGeometry,
        baseMaterial,
        coreMaterial,
        offset: routeIndex * 0.14,
      };
    });

    const routeParticles: Array<{
      curve: THREE.CatmullRomCurve3;
      sprite: THREE.Sprite;
      halo: THREE.Sprite;
      spriteMaterial: THREE.SpriteMaterial;
      haloMaterial: THREE.SpriteMaterial;
      speed: number;
      offset: number;
      routeOffset: number;
      currentPosition: THREE.Vector3;
      baseScale: number;
    }> = [];

    if (radialTexture) {
      routes.forEach((route, routeIndex) => {
        for (let variant = 0; variant < 2; variant += 1) {
          const spriteMaterial = new THREE.SpriteMaterial({
            map: radialTexture,
            color: ROUTE_COLORS[(routeIndex + variant) % ROUTE_COLORS.length],
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });

          const haloMaterial = new THREE.SpriteMaterial({
            map: radialTexture,
            color: ROUTE_COLORS[(routeIndex + variant) % ROUTE_COLORS.length],
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });

          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.setScalar(0.72 + variant * 0.08);
          const halo = new THREE.Sprite(haloMaterial);
          halo.scale.setScalar(2.2 + variant * 0.35);

          fieldGroup.add(sprite);
          fieldGroup.add(halo);

          routeParticles.push({
            curve: route.curve,
            sprite,
            halo,
            spriteMaterial,
            haloMaterial,
            speed: 0.000055 + routeIndex * 0.00001 + variant * 0.000008,
            offset: routeIndex * 0.19 + variant * 0.36,
            routeOffset: route.offset,
            currentPosition: new THREE.Vector3(),
            baseScale: 0.72 + variant * 0.08,
          });
        }
      });
    }

    const heroNodes = HERO_NODES.map((node) => {
      const pointIndex = getPointIndex(node.column, node.row);

      const coreMaterial = new THREE.SpriteMaterial({
        map: radialTexture ?? undefined,
        color: node.color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const haloMaterial = new THREE.SpriteMaterial({
        map: radialTexture ?? undefined,
        color: node.color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const ringMaterial = new THREE.SpriteMaterial({
        map: ringTexture ?? undefined,
        color: node.color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const core = new THREE.Sprite(coreMaterial);
      core.scale.setScalar(node.scale);
      const halo = new THREE.Sprite(haloMaterial);
      halo.scale.setScalar(node.scale * 3.6);
      const ring = new THREE.Sprite(ringMaterial);
      ring.scale.setScalar(node.scale * 2.2);

      fieldGroup.add(halo);
      fieldGroup.add(ring);
      fieldGroup.add(core);

      return {
        pointIndex,
        phase: node.phase,
        baseScale: node.scale,
        ringScale: node.scale * 2.2,
        haloScale: node.scale * 3.6,
        emphasis: node.emphasis,
        core,
        halo,
        ring,
        coreMaterial,
        haloMaterial,
        ringMaterial,
      };
    });

    const ambientGlows = radialTexture
      ? [
          {
            sprite: new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: radialTexture,
                color: '#79CAFF',
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              }),
            ),
            basePosition: new THREE.Vector3(-8.5, -2.2, -5.5),
            amplitudeX: 2.4,
            amplitudeY: 1.6,
            phase: 0.4,
            speed: 0.46,
            baseOpacity: 0.16,
            scale: new THREE.Vector3(24, 12, 1),
          },
          {
            sprite: new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: radialTexture,
                color: '#C45BFF',
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              }),
            ),
            basePosition: new THREE.Vector3(8.6, 2.4, -4.2),
            amplitudeX: 2.8,
            amplitudeY: 1.4,
            phase: 1.2,
            speed: 0.38,
            baseOpacity: 0.14,
            scale: new THREE.Vector3(22, 10, 1),
          },
          {
            sprite: new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: radialTexture,
                color: '#A9E3FF',
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              }),
            ),
            basePosition: new THREE.Vector3(0.8, 5.2, -6.4),
            amplitudeX: 1.8,
            amplitudeY: 1.1,
            phase: 2.1,
            speed: 0.52,
            baseOpacity: 0.1,
            scale: new THREE.Vector3(18, 9, 1),
          },
        ]
      : [];

    ambientGlows.forEach(({ sprite, scale, basePosition }) => {
      sprite.position.copy(basePosition);
      sprite.scale.copy(scale);
      fieldGroup.add(sprite);
    });

    const intro = {
      blueprint: prefersReducedMotion ? 1 : 0,
      routes: prefersReducedMotion ? 1 : 0,
      nodes: prefersReducedMotion ? 1 : 0,
      traffic: prefersReducedMotion ? 1 : 0,
      sculpture: prefersReducedMotion ? 1 : 0,
      atmosphere: prefersReducedMotion ? 1 : 0,
    };

    const introTimeline = prefersReducedMotion
      ? null
      : gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .to(intro, { blueprint: 1, duration: 0.8 }, 0)
          .to(intro, { routes: 1, duration: 1.15, ease: 'power2.inOut' }, 0.34)
          .to(intro, { nodes: 1, duration: 0.55 }, 0.98)
          .to(intro, { traffic: 1, duration: 0.9 }, 1.18)
          .to(intro, { sculpture: 1, duration: 1.45, ease: 'power3.inOut' }, 0.9)
          .to(intro, { atmosphere: 1, duration: 0.9 }, 1.34);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const updateRendererSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const handleScroll = () => {
      scrollProgress = clamp01(window.scrollY / Math.max(window.innerHeight * 0.9, 1));
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width;
      const relativeY = (event.clientY - bounds.top) / bounds.height;
      pointer.targetX = (relativeX - 0.5) * 2;
      pointer.targetY = (0.5 - relativeY) * 2;
    };

    const handlePointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    const handleVisibility = () => {
      if (prefersReducedMotion) {
        return;
      }

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

    const syncLineGeometry = () => {
      for (let index = 0; index < linePointIndices.length; index += 1) {
        const pointOffset = linePointIndices[index] * 3;
        const targetOffset = index * 3;
        linePositions[targetOffset] = pointPositions[pointOffset];
        linePositions[targetOffset + 1] = pointPositions[pointOffset + 1];
        linePositions[targetOffset + 2] = pointPositions[pointOffset + 2];
      }

      linePositionAttribute.needsUpdate = true;
    };

    const renderFrame = (time: number) => {
      if (disposed) {
        return;
      }

      pointer.x = THREE.MathUtils.lerp(pointer.x, pointer.targetX, prefersReducedMotion ? 0.18 : 0.08);
      pointer.y = THREE.MathUtils.lerp(pointer.y, pointer.targetY, prefersReducedMotion ? 0.18 : 0.08);

      const t = time * 0.00038;
      const pointerX = pointer.x * 13.5;
      const pointerY = pointer.y * 8.5;

      routeParticles.forEach((particle, index) => {
        const routeReveal = clamp01((intro.routes - particle.routeOffset) / 0.5);
        const particleVisibility = routeReveal * intro.traffic;
        const progress = (time * particle.speed + particle.offset) % 1;
        particle.curve.getPointAt(progress, particle.currentPosition);

        particle.sprite.position.copy(particle.currentPosition);
        particle.halo.position.copy(particle.currentPosition);
        particle.sprite.scale.setScalar(particle.baseScale + Math.sin(t * 4.2 + index) * 0.04);
        particle.halo.scale.setScalar(2.2 + Math.sin(t * 3.6 + index * 0.6) * 0.25);
        particle.spriteMaterial.opacity = particleVisibility * 0.92;
        particle.haloMaterial.opacity = particleVisibility * 0.2;
      });

      for (let point = 0; point < pointCount; point += 1) {
        const offset = point * 3;
        const baseX = basePositions[offset];
        const baseY = basePositions[offset + 1];

        let signalLift = 0;
        for (const particle of routeParticles) {
          if (particle.spriteMaterial.opacity <= 0.001) {
            continue;
          }

          const distance = Math.hypot(baseX - particle.currentPosition.x, baseY - particle.currentPosition.y);
          signalLift += Math.max(0, 1 - distance / 4.8) * particle.spriteMaterial.opacity * 0.48;
        }

        const pointerDistance = Math.hypot(baseX - pointerX, baseY - pointerY);
        const pointerInfluence = Math.max(0, 1 - pointerDistance / 10.8);
        const relief = THREE.MathUtils.lerp(flatHeights[point], elevatedHeights[point], intro.sculpture);
        const wave =
          intro.atmosphere *
          intro.sculpture *
          (Math.sin(t + baseX * 0.22 + baseY * 0.14) * 0.16 +
            Math.cos(t * 1.45 + baseX * 0.12 - baseY * 0.18) * 0.1);

        pointPositions[offset] = baseX + pointerInfluence * pointer.x * 0.44;
        pointPositions[offset + 1] = baseY + pointerInfluence * pointer.y * 0.34;
        pointPositions[offset + 2] =
          relief +
          wave +
          signalLift +
          pointerInfluence * intro.sculpture * 0.42 -
          scrollProgress * intro.atmosphere * 0.18;
      }

      pointPositionAttribute.needsUpdate = true;
      syncLineGeometry();

      pointsMaterial.opacity = 0.08 + intro.blueprint * 0.18 + intro.sculpture * 0.14;
      pointsMaterial.size = 0.08 + intro.sculpture * 0.03;
      linesMaterial.opacity = 0.04 + intro.blueprint * 0.08 + intro.sculpture * 0.03;

      routes.forEach((route, index) => {
        const reveal = clamp01((intro.routes - route.offset) / 0.48);
        const visiblePoints = Math.max(2, Math.floor(route.pointCount * reveal));
        route.baseGeometry.setDrawRange(0, visiblePoints);
        route.coreGeometry.setDrawRange(0, visiblePoints);
        route.baseMaterial.opacity = 0.05 + reveal * 0.07 + intro.blueprint * 0.03;
        route.coreMaterial.opacity =
          reveal * (0.08 + intro.traffic * 0.2) * (0.82 + (Math.sin(t * 1.6 + index * 0.7) + 1) * 0.09);
      });

      heroNodes.forEach((node) => {
        const offset = node.pointIndex * 3;
        const x = pointPositions[offset];
        const y = pointPositions[offset + 1];
        const z = pointPositions[offset + 2] + 0.18;
        const pulse = (Math.sin(t * 2.4 + node.phase) + 1) / 2;
        const nodeVisibility = intro.nodes * (0.76 + intro.atmosphere * 0.24);

        node.core.position.set(x, y, z);
        node.halo.position.set(x, y, z);
        node.ring.position.set(x, y, z);

        node.core.scale.setScalar(node.baseScale + pulse * 0.1 * node.emphasis);
        node.halo.scale.setScalar(node.haloScale + pulse * 0.9 * node.emphasis);
        node.ring.scale.setScalar(node.ringScale + pulse * 0.62 * node.emphasis);

        node.coreMaterial.opacity = nodeVisibility * (0.48 + pulse * 0.2);
        node.haloMaterial.opacity = nodeVisibility * (0.08 + pulse * 0.09);
        node.ringMaterial.opacity = nodeVisibility * (0.14 + pulse * 0.16);
      });

      ambientGlows.forEach((glow, index) => {
        const material = glow.sprite.material as THREE.SpriteMaterial;
        glow.sprite.position.set(
          glow.basePosition.x + Math.sin(t * glow.speed + glow.phase) * glow.amplitudeX,
          glow.basePosition.y + Math.cos(t * (glow.speed + 0.16) + glow.phase) * glow.amplitudeY,
          glow.basePosition.z,
        );
        material.opacity =
          intro.atmosphere *
          (glow.baseOpacity + (Math.sin(t * (0.8 + index * 0.12) + glow.phase) + 1) * 0.028);
      });

      fieldGroup.rotation.x = -0.72 + intro.sculpture * 0.24 + pointer.y * 0.07;
      fieldGroup.rotation.y = -0.46 + intro.sculpture * 0.2 + pointer.x * 0.12;
      fieldGroup.rotation.z = -0.1 + Math.sin(t * 0.54) * 0.018 - scrollProgress * 0.03;
      fieldGroup.position.x = 3.8 + pointer.x * 0.6;
      fieldGroup.position.y = -1 + intro.sculpture * 0.42 + Math.sin(t * 0.92) * 0.18 - scrollProgress * 0.44;
      fieldGroup.scale.setScalar(1.18 + intro.sculpture * 0.06 + (Math.sin(t * 0.6) + 1) * 0.01);
      camera.position.z = 28.4 - intro.sculpture * 2.2 + scrollProgress * 0.9;

      renderer.render(scene, camera);
    };

    updateRendererSize();
    handleScroll();
    syncLineGeometry();

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', updateRendererSize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    if (prefersReducedMotion) {
      renderFrame(1800);
    } else {
      const animate = (time: number) => {
        if (disposed || !animationActive) {
          return;
        }

        renderFrame(time);
        animationFrame = window.requestAnimationFrame(animate);
      };

      animationFrame = window.requestAnimationFrame(animate);
    }

    return () => {
      disposed = true;
      animationActive = false;
      window.cancelAnimationFrame(animationFrame);
      introTimeline?.kill();

      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', updateRendererSize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);

      pointGeometry.dispose();
      lineGeometry.dispose();
      pointsMaterial.dispose();
      linesMaterial.dispose();

      routes.forEach((route) => {
        route.baseGeometry.dispose();
        route.coreGeometry.dispose();
        route.baseMaterial.dispose();
        route.coreMaterial.dispose();
      });

      routeParticles.forEach((particle) => {
        particle.spriteMaterial.dispose();
        particle.haloMaterial.dispose();
      });

      heroNodes.forEach((node) => {
        node.coreMaterial.dispose();
        node.haloMaterial.dispose();
        node.ringMaterial.dispose();
      });

      ambientGlows.forEach((glow) => {
        const material = glow.sprite.material as THREE.SpriteMaterial;
        material.dispose();
      });

      radialTexture?.dispose();
      ringTexture?.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion, ready]);

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 z-10">
      <canvas ref={canvasRef} className="h-full w-full opacity-95" />
    </div>
  );
}
