# Estado actual del SEO

**Última actualización:** 2026-07-21

## Revisión del rebranding — 2026-10-08

La fotografía de julio que sigue es histórica. La rama `rebranding` incorpora
12 URLs (añade `/aritz` y `/en/aritz`), equipo de cuatro personas, cinco servicios
y nueve proyectos. Auditoría y cierre de ajustes en
[`auditoria-rebranding-2026-10-08.md`](auditoria-rebranding-2026-10-08.md).
No hay una lectura nueva de Search Console en esta sesión; no extrapolar los
datos de indexación/tráfico de julio al lanzamiento.

## Diagnóstico de IA — 2026-10-09 (preview)

La rama local incorpora `/diagnostico-ia` y `/en/ai-diagnosis`, con14 URLs totales.
Canonicals, hreflang ES/EN/x-default y sitemap contrastados contra HTML servido en
loopback después del build. Sin despliegue de producción ni comprobación de indexación.

## El sitio (julio, histórico)

Astro 5 en modo SSR (`output: 'server'`, adaptador Node), detrás de nginx en un VPS
(62.171.173.193), gestionado con pm2. Español por defecto, inglés bajo `/en/`.

**10 URLs en total.** No hay rutas dinámicas.

| Español | Inglés |
|---|---|
| `/` | `/en` |
| `/services` | `/en/services` |
| `/casos` | `/en/case-studies` |
| `/quien-esta-detras` | `/en/who-is-behind` |
| `/politicas` | `/en/politicas` |

Convención de URLs: **sin barra final**, excepto la raíz. Los canonicals y el sitemap
tienen que coincidir con esto (ver `decisiones.md`).

## Indexación

Datos de Google Search Console del 2026-07-21. **No usar el operador `site:` para medir
esto** — subestima mucho: daba 2 páginas cuando GSC reportaba 13.

**Indexadas:** `/`, `/services`, `/quien-esta-detras`, `/en`, `/en/who-is-behind`,
`/en/politicas`

**No indexadas:** `/casos`, `/politicas`, `/en/services`, `/en/case-studies`

GSC reporta 13 indexadas en total, así que unas 4 son variantes con barra final anteriores
al arreglo del 2026-07-21. Se solicitó indexación manual de las 10 URLs ese mismo día.

## Tráfico

**43 clics en ~3 meses** (abril–julio 2026). Muy poco, pero no es cero — la suposición
inicial de "cero tráfico orgánico" era falsa. Pendiente de revisar el informe de Consultas
en GSC para saber por qué búsquedas entra esa gente.

## Herramientas conectadas

| Herramienta | Estado |
|---|---|
| Google Search Console | ✅ Conectada 2026-07-21. Propiedad de **Dominio**, verificada automáticamente vía Google Workspace |
| Google Business Profile | ✅ Activa. Zona de servicio (España), sin dirección visible. Categoría principal: *Consultor de informática* |
| Google Analytics / GA4 | ❌ No configurado |
| API de GSC (acceso programático) | ❌ Sin credenciales OAuth |
| Ahrefs | El usuario tiene suscripción, pero **no hay integración**. Vía práctica: exportar CSV y pasarlo |
| Moz / Bing Webmaster / DataForSEO | ❌ Sin claves |

## Infraestructura

| Elemento | Estado |
|---|---|
| HTTPS | ✅ |
| `www` → apex | ✅ 301 |
| Cabeceras de seguridad | ✅ HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options |
| Compresión | ✅ gzip |
| `cache-control` | ⚠️ `no-store` en todas las páginas. El bloque de caché para `/_astro/` nunca se aplicó |
| `robots.txt` | ✅ Abierto a todo, apunta al sitemap |
| `llms.txt` | ✅ Publicado |

## Subdominios

- `umami.tenbeltz.com` — **eliminado** el 2026-07-21. Tenía ~18.500 URLs de spam de casino
  colgando de `/virtuals/*`. Ninguna llegó a indexarse. Ver `aprendizajes.md`.
- `lexfirma.tenbeltz.com` — apunta a Vercel y da error de certificado. **Sin revisar**, el
  propietario decidió dejarlo por ahora.

## Posicionamiento

TenBeltz (Beltz Dev SL, NIF B21697719), Avenida Elexalde 8, Leioa, Bizkaia.

Equipo externo de ingeniería de IA para empresas de software. Vende a productos SaaS y
consultoras tecnológicas. Cuatro modalidades: AI Gap Analysis, AI Project Foundations,
Agent MVP, Production Delivery.

Clientes reales citables: **Irontec** (desde 2025) y **Qamarero**.

## El techo real

5 páginas, todas comerciales, y autoridad de dominio prácticamente nula (los únicos enlaces
entrantes son perfiles sociales propios). Ninguna optimización técnica cambia eso: sin
contenido que responda a búsquedas informacionales, el número de consultas por las que se
puede competir está acotado. Decisión consciente del propietario aplazar el blog — ver
`decisiones.md`.

## Producción — 2026-10-09

Rebranding y diagnóstico publicados en tenbeltz.com. Verificadas las14URLs públicas:200, canonicals concordantes con sitemap y redirección www301. No se ha consultado Search Console ni demostrado nueva indexación. Detalle operativo en docs/deploy/production-2026-10-09.md.
