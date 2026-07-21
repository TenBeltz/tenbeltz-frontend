# CLAUDE.md

Web corporativa de TenBeltz (Beltz Dev SL). Astro 5 en modo SSR, bilingüe español/inglés.

## Stack

- **Framework:** Astro 5, `output: 'server'` con adaptador `@astrojs/node` (standalone)
- **Estilos:** Tailwind CSS v4 vía `@tailwindcss/vite`
- **Islas interactivas:** React 18
- **i18n:** i18n nativo de Astro. `es` por defecto sin prefijo, `en` bajo `/en/`
- **Gestor de paquetes:** npm
- **Despliegue:** VPS con nginx + pm2. El despliegue lo ejecuta una persona, no el agente

## Estructura

```
src/pages/          rutas en español (locale por defecto, sin prefijo)
src/pages/en/       rutas en inglés (espejo de la estructura española)
src/templates/      un componente por tipo de página, COMPARTIDO entre idiomas
src/components/     componentes reutilizables
src/layouts/        Layout.astro — envuelve SEO.astro, deriva el idioma de la URL
src/i18n/           es.ts, en.ts, services.ts, ui.ts, utils.ts
seo/                documentación y trazabilidad de SEO
docs/deploy/        configuración de servidor
```

No hay rutas dinámicas. El sitio son **10 URLs**: 5 páginas × 2 idiomas.

## Reglas que importan

### Los templates están compartidos entre idiomas

`src/pages/x.astro` y `src/pages/en/x.astro` renderizan **el mismo componente** de
`src/templates/`. Cualquier valor dependiente del idioma tiene que derivarse de `lang`,
nunca escribirse fijo.

Esto ya causó un fallo real: canonicals en español codificados a mano hacían que las páginas
inglesas se declarasen duplicados. Ver `seo/aprendizajes.md`.

```astro
// mal — se aplica igual a /politicas y a /en/politicas
canonical="https://tenbeltz.com/politicas"

// bien
const canonical = `https://tenbeltz.com${lang === 'en' ? '/en' : ''}/politicas`;
```

### URLs sin barra final

Convención: **sin barra final**, salvo la raíz. `trailingSlash: 'never'` hace que
`/services/` responda 301 hacia `/services`.

Los canonicals y el sitemap deben coincidir exactamente — si divergen, Google descarta las
URLs del sitemap. **Una única excepción sancionada:** el `<loc>` de la home sale como
`https://tenbeltz.com` sin barra, mientras su canonical es `https://tenbeltz.com/`. Lo
impone `write-sitemap.js` de `@astrojs/sitemap`, que hace un reemplazo sobre el XML ya
generado cuando `trailingSlash` es `'never'`; no se puede desactivar desde la configuración.
Es inocuo (RFC 3986 normaliza la ruta vacía a `/`), pero cualquier **otra** divergencia sí
es un fallo.

El hook `serialize` de `astro.config.mjs` quita la barra del resto y construye los hreflang.
Ojo: el mapa de slugs traducidos está **duplicado** en `astro.config.mjs` y en
`SEO.astro` — si añades un slug traducido, tócalo en los dos o el sitemap y las etiquetas
`<link rel="alternate">` dejarán de coincidir en silencio.

Y no quites el `filter` del sitemap: la opción `i18n` de la integración hacía dos cosas a la
vez, y al retirarla se perdió el filtrado automático de `/404` y `/500` por locale.

### Verificar antes de afirmar

Para datos estructurados y verificables (sitemaps, cabeceras, JSON-LD) usa `curl` y
parsea, no un resumen en lenguaje natural: las herramientas de resumen han llegado a
inventar URLs que no existían en este mismo repo.

Para comprobar los canonicals contra el sitemap:

```bash
npm run build
node ./dist/server/entry.mjs &
# comparar el canonical renderizado de cada ruta con su propia URL
```

## SEO

El trabajo de SEO se documenta en [`seo/`](seo/). **Léelo antes de tocar nada relacionado**:

| Documento | Para qué |
|---|---|
| [`seo/estado-actual.md`](seo/estado-actual.md) | Foto actual: URLs, indexación, herramientas conectadas |
| [`seo/pendientes.md`](seo/pendientes.md) | Backlog priorizado, con responsable por tarea |
| [`seo/historico.md`](seo/historico.md) | Qué se cambió, cuándo y cómo se verificó |
| [`seo/decisiones.md`](seo/decisiones.md) | Decisiones cerradas y su porqué |
| [`seo/aprendizajes.md`](seo/aprendizajes.md) | Diagnósticos que resultaron falsos |

Al tocar SEO: añade entrada en `historico.md` **con la verificación**, y cierra lo que
corresponda en `pendientes.md`. Una entrada sin verificación no vale — el valor está en
distinguir "lo cambié" de "comprobé que funciona en producción".

## Comandos

```bash
npm run dev      # desarrollo
npm run build    # astro check && astro build && postbuild-compat
npm run preview  # servir el build
```

`npm run build` incluye `astro check`, así que los errores de tipos rompen el build.
`astro.config.mjs` también se comprueba: usa JSDoc para tipar los parámetros.

## Contexto de negocio

TenBeltz es el nombre comercial de Beltz Dev SL (NIF B21697719), Leioa, Bizkaia. Equipo
externo de ingeniería de IA para empresas de software: productos SaaS y consultoras.

Cuatro modalidades: AI Gap Analysis, AI Project Foundations, Agent MVP, Production Delivery.

Clientes citables públicamente: Irontec (desde 2025) y Qamarero. Los otros dos casos son
anónimos por confidencialidad.

Al escribir copy, ten presente que el posicionamiento es deliberadamente específico: **no
son una agencia de IA ni una consultora generalista**. Evita el lenguaje corporativo
genérico — ya hubo que reescribir una descripción que decía "líderes en la industria" y
contradecía frontalmente el mensaje del sitio.
