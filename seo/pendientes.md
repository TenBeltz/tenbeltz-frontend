# Backlog de SEO

**Última auditoría:** 2026-07-21 (técnica, contenido/E-E-A-T y GEO/IA en paralelo)

Todo lo de aquí está verificado con `curl` o leyendo el fichero. Prioridad = impacto
partido por esfuerzo, no orden de aparición.

Leyenda de responsable: 🤖 lo puede hacer el agente · 👤 requiere a Aritz · 🔧 requiere
acceso al servidor

Estado: ✅ hecho · ⚠️ hecho a medias o bloqueado por revisión · sin marca = pendiente

> **Rama `legal/politicas-rgpd` — no fusionar todavía.** Contiene la política de privacidad
> reescrita, con **4 marcadores `[PENDIENTE]` que se renderizan visibles** en la página. Si
> llega a `main` y se despliega, salen publicados. Necesita que se resuelvan los cuatro y
> que lo revise un abogado antes de fusionar.

---

## 🔴 Crítico — servidor

### 1. Los assets estáticos se sirven sin comprimir 🔧

Verificado el 2026-07-21 pidiendo con `Accept-Encoding: gzip, br`:

| Fichero | Tamaño | Comprimido |
|---|---|---|
| `/_astro/HomeHeroScene.CfaF9JpV.js` | **578.806 bytes** | ❌ No |
| `/_astro/Footer.B0FIt5U3.css` | **97.818 bytes** | ❌ No |

El HTML **sí** se comprime (130 KB → 29 KB), así que gzip está activo: el problema es solo
`/_astro/*`. Causa probable: `gzip_types` de nginx no incluye `text/javascript`, que es el
Content-Type que emite el adaptador Node de Astro (muchas configs solo listan
`application/javascript`). O el bloque `location /_astro/` queda fuera del ámbito de
`gzip on;`.

**Ahorro estimado:** 450–550 KB por visitante nuevo. JS y CSS comprimen al 65–80%.

**Arreglo:** añadir `text/javascript` y `text/css` a `gzip_types`. Es la mejora de
rendimiento más grande disponible ahora mismo y es una línea de config.

### 2. Cabecera `Cache-Control` duplicada y contradictoria 🔧

Verificado: cada asset de `/_astro/` devuelve **dos** cabeceras:

```
Cache-Control: public, max-age=0
Cache-Control: public, max-age=31536000, immutable
```

Causa: `add_header` en nginx **no reemplaza** la cabecera que ya manda el upstream, la
añade. El servidor estático del adaptador Node manda `max-age=0` y encima se le suma la
nuestra.

Dos `Cache-Control` en una misma respuesta es inválido según RFC 9111 y da comportamiento
indefinido entre navegadores y CDNs, anulando en la práctica el cacheo que se pretendía.

> **Corrección a lo que se dijo el 2026-07-21:** se afirmó que el bloque de caché de
> `/_astro/` "no se había aplicado". Sí se aplicó — el `no-store` que se observó era el de
> las páginas HTML, que es correcto para SSR. El problema real es esta duplicación.

**Arreglo:** añadir `proxy_hide_header Cache-Control;` **antes** del `add_header` en el
bloque `location /_astro/`.

---

## 🟠 Alto — rendimiento

### ~~3~~ ⚠️ 578 KB de JavaScript para un fondo decorativo 🤖 — *parcial, pendiente QA visual*

`src/components/HomeHeroScene.tsx:1-9` hace `import * as THREE from 'three'` más
`SVGLoader`. Resultado: 578.806 bytes, más que todo el resto del sitio junto, para una
rejilla animada detrás del H1.

Lo bueno: hidrata con `client:media="(min-width: 960px)"`, así que **móvil no se ve
afectado**. Solo penaliza escritorio.

**Arreglo:** imports nombrados en vez de comodín para que el tree-shaking pueda tirar
código, comprobar si `SVGLoader` hace falta de verdad, y valorar una librería más ligera
(OGL pesa ~30 KB) para un efecto de puntos. Requiere QA visual.

### ~~4~~ ✅ Dos imágenes de fondo a pantalla completa se descargan siempre, solo se ve una 🤖

`src/components/Contact.astro:84-85`, presente en las 10 URLs porque `Contact` lo usan las
cuatro plantillas.

Las dos `<Picture>` llevan `loading="eager"` y `fetchpriority="high"`. El `display:none` de
Tailwind (`hidden` / `lg:hidden`) **no impide la descarga** de un `<img src>` — solo lo
haría con `background-image` en CSS. Verificado: 2 elementos con `fetchpriority="high"` en
el HTML servido.

