# Histórico de cambios de SEO

Orden cronológico inverso (lo más reciente arriba). Cada entrada dice **qué** se cambió,
**por qué** y **cómo se verificó**.

---

## 2026-07-21 (tarde) — Bloque técnico del backlog

Ejecutado con 8 subagentes en dos oleadas, repartidos **por fichero** para que no se pisaran.
Ninguno compiló: el build se hizo centralizado después de cada oleada, porque varios
`npm run build` simultáneos compiten por `dist/`.

### Aplicado

| Tarea | Fichero | Verificación |
|---|---|---|
| hreflang en las 4 URLs que faltaban | `astro.config.mjs` | Sitemap generado: las 10 URLs con 3 alternates (`es`, `en`, `x-default`) |
| `trailingSlash: 'never'` | `astro.config.mjs` | `/services` → 200, `/services/` → 301. Las 10 rutas comprobadas |
| Filtro de páginas de estado en el sitemap | `astro.config.mjs` | 10 URLs, sin `/en/404` |
| Una sola imagen de fondo por dispositivo | `Contact.astro` | Solo se descarga la variante que corresponde; el PNG de 1,2 MB eliminado |
| FAQ ampliado y errata "sprint" corregida | `FaqSection.astro` | Respuestas de 11-20 → 54-73 palabras. `sprint` con 0 apariciones |
| Fuentes autoalojadas | `Layout.astro`, `global.css`, `public/fonts/` | Sin referencias a Google. 2 woff2 válidos (66 KB) |
| `llms.txt` con NAP, credenciales y sección en inglés | `public/llms.txt` | — |
| IndexNow | `public/<clave>.txt`, `scripts/indexnow.mjs` | Dry-run leyendo el sitemap real |
| Schema: `Service.url`, `LocalBusiness`, `BreadcrumbList`, `ProfilePage`, viewport | `SEO.astro` | JSON-LD parseado y validado en 5 tipos de página |
| Casos: NDA declarado, cifra integrada en la prosa, `CollectionPage`+`ItemList` | `CasesPage.astro` | JSON-LD válido |
| Enlazado interno, `/politicas` en el pie, CTA por servicio | `ServicesSection`, `Footer`, `WhoBehindPage` | 4 CTAs, enlaces presentes en el HTML servido |

### Revertido antes de commitear

**Afirmación sobre la relación con Irontec.** Se encargó aclarar la ambigüedad entre el rol
personal de Aritz y el contrato de TenBeltz, y el enunciado de la tarea daba por hecho que
son "un contrato entre empresas, distinto del rol personal". **Eso no está verificado**: lo
introdujo el coordinador al redactar la tarea, no salió de ninguna fuente del repo. El
agente lo detectó y lo devolvió.

Se restauró el texto original. Queda en `pendientes.md` a la espera de que Aritz confirme
cuál es el acuerdo real.

### Un error de verificación del coordinador, y cómo se detectó

Se concluyó que `trailingSlash: 'never'` rompía el sitio: todas las rutas menos la home
devolvían 404. Se revirtió por eso.

**Era falso.** El puerto 4321 lo ocupaba el servidor de otro proyecto sin relación
(ReformasMartiartu), así que las comprobaciones interrogaban al servidor equivocado.
Repetida en un puerto libre, la configuración funciona exactamente como el agente había
trazado leyendo el código de Astro. Se restauró.

Ver `aprendizajes.md` — la lección es que verificar tampoco es infalible si no se comprueba
que se está midiendo lo que se cree.

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
