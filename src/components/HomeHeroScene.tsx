"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
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

const LOGO_PATHS = [
  'M199.423 3.23574C199.423 5.13907 196.881 11.8007 193.753 18.0817C183.587 39.0183 161.886 54.2449 114.769 73.2782C60.6131 94.9762 40.0848 107.348 23.2712 127.713C8.60819 145.414 5.87109 155.121 5.87109 188.049C5.87109 201.943 6.26211 213.173 6.84863 213.173C9.39022 213.173 23.6622 205.56 84.0739 172.061C100.692 162.925 122.784 150.934 132.951 145.605C200.01 110.203 225.816 94.5955 235.201 83.1755C245.367 70.9942 249.277 56.5289 245.954 43.5863C243.412 34.0697 210.567 8.2016e-05 203.724 8.2016e-05C200.987 8.2016e-05 199.423 1.14208 199.423 3.23574Z',
  'M374.375 45.873C365.772 51.012 353.456 58.435 347.004 62.432C340.748 66.2387 326.867 77.6586 316.7 87.5559C280.727 122.197 265.282 152.079 268.801 181.009C270.756 196.807 275.448 204.23 300.473 229.735C312.399 242.106 324.13 254.478 326.476 257.523C337.033 270.656 354.433 272.179 372.615 261.52C378.871 257.714 388.842 252.194 394.708 248.958C419.537 235.445 443.975 218.695 445.735 213.937C446.908 211.272 447.69 204.991 447.69 199.852C447.69 192.049 446.517 189.384 440.065 181.39C435.959 176.441 426.966 167.115 420.319 160.834C413.672 154.553 404.678 145.227 400.377 140.088L392.752 130.761L392.948 87.7463C393.339 35.2144 393.339 36.1661 391.579 36.3564C390.602 36.3564 382.977 40.734 374.375 45.873Z',
  'M189.662 176.248C159.358 192.045 147.432 214.885 158.381 236.012C161.9 242.864 187.511 270.843 231.696 315.952C240.298 324.898 249.096 335.366 250.856 339.173C252.811 343.17 255.157 346.405 256.134 346.405C259.262 346.405 275.49 324.136 281.55 311.765C288.197 298.441 289.371 283.976 284.678 273.508C282.332 267.988 229.154 212.03 220.357 205.749C212.145 200.039 205.303 188.048 205.303 179.674C205.303 175.106 204.52 171.109 203.738 170.538C202.956 170.157 196.505 172.631 189.662 176.248Z',
  'M78.9848 239.823C75.4657 240.585 65.8859 244.772 57.4791 249.34C48.8768 253.908 34.6047 261.331 25.4159 266.089C3.12811 277.319 0 280.935 0 294.639C0 301.682 1.17304 307.201 3.51913 310.437C5.27869 313.292 19.1597 328.138 34.2137 343.365L61.5847 371.343L62.7577 385.047C63.5398 392.661 64.1263 412.836 64.3218 429.776L64.5173 460.99L77.6163 453.948C114.763 434.153 155.819 393.041 168.527 363.159C171.655 355.546 172.828 349.075 172.828 335.942C173.024 314.244 171.264 311.198 137.441 275.035C107.724 243.44 95.6029 236.017 78.9848 239.823Z',
  'M407.604 302.824C387.271 314.434 367.72 324.903 364.396 326.235C361.073 327.758 354.621 331.184 349.733 334.229C345.041 337.084 335.461 342.413 328.423 346.03C304.376 358.211 249.243 388.855 235.753 397.61C219.721 407.888 204.667 422.353 199.193 432.822C193.914 442.528 192.35 457.945 195.674 465.749C198.607 472.22 235.557 512 238.685 512C239.663 512 240.836 509.716 241.423 506.861C248.265 474.504 264.297 458.707 308.872 440.435C342.304 426.731 366.743 416.263 368.502 414.93C369.675 414.169 376.518 410.362 383.947 406.556C403.498 396.278 425.199 380.099 433.019 369.821C443.772 355.356 447.291 341.842 447.878 310.247C448.269 294.069 447.682 282.649 446.705 282.268C445.532 282.078 428.132 291.214 407.604 302.824Z',
] as const;

const LOGO_WORLD = {
  centerX: -0.8,
  centerY: 0.9,
  width: 11.8,
  height: 13.5,
};

const ROUTE_COLORS = ['#79CAFF', '#D5C7FF', '#A1E4FF', '#C45BFF', '#8BD1FF'];
const ROUTE_ANCHORS = ROUTES.flat();

const WORLD_ROUTE_ANCHORS = ROUTE_ANCHORS.map(({ column, row }) => ({
  x: (column - (GRID_COLUMNS - 1) / 2) * GRID_SPACING,
  y: (row - (GRID_ROWS - 1) / 2) * GRID_SPACING,
}));

