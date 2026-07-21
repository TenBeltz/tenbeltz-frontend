# Aprendizajes

Hallazgos no obvios y errores de diagnóstico. Está aquí para que no se repitan, y porque
varios de estos diagnósticos sonaban plausibles y eran falsos.

---

## Las plantillas compartidas entre idiomas rompen los canonicals en silencio

`src/pages/x.astro` y `src/pages/en/x.astro` renderizan el mismo componente de
`src/templates/`. Cualquier canonical escrito a mano en español hace que la página inglesa
se declare duplicada de la española.

Es invisible mirando el sitio en español, que se ve perfecto. Solo aparece comparando el
canonical renderizado con la URL de la propia página.

**Regla:** al añadir cualquier página o plantilla, derivar el canonical de `lang`:
`https://tenbeltz.com${lang === 'en' ? '/en' : ''}/slug`. Nunca escribirlo fijo.

## El canonical es una sugerencia, no una orden

Se afirmó que el bug de canonicals era la razón de que **ninguna** página inglesa estuviera
indexada. **Falso.** Search Console mostró `/en`, `/en/who-is-behind` y `/en/politicas`
indexadas *a pesar* del canonical roto.

Google trata `rel=canonical` como una pista y la ignora cuando el contenido es claramente
distinto — y dos idiomas lo son.

**Regla:** un canonical mal puesto es un problema real, pero no deduzcas de ahí que la
página está desindexada. Compruébalo en la inspección de URLs de GSC antes de afirmar la
consecuencia.

## El operador `site:` subestima mucho

`site:tenbeltz.com` devolvía 2 páginas. Search Console reportaba 13 indexadas.

**Regla:** para medir indexación, GSC. `site:` sirve como indicio rápido, nunca como dato.

## Los subdominios salen a la luz con propiedades de Dominio

Al crear la propiedad como **Dominio** (no como "Prefijo de URL") aparecieron 19.613
páginas no indexadas, de las cuales 18.495 eran 404.

Eran spam de casinos y póker colgando de `umami.tenbeltz.com/virtuals/*` — una vieja
instancia de Umami del propietario, ya retirada.

**Lo que parecía:** subdominio comprometido sirviendo spam bajo la marca.

**Lo que era:** ninguna de esas URLs llegó a indexarse (`site:umami.tenbeltz.com` → cero
resultados), todas devolvían 404, y el contador bajaba solo (19.276 en mayo → 18.495 en
julio). Encaja mucho mejor con enlaces spam creados desde fuera apuntando a un subdominio
que nunca sirvió ese contenido, que con un compromiso real.

**Y no afectaba al SEO de `tenbeltz.com`:** Google trata los subdominios como sitios
distintos, nada estaba indexado, y el argumento del presupuesto de rastreo no aplica a un
sitio de 10 URLs — Google solo lo raciona en sitios de decenas de miles.

Se eliminó el registro DNS por higiene de seguridad, no por SEO.

**Regla:** antes de calificar algo de compromiso, comprueba si llegó a indexarse. Y no
importes el argumento de "presupuesto de rastreo" a sitios pequeños; ahí no aplica.

## Las suposiciones sobre el propio tráfico suelen estar mal

La sesión arrancó con "no tengo nada de tráfico orgánico". GSC mostró **43 clics** en tres
meses. Poco, pero no cero — y significa que ya hay consultas trayendo gente que nadie había
mirado.

**Regla:** el informe de Consultas de GSC vale más que cualquier hipótesis sobre qué
keywords atacar. Son datos reales de demanda propia.

## Las herramientas de resumen web alucinan contenido

Una lectura automática del sitemap devolvió URLs que no existían (`/clientes/`), lo que
llevó a concluir erróneamente que el sitemap estaba obsoleto. `curl` mostró que era
correcto.

**Regla:** para datos estructurados y verificables (sitemaps, cabeceras, JSON-LD), usar
`curl` y parsear, no un resumen en lenguaje natural.

## La memoria del proyecto se queda obsoleta

Al empezar, la memoria decía que no había JSON-LD (lo había, desde `SEO.astro:55`) y
describía el lead magnet como si siguiera vivo (estaba descartado y las rutas eliminadas).

**Regla:** verificar contra el repo antes de actuar sobre lo que diga la memoria.
