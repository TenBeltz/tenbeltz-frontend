/** Original reference artwork: one unfolding mesh, then a gentle breeze. */
export async function animateHeroFlower(host: HTMLElement) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 741px)');
  const image = host.querySelector('img')!;
  const canvas = host.querySelector('canvas')!;
  let cleanup = () => {};
  let running = false;

  async function start() {
    if (running || !desktop.matches || motion.matches) {
      if (!running) host.dataset.phase = desktop.matches ? 'static' : 'background';
      return;
    }
    running = true;
    host.dataset.phase = 'loading';
    try {
      await image.decode();
      const THREE = await import('three');
      if (!host.isConnected || !desktop.matches || motion.matches) {
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
      const uniforms = {
        artwork: { value: texture }, growth: { value: 0 }, time: { value: 0 },
      };
      const material = new THREE.ShaderMaterial({
        uniforms, transparent: true, depthTest: false, depthWrite: false,
        vertexShader: `
          uniform float growth;
          uniform float time;
          varying vec2 artworkUv;
          void main() {
            artworkUv = uv;
            vec3 p = position;
            vec2 junction = vec2(0.24, -0.48);
            float petal = smoothstep(0.12, 0.42, uv.y);
            float stagger = 0.10 * sin(uv.x * 6.28) + 0.12 * uv.y;
            float open = smoothstep(stagger, 1.0, growth);
            float spread = mix(0.07, 1.0, open);
            p.x = mix(p.x, junction.x + (p.x - junction.x) * spread, petal);
            p.y = -1.0 + (p.y + 1.0) * mix(0.06, 1.0, smoothstep(0.0, 0.82, growth));
            p.y += petal * (1.0 - open) * 0.16 * sin(uv.x * 6.28);
            float rooted = uv.y * uv.y;
            float breeze = smoothstep(0.72, 1.0, growth);
            p.x += breeze * rooted * (sin(time * 0.72) * 0.012 + sin(time * 1.17 + uv.y * 4.0) * 0.006);
            p.y += breeze * petal * sin(time * 0.85 + uv.x * 5.0) * 0.006;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D artwork;
          uniform float growth;
          varying vec2 artworkUv;
          void main() {
            vec4 colour = texture2D(artwork, artworkUv);
            colour.a *= smoothstep(0.0, 0.10, growth);
            gl_FragColor = colour;
            #include <colorspace_fragment>
          }
        `,
      });
      const geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
      const scene = new THREE.Scene();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      scene.add(mesh);
      const camera = new THREE.OrthographicCamera(-1.04, 1.04, 1.04, -1.04, 0.1, 10);
      camera.position.z = 2;
      let frame = 0;
      let elapsed = 0;
      let previous = 0;
      let visible = true;
      let disposed = false;
      const resize = () => {
        renderer.setSize(host.clientWidth, host.clientHeight, false);
        renderer.render(scene, camera);
      };
      const draw = (now: number) => {
        frame = 0;
        if (disposed || !visible || document.hidden) return;
        if (motion.matches || !desktop.matches) { sync(); return; }
        if (previous) elapsed += (now - previous) / 1000;
        previous = now;
        uniforms.growth.value = Math.min(elapsed / 3.8, 1);
        uniforms.time.value = elapsed;
        renderer.render(scene, camera);
        host.dataset.phase = elapsed < 3.8 ? 'growing' : 'breeze';
        host.dataset.animated = 'true';
        frame = requestAnimationFrame(draw);
      };
      const sync = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        if (motion.matches || !desktop.matches) {
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
        geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose();
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
