# TenBeltz · Frontend

Web corporativa de **TenBeltz (Beltz Dev SL)**, equipo de ingeniería de IA para automatizar procesos en empresas y desarrollar e integrar IA en productos SaaS y proyectos de software.

Sitio bilingüe en español e inglés, con renderizado en servidor, páginas comerciales, casos de trabajo, equipo, diagnóstico de IA y formulario de contacto.

**Sitio público:** [tenbeltz.com](https://tenbeltz.com)

## Stack

- **Astro 7** con SSR y adaptador Node en modo `standalone`.
- **React 18** para las islas interactivas.
- **Tailwind CSS 4** mediante Vite.
- **GSAP y Three.js** para animaciones y escenas visuales.
- **jsPDF** para generar el informe del diagnóstico.
- **TypeScript** y comprobación de tipos con `astro check`.

## Requisitos

- Node.js **22.22.0 o superior**, según `package.json`.
- npm para los comandos de esta guía y el archivo `package-lock.json`.

> `package.json` también declara `pnpm@10.28.0` en `packageManager`, pero el repositorio incluye un lockfile de npm y `deploy.sh` usa npm. Esta guía sigue ese flujo; evita mezclar gestores o regenerar el lockfile sin revisar el cambio.

## Inicio rápido

Desde la raíz del repositorio:

```bash
npm ci
cp .env.example .env
npm run dev
```

Abre [localhost:4321](http://localhost:4321). La web puede explorarse sin el backend privado; el envío de formularios requiere la configuración siguiente.

### Configuración del contacto

| Variable | Uso |
| --- | --- |
| `CONTACT_BRIDGE_TOKEN` | Token privado con el que el servidor frontend se autentica frente al backend de contacto. |

El endpoint `POST /api/contact` reenvía las solicitudes al backend privado en `http://127.0.0.1:10024/api/contact`. Ese servicio **no forma parte de este repositorio** y debe estar accesible desde el servidor frontend.

- Sin token, el endpoint devuelve `503`; un backend inaccesible también produce `503`.
- El token no debe llevar prefijo `PUBLIC_` ni incluirse en el control de versiones.
- Para pruebas locales, usa `localhost` o `127.0.0.1`: el endpoint valida el host y exige un encabezado `Origin` del mismo origen.
- Solo acepta JSON y limita el cuerpo a 32 KiB.
- Tras cambiar el token, recompila y reinicia el servicio: se lee mediante `import.meta.env`.

No necesitas claves de proveedores de IA para navegar por la web o utilizar el diagnóstico local. La ruta heredada `/api/agent/*` está deshabilitada y responde `404`.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm start` | Alias del servidor de desarrollo; no inicia producción. |
| `npm run astro -- check` | Comprueba tipos y archivos Astro. |
| `npm run build` | Ejecuta `astro check`, compila y genera los alias de compatibilidad de assets. |
| `npm run preview` | Sirve el build para una revisión local. |
| `npm run astro -- --help` | Muestra la ayuda de la CLI de Astro. |

### Compilar y ejecutar el servidor

```bash
npm run build
HOST=127.0.0.1 PORT=3001 node ./dist/server/entry.mjs
```

El build genera `dist/client/` para los archivos públicos y `dist/server/` para el servidor SSR. No es un sitio que pueda publicarse copiando únicamente archivos estáticos.

## Estructura del proyecto

```text
src/
├── pages/          Rutas ES, rutas EN bajo en/ y endpoints API
├── templates/      Plantillas de página compartidas entre idiomas
├── components/     Componentes Astro e islas React
├── layouts/        Layout común
├── data/           Audiencias, soluciones, proyectos, equipo y perfil
├── i18n/           Traducciones y correspondencia entre rutas ES/EN
├── lib/            Lógica del diagnóstico y generación del informe
├── services/       Cliente del formulario de contacto
├── styles/         Estilos globales
├── assets/         Recursos procesados por el build
└── middleware.ts   Política de caché de respuestas
public/             Archivos servidos sin transformación
scripts/            Utilidades de build, imágenes sociales e indexación
docs/               Guías, decisiones y verificaciones históricas
seo/                Seguimiento, decisiones y aprendizajes de SEO
astro.config.mjs    SSR, integraciones, idiomas y sitemap
```

## Rutas e idiomas

El código contiene **24 páginas comerciales: 12 por idioma**, además de páginas de error y endpoints API. Este inventario describe el repositorio, no certifica qué versión está publicada en producción.

| Página | Español | Inglés |
| --- | --- | --- |
| Inicio | `/` | `/en` |
| IA para empresas | `/ia-para-empresas` | `/en/ai-for-business` |
| IA para software | `/ia-para-software` | `/en/ai-for-software` |
| Servicios | `/services` | `/en/services` |
| Casos | `/casos` | `/en/case-studies` |
| Equipo | `/quien-esta-detras` | `/en/who-is-behind` |
| Perfil de Aritz | `/aritz` | `/en/aritz` |
| Diagnóstico | `/diagnostico-ia` | `/en/ai-diagnosis` |
| Evaluación de IA | `/evaluacion-ia-saas` | `/en/ai-evaluation-for-saas` |
| Agentes de voz | `/agentes-voz-saas` | `/en/voice-agents-for-saas` |
| IA privada | `/ia-privada-productos` | `/en/private-ai-products` |
| Políticas | `/politicas` | `/en/politicas` |

### Añadir o modificar contenido

1. Revisa `src/data/` y `src/i18n/` antes de duplicar contenido en una página.
2. Mantén las rutas ES/EN como entradas de una misma plantilla en `src/templates/`.
3. Si el slug cambia entre idiomas, registra el par en `src/i18n/routes.js`. Usa `localizedPath(pathname, lang)` para obtener su equivalente.
4. Comprueba textos, navegación, canonical, `hreflang` y sitemap en ambos idiomas.

Las URLs no llevan barra final, salvo `/`. No fijes un canonical español en una plantilla compartida. Las páginas `noindex` deben quedar fuera del sitemap; la exclusión se configura en `astro.config.mjs`.

## Verificación antes de entregar

- Ejecuta `npm run build`; los errores de tipos bloquean la compilación.
- Revisa las páginas afectadas en español e inglés, en móvil y escritorio.
- Comprueba navegación, selector de idioma, formularios y consola del navegador.
- Si modificas el diagnóstico, prueba sus resultados y la descarga del PDF.
- Si modificas rutas o SEO, contrasta el HTML servido con `sitemap-index.xml` y sus sitemaps.

No hay un script `npm test` definido. Un build correcto no sustituye las comprobaciones funcionales ni demuestra que el correo haya llegado al destinatario.

## Despliegue

El despliegue lo realiza una persona autorizada. Antes de ejecutarlo, confirma el gestor de procesos, los puertos, las variables y la configuración Nginx del entorno de destino.

**Hay dos referencias distintas en el repositorio:**

- [`deploy.sh`](deploy.sh) hace `git pull`, `npm install`, build y arranque/reinicio mediante **PM2 en el puerto 3001**. Conserva assets anteriores de `/_astro/` para reducir errores de caché. No garantiza despliegue sin interrupciones.
- El [registro de producción del 2026-10-09](docs/deploy/production-2026-10-09.md) describe **systemd**, frontend en loopback `10022` y backend en `10024`. Es una fotografía fechada, no una comprobación del servidor actual.

**No ejecutes `deploy.sh` suponiendo que corresponde al entorno activo.** Nginx debe aplicar también la política de caché de archivos estáticos: el adaptador Node puede servirlos antes del middleware Astro. Consulta la [documentación de Nginx](docs/deploy/nginx-seo.md), teniendo en cuenta sus apartados históricos.

## Documentación relacionada

- [Contexto comercial actual](.agents/product-marketing.md).
- [Brief de las dos audiencias](docs/dual-audience/brief.md) y [verificación de la preview](docs/dual-audience/verification.md).
- [Diagnóstico de IA](docs/ai-diagnosis-2026-10-09.md).
- [Brandbook](docs/brandbook-2026-10-08.md).
- SEO: [estado y fotografías históricas](seo/estado-actual.md), [pendientes](seo/pendientes.md), [decisiones](seo/decisiones.md) y [aprendizajes](seo/aprendizajes.md).

Los documentos fechados reflejan el alcance y las verificaciones de su momento. Distingue siempre entre código local, preview, publicación en producción e indexación.