const WORLD_HERO_NODES = HERO_NODES.map((node) => ({
  ...node,
  x: (node.column - (GRID_COLUMNS - 1) / 2) * GRID_SPACING,
  y: (node.row - (GRID_ROWS - 1) / 2) * GRID_SPACING,
}));

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function getPointIndex(column: number, row: number) {
  return row * GRID_COLUMNS + column;
}

function sampleSurfaceHeights(x: number, y: number) {
  const radialDistance = Math.hypot(x, y);
  const flat = Math.sin(radialDistance * 0.18) * 0.05;

  let routeField = 0;
  for (const anchor of WORLD_ROUTE_ANCHORS) {
    const distance = Math.hypot(x - anchor.x, y - anchor.y);
    routeField += Math.max(0, 1 - distance / (4.5 * GRID_SPACING)) * 0.12;
  }

  let nodeField = 0;
  for (const node of WORLD_HERO_NODES) {
    const distance = Math.hypot(x - node.x, y - node.y);
    nodeField += Math.max(0, 1 - distance / (3.8 * GRID_SPACING)) * 0.22 * node.emphasis;
  }

  return {
    flat,
    elevated:
      Math.cos(radialDistance * 0.34) * 0.44 +
      Math.sin(x * 0.24 + y * 0.18) * 0.18 +
      routeField * 1.08 +
      nodeField * 0.56,
  };
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
        const heights = sampleSurfaceHeights(x, y);

        const offset = index * 3;
        flatHeights[index] = heights.flat;
        elevatedHeights[index] = heights.elevated;

        basePositions[offset] = x;
        basePositions[offset + 1] = y;
        basePositions[offset + 2] = heights.flat;

        pointPositions[offset] = x;
        pointPositions[offset + 1] = y;
        pointPositions[offset + 2] = heights.flat;

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

    const logoLoader = new SVGLoader();
    const logoSvgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">${LOGO_PATHS.map((d) => `<path d="${d}" />`).join('')}</svg>`;
    const logoData = logoLoader.parse(logoSvgMarkup);
    const logoLines = logoData.paths.flatMap((shapePath, shapeIndex) =>
      shapePath.subPaths.flatMap((subPath, subPathIndex) => {
        const sampledPoints = subPath.getPoints(120);

        if (sampledPoints.length < 2) {
          return [];
        }

        const positions = new Float32Array(sampledPoints.length * 3);
        const baseXY = new Float32Array(sampledPoints.length * 2);
        const flat = new Float32Array(sampledPoints.length);
        const elevated = new Float32Array(sampledPoints.length);

        sampledPoints.forEach((point, index) => {
          const x = ((point.x / 448) - 0.5) * LOGO_WORLD.width + LOGO_WORLD.centerX;
          const y = (0.5 - point.y / 512) * LOGO_WORLD.height + LOGO_WORLD.centerY;
          const heights = sampleSurfaceHeights(x, y);
          const pointOffset = index * 3;
          const coordOffset = index * 2;

          baseXY[coordOffset] = x;
          baseXY[coordOffset + 1] = y;
          flat[index] = heights.flat;
          elevated[index] = heights.elevated;

          positions[pointOffset] = x;
          positions[pointOffset + 1] = y;
          positions[pointOffset + 2] = heights.flat + 0.18;
        });

        const geometry = new THREE.BufferGeometry();
        const attribute = new THREE.BufferAttribute(positions, 3);
        geometry.setAttribute('position', attribute);
        geometry.setDrawRange(0, 0);

        const glowMaterial = new THREE.LineBasicMaterial({
          color: '#79CAFF',
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const coreMaterial = new THREE.LineBasicMaterial({
          color: shapeIndex === 1 ? '#F1E8FF' : '#DDF3FF',
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const glowLine = new THREE.Line(geometry, glowMaterial);
        const coreLine = new THREE.Line(geometry, coreMaterial);
        fieldGroup.add(glowLine);
        fieldGroup.add(coreLine);

        return {
          pointCount: sampledPoints.length,
          positions,
          baseXY,
          flat,
          elevated,
          geometry,
          attribute,
          glowMaterial,
          coreMaterial,
          revealOffset: shapeIndex * 0.08 + subPathIndex * 0.04,
        };
      }),
    );

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
      logo: prefersReducedMotion ? 1 : 0,
      sculpture: prefersReducedMotion ? 1 : 0,
      atmosphere: prefersReducedMotion ? 1 : 0,
    };
    const signalLoop = {
      phase: prefersReducedMotion ? 1 : 0,
    };

    const introTimeline = prefersReducedMotion
      ? null
      : gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .to(intro, { blueprint: 1, duration: 0.8 }, 0)
          .to(intro, { routes: 1, duration: 1.15, ease: 'power2.inOut' }, 0.34)
          .to(intro, { nodes: 1, duration: 0.55 }, 0.98)
          .to(intro, { traffic: 1, duration: 0.9 }, 1.18)
          .to(intro, { logo: 1, duration: 1.05, ease: 'power2.inOut' }, 0.84)
          .to(intro, { sculpture: 1, duration: 1.45, ease: 'power3.inOut' }, 0.9)
          .to(intro, { atmosphere: 1, duration: 0.9 }, 1.34);
    const signalTimeline = prefersReducedMotion
      ? null
      : gsap.to(signalLoop, {
          phase: 1,
          duration: 3.8,
          ease: 'none',
          repeat: -1,
        });

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
        animationFrame = window.requestAnimationFrame(animate);
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

      const getSignalLiftAt = (baseX: number, baseY: number) => {
        let signalLift = 0;

        for (const particle of routeParticles) {
          if (particle.spriteMaterial.opacity <= 0.001) {
            continue;
          }

          const distance = Math.hypot(baseX - particle.currentPosition.x, baseY - particle.currentPosition.y);
          signalLift += Math.max(0, 1 - distance / 4.8) * particle.spriteMaterial.opacity * 0.48;
        }

        return signalLift;
      };

      for (let point = 0; point < pointCount; point += 1) {
        const offset = point * 3;
        const baseX = basePositions[offset];
        const baseY = basePositions[offset + 1];
        const signalLift = getSignalLiftAt(baseX, baseY);

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
        const tracePhase = (signalLoop.phase + route.offset * 0.85) % 1;
        const headIndex = Math.max(2, Math.floor(visiblePoints * tracePhase));
        const trailLength = Math.max(14, Math.floor(route.pointCount * 0.18));
        const startIndex = Math.max(0, headIndex - trailLength);
        const traceCount = Math.max(2, headIndex - startIndex);
        route.baseGeometry.setDrawRange(0, visiblePoints);
        route.coreGeometry.setDrawRange(startIndex, traceCount);
        route.baseMaterial.opacity = 0.05 + reveal * 0.07 + intro.blueprint * 0.03;
        route.coreMaterial.opacity =
          reveal *
          intro.traffic *
          (0.12 + (Math.sin(t * 1.6 + index * 0.7) + 1) * 0.12);
      });

      logoLines.forEach((logoLine, index) => {
        const reveal = clamp01((intro.logo - logoLine.revealOffset) / 0.42);
        const visiblePoints = Math.max(2, Math.floor(logoLine.pointCount * reveal));
        logoLine.geometry.setDrawRange(0, visiblePoints);

        for (let point = 0; point < logoLine.pointCount; point += 1) {
          const coordOffset = point * 2;
          const offset = point * 3;
          const baseX = logoLine.baseXY[coordOffset];
          const baseY = logoLine.baseXY[coordOffset + 1];
          const signalLift = getSignalLiftAt(baseX, baseY);
          const pointerDistance = Math.hypot(baseX - pointerX, baseY - pointerY);
          const pointerInfluence = Math.max(0, 1 - pointerDistance / 12.6);
          const relief = THREE.MathUtils.lerp(logoLine.flat[point], logoLine.elevated[point], intro.sculpture);
          const wave =
            intro.atmosphere *
            intro.sculpture *
            (Math.sin(t + baseX * 0.22 + baseY * 0.14) * 0.16 +
              Math.cos(t * 1.45 + baseX * 0.12 - baseY * 0.18) * 0.1);

          logoLine.positions[offset] = baseX + pointerInfluence * pointer.x * 0.24;
          logoLine.positions[offset + 1] = baseY + pointerInfluence * pointer.y * 0.18;
          logoLine.positions[offset + 2] =
            relief +
            wave +
            signalLift * 0.92 +
            pointerInfluence * intro.sculpture * 0.28 +
            0.22 -
            scrollProgress * intro.atmosphere * 0.14;
        }

        logoLine.attribute.needsUpdate = true;
        logoLine.glowMaterial.opacity = reveal * intro.logo * (0.08 + intro.atmosphere * 0.08);
        logoLine.coreMaterial.opacity = reveal * intro.logo * (0.14 + intro.atmosphere * 0.2 + (Math.sin(t * 1.2 + index) + 1) * 0.03);
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
    const animate = (time: number) => {
      if (disposed || !animationActive) {
        return;
      }

      renderFrame(time);
      animationFrame = window.requestAnimationFrame(animate);
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
      animationFrame = window.requestAnimationFrame(animate);
    }

    return () => {
      disposed = true;
      animationActive = false;
      window.cancelAnimationFrame(animationFrame);
      introTimeline?.kill();
      signalTimeline?.kill();

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

      logoLines.forEach((logoLine) => {
        logoLine.geometry.dispose();
        logoLine.glowMaterial.dispose();
        logoLine.coreMaterial.dispose();
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
