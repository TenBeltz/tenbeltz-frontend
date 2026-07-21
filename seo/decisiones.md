# Decisiones tomadas

Decisiones cerradas y su porqué, para no volver a discutirlas cada vez.

---

## URLs sin barra final

**Decisión:** todas las URLs sin barra final, salvo la raíz.

**Por qué:** cuando hubo que elegir una convención para alinear canonicals y sitemap,
`tenbeltz.com/services` (sin barra) ya era la forma que Google tenía indexada. Elegir la
otra habría movido la única página interior que estaba en el índice.

**Consecuencia:** el hook `serialize` de `astro.config.mjs` quita la barra final del
sitemap. Cualquier canonical nuevo debe seguir la misma convención.

**Nota:** ambas formas siguen devolviendo 200 (no se forzó `trailingSlash: 'never'`, que
habría hecho 404 a URLs que ya circulaban). El canonical resuelve la duplicidad.

---

## Google Business Profile como zona de servicio, sin dirección visible

**Decisión:** ficha configurada como zona de servicio (España), sin mostrar la dirección.

**Por qué:** los clientes B2B no visitan la oficina, y la dirección es un domicilio que no
interesa tener público en Maps de forma permanente.

**Contrapartida asumida:** las fichas con dirección visible tienden a posicionar algo mejor
en el pack de mapas. Se aceptó a cambio de la privacidad.

---

## Categoría principal: *Consultor de informática*

**Decisión:** categoría principal *Consultor de informática*, con *Empresa de software*
como secundaria.

**Por qué:** TenBeltz vende servicios, no producto. Quien busca "empresa de software" suele
querer que le construyan una app; quien busca "consultor informático" busca a alguien que
le resuelva un problema técnico. Además activa búsquedas locales tipo "consultoría
informática Bilbao".

**Limitación conocida:** Google no tiene categoría de "consultoría de IA". Ninguna opción
encaja bien. Puede traer consultas de soporte IT genérico; si pasa, revisar.

---

## Sin blog, de momento

**Decisión:** no crear contenido editorial por ahora. Aplazado conscientemente por el
propietario.

**Consecuencia asumida:** es el techo real de todo el trabajo de SEO. Con 5 páginas
comerciales hay un límite duro de cuántas búsquedas se pueden capturar, por bien optimizadas
que estén. Las mejoras técnicas quitan frenos, no añaden acelerador.

**Material ya disponible si se retoma:** `docs/propuestas/blog-horeca-simple/` y el post a
medias sobre coste de evals (`assets/banners/evals-coste-post/`,
`scripts/generate-evals-cost-post-image.mjs`).

---

## No se accede al servidor de producción desde el agente

**Decisión:** los cambios de nginx y los despliegues los ejecuta una persona. El agente
escribe la configuración y los comandos, documentados en `docs/deploy/nginx-seo.md`.

**Por qué:** la credencial de root se compartió por chat y quedó comprometida; además, un
agente editando nginx a ciegas en producción puede tirar el sitio sin ruta de vuelta.

**Pendiente:** rotar la contraseña de root de 62.171.173.193 y pasar a autenticación por
clave SSH con `PermitRootLogin prohibit-password`.

---

## `lexfirma.tenbeltz.com` se deja como está

**Decisión:** no se toca por ahora, a petición del propietario.

**Riesgo conocido:** apunta a Vercel y da error de certificado. Si el proyecto ya no existe
allí, un subdominio apuntando a un Vercel vacío puede ser reclamado por un tercero, que
serviría contenido bajo el dominio. Es el mismo vector que se temía con umami, pero aquí sí
es aprovechable.
