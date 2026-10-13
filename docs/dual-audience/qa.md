# Repetir las comprobaciones

No requiere instalar librerías del sistema. Se utilizó la imagen Playwright ya existente en Docker rootless y el módulo Playwright 1.55.1 local de `/tmp/tenbeltz-menu-qa/node_modules`.

Compilar secuencialmente con `npm run build`; reiniciar la preview sólo después del build correcto. No imprimir `.env` ni incluir secretos en logs. No se requiere cambiar Nginx, backend o producción.

## Metadatos y enlaces

```bash
python3 tools/qa/dual-seo.py http://127.0.0.1:10022
node tools/qa/contact-origin.mjs
```

La auditoría SEO hace GET a las 24 rutas y a sus enlaces internos. La guardia de contacto usa cuerpos inválidos para no enviar correo.

## Navegador aislado

Ejecutar desde el checkout. Un contenedor a la vez. `QA_MODE=layout` revisa las seis rutas principales en siete anchos; `QA_MODE=interactions` revisa menús, foco, FAQ, explorador, contacto interceptado, PDF y fallback sin JS. El valor por defecto `all` combina ambos con un navegador nuevo entre fases.

```bash
mkdir -p tmp/dual-audience-qa
DOCKER_HOST=unix:///run/user/1001/docker.sock docker run --rm \
  --name tenbeltz-dual-qa --network none --memory 2g --cpus 2 --pids-limit 256 \
  -e QA_MODE=layout \
  -v "$PWD/dist:/app/dist:ro" \
  -v "$PWD/node_modules:/app/node_modules:ro" \
  -v "$PWD/package.json:/app/package.json:ro" \
  -v "$PWD/tmp/dual-audience-qa:/qa" \
  -v "$PWD/tools/qa/dual-browser.cjs:/qa/dual-browser.cjs:ro" \
  -v /tmp/tenbeltz-menu-qa/node_modules:/qa/node_modules:ro \
  -w /app mcr.microsoft.com/playwright:v1.55.1-noble node /qa/dual-browser.cjs
```

El script inicia el mismo build Astro dentro del contenedor, en su loopback. No tiene red externa ni acceso al SMTP activo. Intercepta `/api/contact`; los datos usados son ficticios. No comprueba login positivo Nginx ni sustituye una medición de campo. Los resultados y capturas quedan en tmp/dual-audience-qa.

## Recursos sociales

```bash
/home/dev/.cache/tenbeltz-brand-venv/bin/python tools/marketing/dual-og.py
```

Genera sólo los seis recursos nuevos public/og/tenbeltz-{home,business,software}-{es,en}.png con los colores, fuentes y logo existentes. No regenera ni modifica el kit de marca aprobado. Verificar visualmente y comprobar 1200×630 y HTTP image/png.
