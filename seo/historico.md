# Histórico de cambios de SEO

Orden cronológico inverso (lo más reciente arriba). Cada entrada dice **qué** se cambió,
**por qué** y **cómo se verificó**.

---

## 2026-07-21 — Sesión completa de SEO

Commit: `fd98cd5` — *Fix canonicals per locale and align sitemap to unblock indexing*

### Canonicals por idioma (el arreglo principal)

**Problema:** las plantillas de `src/templates/` las comparten ambos idiomas
(`pages/index.astro` y `pages/en/index.astro` renderizan el mismo componente), pero
`LandingPage.astro`, `ServicesPage.astro` y `PoliciesPage.astro` tenían el canonical
escrito a mano en español. Resultado: `/en`, `/en/services` y `/en/politicas` declaraban
como canónica la versión española, es decir, se declaraban duplicados.

**Verificado en producción antes del arreglo:**
```
https://tenbeltz.com/en            canonical → https://tenbeltz.com/
https://tenbeltz.com/en/politicas  canonical → https://tenbeltz.com/politicas
https://tenbeltz.com/en/services   canonical → https://tenbeltz.com/services
```

**Arreglo:** canonical derivado de `lang` en las tres plantillas. `CasesPage.astro` y
`WhoBehindPage.astro` ya lo hacían bien.

**Verificación posterior:** build local + `node ./dist/server/entry.mjs`, comprobando ruta
por ruta que el canonical renderizado coincide con la URL de la propia página. Las 10
correctas. Confirmado después en producción.

> ⚠️ El impacto fue **menor de lo que se afirmó inicialmente**. Ver `aprendizajes.md`.

### Sitemap alineado con los canonicals

**Problema:** `@astrojs/sitemap` emitía `/services/` con barra final mientras los canonicals
decían `/services` sin ella. Google descarta las URLs del sitemap cuyo canonical apunta a
otro sitio.

**Arreglo:** hook `serialize` en `astro.config.mjs` que quita la barra final (la raíz la
conserva). También limpia las URLs de los `links` de hreflang del sitemap.

**Verificación:** las 10 `<loc>` del sitemap generado coinciden exactamente con los
canonicals renderizados.

### Resto de cambios de esa sesión

| Cambio | Fichero | Motivo |
|---|---|---|
| `<h1>` añadido a `/services` | `ServicesSection.astro` | La página no tenía ninguno; el encabezado más alto era un H2. Se promovió sin tocar estilos |
| Títulos con keyword primero | `LandingPage`, `ServicesPage`, `CasesPage`, `es.ts`, `en.ts` | Todos empezaban por `TenBeltz \|`, gastando los caracteres de más peso en una marca sin volumen de búsqueda |
| `llms.txt` creado | `public/llms.txt` | No existía (404). Lo leen ChatGPT y Perplexity |
| JSON-LD enriquecido | `SEO.astro` | `Organization` pasa a `['Organization','ProfessionalService']` con `description`, `knowsAbout` (8 temas), `areaServed` y `hasOfferCatalog` con los 4 servicios. `knowsAbout` también en el `Person` |
| 404 con `noindex` | `NotFoundPage.astro` | Tenía canonical a `/404` y era indexable |
| Clientes enlazados | `CasesPage.astro` | Irontec y Qamarero eran texto plano. Se añadió `clientUrl` opcional al tipo `CaseStudy`. Ambos dominios verificados antes de enlazar |
| `Providder` → `Provider` | `es.ts:114`, `en.ts:114` | Errata publicada |

### Infraestructura (aplicada por el dev)

- `www.tenbeltz.com` → 301 al apex (antes devolvía 200, duplicando todo el sitio)
- Cabeceras de seguridad: HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options
- **No aplicado:** el bloque de caché para `/_astro/`. Sigue `cache-control: no-store`

Documentado en `docs/deploy/nginx-seo.md`.

### Search Console

- Propiedad de **Dominio** creada y verificada automáticamente (Google Workspace ya tenía
  la propiedad del dominio confirmada)
- Sitemap enviado. Ojo: en propiedades de Dominio hay que meter la **URL completa**,
  `https://tenbeltz.com/sitemap-index.xml`, no la ruta relativa
- Solicitada indexación de las 10 URLs

### Google Business Profile

Perfil que ya existía pero estaba desatendido:

- Categoría principal: *Empresa de software* → **Consultor de informática**, con *Empresa de
  software* como secundaria. La categoría principal es la mayor palanca de posicionamiento
  local
- Horario: estaba en *Abierto 24 h* los 7 días, lo que resta credibilidad. Cambiado a
  horario real
- Descripción: se sustituyó un texto genérico de relleno que además contradecía la web
  (decía "líderes en la industria" cuando la web dice explícitamente que no son una
  consultora generalista)

### Limpieza del subdominio umami

Registro DNS de `umami.tenbeltz.com` eliminado. Ver `aprendizajes.md` para el contexto
completo — no era lo que parecía.

**Verificación:** `dig` devuelve NXDOMAIN. Comprobado también que el registro **SPF sigue
intacto**, porque tocar la zona DNS y cargarse el SPF sin querer rompería el correo.