- versión PC: 219.620 bytes
- versión móvil: 130.182 bytes

Ambas bajan en todos los dispositivos y en todas las páginas, con prioridad alta,
compitiendo con el LCP real.

**Arreglo:** un solo `<picture>` con `<source media="(min-width:1024px)">`, para que el
navegador resuelva cuál descargar.

### ~~5~~ ✅ El fallback de imagen es PNG y pesa 5,5 veces más 🤖

El fallback de `contact-gradient-background-pc` sale en PNG (1.202.071 bytes) frente a los
219.620 de la variante WebP. Casi todos los navegadores eligen el `<source>` WebP, así que
afecta poco en la práctica, pero se genera en cada build sin motivo.

**Arreglo:** pasar `format="webp"` explícito al componente `<Picture>`.

---

## 🟠 Alto — contenido y confianza

### ~~6~~ ⚠️ Falta el derecho a reclamar ante la AEPD 👤 — *redactado en rama, pendiente de abogado*

`src/i18n/es.ts:54` y `en.ts:54` listan acceso, rectificación, supresión y retirada del
consentimiento. **Faltan** portabilidad, limitación, oposición y —lo relevante— el derecho
a presentar reclamación ante la Agencia Española de Protección de Datos.

Ese último es una mención obligatoria del art. 13.2.d del RGPD, no texto opcional.

> ⚠️ Esto excede el SEO. **Que lo revise quien lleve el tema legal antes de tocarlo** — aquí
> solo se señala la ausencia, no se está dando asesoramiento jurídico.

### ~~7~~ ⚠️ El discurso comercial promete más que la política 👤 — *abordado en rama*

`/casos` anuncia *"IA on-premise en entornos regulados (ENS, EU AI Act)"*
(`CasesPage.astro:156`), pero `/politicas` no menciona transferencias internacionales,
medidas de seguridad, cifrado ni subencargados más allá de un proveedor de analítica.

Un comprador SaaS con criterio de seguridad va a mirar exactamente eso y va a encontrar
menos de lo que promete la venta.

### 8. El premio sigue sin nombre 👤 — *bloqueado desde el 2026-07-21*

`src/i18n/es.ts:114`: `'Provider · 1er premio en la 6ª edición'`. Sin nombre del certamen,
sin organizador, sin año, sin enlace.

Es la afirmación menos creíble del sitio y está justo en la sección de credenciales, al lado
de méritos que sí son verificables. Un motor de respuestas no cita afirmaciones que no puede
resolver, y a un lector le resta más de lo que suma.

**Se necesita:** el nombre completo del premio y quién lo convoca. O se quita.

### 9. Sin testimonios de cliente en todo el sitio 👤🤖

`CasesPage.astro` no tiene campo de cita. Con dos clientes reales y enlazables (Irontec
desde 2025, Qamarero), una cita atribuida de una o dos frases es la mayor ganancia de
confianza disponible sin escribir páginas nuevas.

**Arreglo:** añadir `quote?: { text, author, role }` al tipo `CaseStudy` y renderizarlo. El
código lo hace el agente; **conseguir las citas es tarea de Aritz**.

### ~~10~~ ✅ Dos de los cuatro casos son anónimos y no se explica por qué 🤖

"Sector legal" y "Gestión documental" no llevan cliente ni enlace, mientras Irontec y
Qamarero sí. Nada indica si es confidencialidad o invención.

**Hecho:** añadido `· cliente bajo NDA` / `· client under NDA` al campo `sector` (no al
`tag`, que se renderiza en una píldora de ancho fijo y se desbordaba).

### 11. La página de "quién está detrás" no tiene ni una fecha 🤖👤

`src/i18n/es.ts:66-122`: no dice cuándo se fundó TenBeltz, ni desde cuándo Aritz es CTO en
Biiak, ni cuántos años lleva. La experiencia verificable y fechada es justo lo que distingue
una biografía real de texto genérico.

**Arreglo:** año de fundación y años de inicio en los cargos. **Los datos los tiene que dar
Aritz.**

### 12. La relación con Irontec es ambigua 👤 — *bloqueado, esperando a Aritz*

`es.ts:79` presenta a Aritz como *"AI Researcher @ Irontec"* (rol personal) y
`CasesPage.astro:119` dice que *"TenBeltz opera como partner de ingeniería de IA de Irontec
desde 2025"* (contrato de empresa). Son dos relaciones distintas sin nada que las conecte.

