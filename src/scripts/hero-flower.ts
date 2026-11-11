/**
 * Hero flower intro: the artwork is first drawn as fine ink lines growing from the stem,
 * then its translucent petals fill in behind the drawing front. Once open it stays alive:
 * a breeze, periodic gusts that ripple the petals and send light along their hairlines,
 * pollen rising and drifting with the wind, and petals that lean away from the cursor.
 * Line and growth maps are baked from the artwork by tools/hero-flower/bake.py.
 */
const LINES_SRC = '/images/hero/abstract-flower-lines.webp';
const GROWTH_SRC = '/images/hero/abstract-flower-growth.webp';
/** Seconds. DRAW: lines reach the furthest petal tip. FILL_*: petals fill behind them. */
const DRAW = 2.1;
const FILL_DELAY = 0.75;
const FILL = 2.2;
const INTRO = FILL_DELAY + FILL + 0.5;
/** Idle life. Gusts arrive every GUST_EVERY ± GUST_JITTER seconds and last GUST_LENGTH. */
const GUST_EVERY = 8.5;
const GUST_JITTER = 2.5;
const GUST_LENGTH = 3.2;
const POLLEN = 64;

function loadImage(src: string) {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  return image.decode().then(() => image);
}

export async function animateHeroFlower(host: HTMLElement) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Mobile runs the same animation; the flower just sits behind the copy there (see global.css).
  const desktop = window.matchMedia('(min-width: 741px)');
  const image = host.querySelector('img')!;
  const canvas = host.querySelector('canvas')!;
  let cleanup = () => {};
  let running = false;

  async function start() {
    if (running || motion.matches) {
      if (!running) host.dataset.phase = desktop.matches ? 'static' : 'background';
      return;
    }
    running = true;
    host.dataset.phase = 'loading';
    try {
      const [, lineImage, growthImage, THREE] = await Promise.all([
        image.decode(), loadImage(LINES_SRC), loadImage(GROWTH_SRC), import('three'),
      ]);
      if (!host.isConnected || motion.matches) {
        running = false;
        host.dataset.phase = desktop.matches ? 'static' : 'background';
        return;
      }
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      const texture = new THREE.Texture(image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      const lineTexture = new THREE.Texture(lineImage);
      lineTexture.needsUpdate = true;
      const growthTexture = new THREE.Texture(growthImage);
      growthTexture.needsUpdate = true;
      const uniforms = {
        artwork: { value: texture }, lines: { value: lineTexture }, growthMap: { value: growthTexture },
        draw: { value: 0 }, fill: { value: 0 }, settle: { value: 0 }, time: { value: 0 },
        gust: { value: 0 }, sweep: { value: -1 }, lineGain: { value: 1.7 }, pointer: { value: new THREE.Vector2(9, 9) }, near: { value: 0 },
      };
      const material = new THREE.ShaderMaterial({
        uniforms, transparent: true, depthTest: false, depthWrite: false,
        vertexShader: `
          uniform float settle;
          uniform float time;
          uniform float gust;
          uniform vec2 pointer;
          uniform float near;
          varying vec2 artworkUv;
          void main() {
            artworkUv = uv;
            vec3 p = position;
            float petal = smoothstep(0.12, 0.42, uv.y);
            float rooted = uv.y * uv.y;
            p.x += settle * rooted * (sin(time * 0.72) * 0.012 + sin(time * 1.17 + uv.y * 4.0) * 0.006);
            p.y += settle * petal * sin(time * 0.85 + uv.x * 5.0) * 0.006;
            // Gust: a wave travelling left to right, petals fluttering at their edges.
            float wave = sin(uv.x * 4.2 - time * 2.6 + uv.y * 1.5);
            p.x += gust * rooted * (0.028 + 0.016 * wave);
            p.y += gust * petal * sin(uv.x * 9.0 + time * 4.6) * 0.009 * (0.6 + 0.4 * wave);
            // Cursor: petals lean away from it, more at the tips than near the stem.
            vec2 away = p.xy - pointer;
            float push = exp(-dot(away, away) * 7.0) * near * petal;
            p.xy += normalize(away + 0.0001) * push * 0.045;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D artwork;
          uniform sampler2D lines;
          uniform sampler2D growthMap;
          uniform float draw;
          uniform float fill;
          uniform float settle;
          uniform float sweep;
          uniform float gust;
          uniform float lineGain;
          varying vec2 artworkUv;
          const vec3 ink = vec3(0.345, 0.2, 0.275);
          const vec3 glow = vec3(0.86, 0.55, 0.72);
          void main() {
            vec4 art = texture2D(artwork, artworkUv);
            float line = texture2D(lines, artworkUv).r;
            float order = texture2D(growthMap, artworkUv).r;
            // Drawing: lines appear behind a front that travels out from the stem.
            float drawn = smoothstep(draw, draw - 0.035, order);
            float front = smoothstep(0.06, 0.0, abs(order - draw)) * step(draw, 1.02);
            float lineA = clamp(line * lineGain, 0.0, 1.0) * drawn * (1.0 - settle * 0.9);
            vec3 lineColour = mix(ink, glow, front * 0.85);
            lineA = max(lineA, line * front * 0.9);
            // Filling: the artwork washes in behind the lines, lighter first, then full colour.
            float filled = smoothstep(fill, fill - 0.16, order);
            float fillA = art.a * filled;
            vec3 fillColour = mix(vec3(1.0, 0.97, 0.98), art.rgb, smoothstep(0.0, 0.6, filled * (0.35 + fill)));
            float outA = fillA + lineA * (1.0 - fillA);
            vec3 colour = (fillColour * fillA + lineColour * lineA * (1.0 - fillA)) / max(outA, 0.0001);
            // Light carried by the gust, running along the petal hairlines.
            float band = smoothstep(0.22, 0.0, abs(artworkUv.x * 0.8 + artworkUv.y * 0.35 - sweep));
            colour = mix(colour, vec3(1.0, 0.9, 0.96), clamp(line * 1.8, 0.0, 1.0) * band * gust * 0.85);
            gl_FragColor = vec4(colour, outA);
            #include <colorspace_fragment>
          }
        `,
      });
      const geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
      const scene = new THREE.Scene();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      scene.add(mesh);
      const seeds = new Float32Array(POLLEN * 4);
      for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
      const pollenGeometry = new THREE.BufferGeometry();
      pollenGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(POLLEN * 3), 3));
      pollenGeometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 4));
      const pollenUniforms = {
        time: uniforms.time, gust: uniforms.gust, pointer: uniforms.pointer, near: uniforms.near,
        alive: { value: 0 }, scale: { value: 1 },
      };
      const pollenMaterial = new THREE.ShaderMaterial({
        uniforms: pollenUniforms, transparent: true, depthTest: false, depthWrite: false,
        vertexShader: `
          attribute vec4 seed;
          uniform float time;
          uniform float gust;
          uniform vec2 pointer;
          uniform float near;
          uniform float scale;
          varying float alpha;
          varying float softness;
          varying float tint;
          void main() {
            float life = fract(time * (0.035 + seed.y * 0.05) + seed.x);
            float depth = seed.z;
            // Born over the petals, rising slowly and swaying; gusts carry it to the right.
            vec2 p = vec2(-0.75 + seed.w * 1.55, -0.45 + fract(seed.x * 7.13) * 0.55);
            p.y += life * (0.55 + depth * 0.5);
            p.x += sin(time * (0.4 + seed.y) + seed.w * 12.0) * 0.05 + gust * life * 0.35;
            vec2 away = p - pointer;
            p += normalize(away + 0.0001) * exp(-dot(away, away) * 9.0) * near * 0.12;
            alpha = sin(3.14159 * life) * (0.5 + 0.45 * (1.0 - depth));
            alpha *= smoothstep(1.02, 0.8, abs(p.x)) * smoothstep(1.02, 0.8, abs(p.y));
            softness = depth;
            tint = fract(seed.w * 3.7);
            gl_PointSize = (2.6 + depth * 9.0) * scale;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.1, 1.0);
          }
        `,
        fragmentShader: `
          uniform float alive;
          varying float alpha;
          varying float softness;
          varying float tint;
          void main() {
            float r = length(gl_PointCoord - 0.5) * 2.0;
            float dotA = smoothstep(1.0, mix(0.55, 0.0, softness), r);
            // Some grains are dark enough to read on paper, others light enough to read on the petals.
            vec3 colour = mix(vec3(0.45, 0.24, 0.35), vec3(0.93, 0.74, 0.84), tint);
            gl_FragColor = vec4(colour, dotA * alpha * alive);
            #include <colorspace_fragment>
          }
        `,
      });
      const pollen = new THREE.Points(pollenGeometry, pollenMaterial);
      pollen.frustumCulled = false;
      scene.add(pollen);
      const camera = new THREE.OrthographicCamera(-1.04, 1.04, 1.04, -1.04, 0.1, 10);
      camera.position.z = 2;
      let frame = 0;
      let elapsed = 0;
      let previous = 0;
      let visible = true;
      let disposed = false;
      let gustStart = INTRO + 2.5;
      const pointerTarget = new THREE.Vector2(9, 9);
      let nearTarget = 0;
      const area = host.closest('section')!;
      const onPointer = (event: PointerEvent) => {
        const box = host.getBoundingClientRect();
        pointerTarget.set(((event.clientX - box.left) / box.width) * 2.08 - 1.04, 1.04 - ((event.clientY - box.top) / box.height) * 2.08);
        nearTarget = 1;
      };
      const offPointer = () => { nearTarget = 0; };
      area.addEventListener('pointermove', onPointer);
      area.addEventListener('pointerleave', offPointer);
      const resize = () => {
        pollenUniforms.scale.value = renderer.getPixelRatio() * Math.max(host.clientWidth / 660, 0.6);
        renderer.setSize(host.clientWidth, host.clientHeight, false);
        // Hairlines thin out when the 1254px artwork is drawn small (mobile): compensate.
        uniforms.lineGain.value = 1.7 * Math.pow(Math.min(Math.max(1254 / Math.max(canvas.width, 1), 1), 2.4), 0.9);
        renderer.render(scene, camera);
      };
      const draw = (now: number) => {
        frame = 0;
        if (disposed || !visible || document.hidden) return;
        if (motion.matches) { sync(); return; }
        // Cap the step: a slow first frame (shader compile, texture upload) must not skip the drawing.
        if (previous) elapsed += Math.min((now - previous) / 1000, 1 / 30);
        previous = now;
        const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 2.2);
        uniforms.draw.value = ease(elapsed / DRAW) * 1.08;
        uniforms.fill.value = ease((elapsed - FILL_DELAY) / FILL) * 1.2;
        uniforms.settle.value = Math.min(Math.max((elapsed - INTRO + 0.6) / 1.2, 0), 1);
        uniforms.time.value = elapsed;
        const life = uniforms.settle.value;
        pollenUniforms.alive.value = life;
        // Gust envelope: smooth rise and fall; the light sweep crosses the flower meanwhile.
        if (life >= 1 && elapsed > gustStart + GUST_LENGTH) {
          gustStart = elapsed + GUST_EVERY - GUST_LENGTH + (Math.random() * 2 - 1) * GUST_JITTER;
        }
        const g = Math.min(Math.max((elapsed - gustStart) / GUST_LENGTH, 0), 1);
        uniforms.gust.value = life * Math.sin(Math.PI * g) ** 2;
        uniforms.sweep.value = -0.3 + g * 1.7;
        uniforms.pointer.value.lerp(pointerTarget, 0.08);
        uniforms.near.value += (nearTarget * life - uniforms.near.value) * 0.05;
        renderer.render(scene, camera);
        host.dataset.phase = elapsed < INTRO ? 'growing' : 'breeze';
        host.dataset.animated = 'true';
        frame = requestAnimationFrame(draw);
      };
      const sync = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        if (motion.matches) {
          host.dataset.animated = 'false';
          host.dataset.phase = desktop.matches ? 'static' : 'background';
        } else if (visible && !document.hidden && !disposed) {
          frame = requestAnimationFrame(draw);
        }
      };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      observer.observe(host.closest('section')!);
      const sizing = new ResizeObserver(resize);
      sizing.observe(host);
      const lost = (event: Event) => { event.preventDefault(); cleanup(); };
      cleanup = () => {
        if (disposed) return;
        disposed = true;
        running = false;
        cancelAnimationFrame(frame);
        observer.disconnect(); sizing.disconnect();
        document.removeEventListener('visibilitychange', sync);
        motion.removeEventListener('change', sync);
        desktop.removeEventListener('change', sync);
        canvas.removeEventListener('webglcontextlost', lost);
        area.removeEventListener('pointermove', onPointer);
        area.removeEventListener('pointerleave', offPointer);
        pollenGeometry.dispose(); pollenMaterial.dispose();
        geometry.dispose(); material.dispose(); texture.dispose(); lineTexture.dispose(); growthTexture.dispose(); renderer.dispose();
        host.dataset.animated = 'false';
        host.dataset.phase = 'static';
      };
      canvas.addEventListener('webglcontextlost', lost);
      motion.addEventListener('change', sync);
      desktop.addEventListener('change', sync);
      document.addEventListener('visibilitychange', sync);
      resize(); sync();
    } catch {
      cleanup(); running = false;
      host.dataset.phase = 'static';
    }
  }
  const tryStart = () => { if (!running) void start(); };
  desktop.addEventListener('change', tryStart);
  motion.addEventListener('change', tryStart);
  const teardown = () => {
    cleanup();
    desktop.removeEventListener('change', tryStart);
    motion.removeEventListener('change', tryStart);
    window.removeEventListener('pagehide', pagehide);
    document.removeEventListener('astro:before-swap', teardown);
  };
  const pagehide = (event: PageTransitionEvent) => { if (!event.persisted) teardown(); };
  window.addEventListener('pagehide', pagehide);
  document.addEventListener('astro:before-swap', teardown);
  await start();
}