Quien cruce ambas páginas puede leer el caso de éxito como un arreglo interno en vez de un
cliente ganado, lo que le resta valor como prueba social.

> **Intentado y revertido el 2026-07-21.** Se redactó una cláusula diciendo que es "un
> contrato entre empresas, distinto del rol personal". **Ese dato no estaba verificado** —
> lo introdujo el coordinador al enunciar la tarea, no salía de ninguna fuente del repo. Se
> restauró el texto original antes de commitear.

**Se necesita de Aritz:** cuál es el acuerdo real. Si el encargo llegó a través del rol
personal, la redacción anterior habría exagerado la separación y es justo el tipo de
afirmación que un comprador puede pedir que se sustente.

---

## 🟡 Medio — IA y datos estructurados

### ~~13~~ ✅ Las respuestas del FAQ son demasiado cortas para que las citen 🤖

`src/components/FaqSection.astro`: entre 11 y 20 palabras cada una. Para que un motor de
respuestas cite un pasaje necesita que se sostenga solo, en torno a 40–60 palabras (algunas
fuentes sitúan el óptimo bastante más arriba).

Hay borradores redactados a partir de datos que **ya están en la web** (casos, servicios,
principios), sin inventar nada.

### ~~14~~ ✅ Errata en una pregunta del FAQ que la vuelve incitable 🤖

La pregunta del `FaqSection.astro` menciona *"un Gap Analysis o un sprint"*, pero "sprint"
no aparece en ninguna otra parte del código ni es uno de los cuatro servicios. Un motor de
respuestas no puede resolver a qué se refiere.

**Arreglo:** cambiar "sprint" por "Agent MVP", que sí existe.

### ~~15~~ ✅ Falta hreflang en 4 URLs del sitemap 🤖

Verificado: `/casos`, `/en/case-studies`, `/quien-esta-detras` y `/en/who-is-behind` salen
con **0 anotaciones** `xhtml:link`, mientras las otras 6 llevan 2 cada una.

Causa: el emparejado automático de `@astrojs/sitemap` solo enlaza URLs con la misma ruta
tras quitar `/en/`, y no ve el mapa de slugs traducidos de `SEO.astro:38-43`
(`casos`↔`case-studies`, `quien-esta-detras`↔`who-is-behind`).

Los hreflang **en la página sí son correctos** en las 10 URLs, así que Google puede
resolverlo igualmente. Pero ahora que Search Console está conectado, esto va a aparecer como
aviso de "sin etiquetas de retorno".

**Arreglo:** construir los `links` a mano en el hook `serialize` de `astro.config.mjs`
usando el mismo mapa de slugs.

### ~~16~~ ✅ Schema que merece la pena añadir 🤖

- `url` en cada `Service` del `hasOfferCatalog` — las anclas ya existen
  (`ServicesSection.astro:39`), 5 minutos, mejor relación valor/esfuerzo del lote
- `FAQPage` en `/services` a partir de los campos `fit` que ya existen — sin escribir texto
- `ProfilePage` en `/quien-esta-detras`, reutilizando el nodo `Person`
- `CollectionPage` + `ItemList` en `/casos`, para que las cifras (−42%, 95,5%) sean legibles
  por máquina y no solo prosa
- `BreadcrumbList` en todas menos la raíz
- `'LocalBusiness'` añadido al array de `@type`
- **`sameAs` apuntando a la ficha de Google Business Profile** 👤 — hace falta la URL de la
  ficha, que solo tiene Aritz. Es la reconciliación de entidad que falta entre el JSON-LD y
  la ficha nueva

**No añadir:** `Review`/`AggregateRating` sin reseñas reales (viola las directrices de
Google y es señal de spam), ni `Article`/`BlogPosting` sin blog.

### ~~17~~ ✅ Mejoras en `llms.txt` 🤖

- Añadir dirección completa y teléfono, que sí están en el JSON-LD, para que la entidad
  cuadre entre schema, llms.txt y la ficha de Google
- Añadir las credenciales del fundador (Cofundador TenBeltz / CTO @ Biiak / AI Researcher @
  Irontec), que están en `es.ts:77-79`
- Añadir una sección en inglés: el sitio es bilingüe y el fichero solo está en español

---

## 🟡 Medio — enlazado y conversión

### ~~18~~ ✅ Las páginas interiores son callejones sin salida 🤖

Mapeados todos los enlaces de contenido (excluyendo cabecera y pie): la home enlaza a las
tres interiores, pero **`/services`, `/casos` y `/quien-esta-detras` no se enlazan entre
sí**. Solo se conectan por el menú, que pesa mucho menos porque es idéntico en todas las
páginas y no aporta señal temática.

**Arreglo:** enlaces contextuales entre las tres, reutilizando el bloque de presentación del
fundador que ya existe en la home.

### ~~19~~ ✅ `/politicas` no está en el pie ni en el menú 🤖

Solo se llega desde el banner de cookies, que un visitante recurrente no vuelve a ver.
Para una empresa que vende a compradores preocupados por la seguridad, tener la página
legal prácticamente inaccesible es en sí una señal.

**Arreglo:** añadirla al array `sections` de `Footer.astro`.

### ~~20~~ ✅ `/services` tiene una sola llamada a la acción, al final del todo 🤖

Cuatro servicios y un único botón, en `ServicesSection.astro:88`. Quien lee el primero y
decide que le encaja tiene que pasar los otros tres para encontrar cómo actuar.

**Arreglo:** una CTA por tarjeta, reutilizando el estilo que ya existe.

### 21. `/services` es la página más floja en profundidad 🤖

570 palabras para cuatro servicios. Ninguno indica duración típica, formato del entregable
(solo Gap Analysis lo dice) ni qué caso de éxito lo demuestra.

**Arreglo:** campos `duration` y `proof` en el tipo `Service`, enlazando al caso
correspondiente. Arregla profundidad y enlazado interno a la vez. **Las duraciones las tiene
que dar Aritz.**

---

## 🔵 Bajo

### ~~22~~ ✅ Falta `initial-scale=1` en el viewport 🤖
`SEO.astro:149`. Los navegadores modernos lo infieren, pero es una línea.

### 23. Sin HTTP/2 ni HTTP/3 🔧
Verificado: se negocia HTTP/1.1. Con 6+ chunks de `/_astro/`, dos orígenes de Google Fonts e
imágenes compitiendo por el límite de ~6 conexiones por origen, los recursos hacen cola en
vez de multiplexarse. `listen 443 ssl http2;` en nginx 1.24, sin módulos extra.

### ~~24~~ ✅ Google Fonts bloquea el renderizado 🤖
`Layout.astro:23-26`. Son 9.964 bytes con **24 reglas `@font-face`** (4 pesos × 6 subconjuntos:
cirílico, griego, vietnamita...) cuando el sitio solo usa español e inglés. Ya hay
`preconnect`, que ayuda.
**Arreglo:** alojar los 4 woff2 en local, solo latino.

### ~~25~~ ✅ `/services` y `/services/` devuelven 200 ambas 🤖
Duplicación evitable. El canonical ya lo resuelve, así que no está causando daño.
**Arreglo:** `trailingSlash: 'never'` en `astro.config.mjs`, comprobando que no choca con el
hook `serialize`.

### ~~26~~ ✅ Sin IndexNow 🤖
No hay clave ni script. Con 10 URLs es barato y avisa a Bing y Yandex al instante.

### 27. Sin CSP ni `Permissions-Policy` 🔧
El resto de cabeceras de seguridad ya están. Empezar por `Permissions-Policy`, que es
trivial, y un CSP en modo `report-only` antes de aplicarlo.

### ~~28~~ ✅ `Footer.css` pesa 97.818 bytes 🤖 — *investigado: no hay nada que arreglar*
Mucho para un chunk de pie de página. Merece un pase con el visualizador de bundle para ver
si Tailwind está metiendo utilidades globales ahí. Menos urgente una vez esté la compresión.

---

## Sin fecha — decisiones de negocio

- **Contenido / blog** 👤 — el techo real. Aplazado conscientemente, ver `decisiones.md`
- **Reseñas en Google Business Profile** 👤 — la mayor palanca de posicionamiento local.
  Objetivo realista: 5. Pedirlas de forma sostenida, no todas de golpe
- **Primeros backlinks** 👤 — pedir enlace a Irontec (se les enlaza y no devuelven), página
  de empresa de LinkedIn, directorios sectoriales vascos
- **Revisar Consultas en Search Console** 👤 — hay 43 clics reales sin analizar. Es el único
  dato propio de demanda que existe
- **Rotar la contraseña de root** 👤 — se compartió por chat, ver `decisiones.md`
- **`lexfirma.tenbeltz.com`** 👤 — riesgo de secuestro de subdominio, aparcado a petición
