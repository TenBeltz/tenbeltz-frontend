# Revisión de perfil, proyectos y LAE — 2026-10-08

## Resultado

Home con cuatro proyectos en orden: Konect, Qamarero, clasificación documental y Biiak. Ilustraciones técnicas coherentes ES/EN, sin fotografías genéricas ni capturas ficticias; generador tools/project-covers/build.py. Konect incorpora la adaptación para RETA a IA local con NVIDIA DGX Spark para500 llamadas diarias, por confirmación del usuario (no benchmark de rendimiento). Portfolio de nueve casos: retirado el demostrador RAG local.

Equipo: Aritz, Ángel, Rubén y Artem. Ángel: AI & Full Stack Developer, sin atribución subordinada al fundador. Página personal /aritz y /en/aritz con dirección técnica, trayectoria original, educación, idiomas, docencia, reconocimiento, principios y tecnologías. Botón de impresión/PDF y estilos de impresión. Eliminado el enlace al antiguo portfolio aritzjaber.com. Datos compartidos en src/data/profile.ts; equipo en src/data/team.ts. SEO ProfilePage sobre Person para Aritz y AboutPage sobre Organization para equipo.

## Investigación LAE

Repositorio privado aritzjl/lae-parser, actualizado por petición del usuario a6f16e34 en copia de lectura /tmp/tenbeltz-lae-review, con permisos700. No se ejecutaron inferencias, APIs, entrenamiento ni se publicaron documentos del corpus. Fuentes principales: docs/informe_completo_sesion_2026-05-15.md, learned_head/bagging_1024d.py, learned_head/bagging_1024d.json y learned_head/all_experiments.json.

Arquitectura final evaluada: GeoMean(GeoMean4_154sims, LogReg_1024d_C0.3). La primera rama combina cuatro regresiones logísticas sobre154 similitudes (77 centroides +77 descripciones); la segunda conserva el embedding completo de1024 dimensiones. Las probabilidades se fusionan por media geométrica. Esto recupera información discriminativa que se pierde al comprimir el embedding en centroides. Clasificación supervisada en CPU sin generación LLM, reutilizando embeddings; extracción/OCR es otro paso y no implica ausencia total de LLM en el pipeline.

Resultado final: Top-1 72,35%, Top-5 91,51%, F1 macro69,15%. Corpus4677:941 prototipos,2322 pool de entrenamiento,1414 test canónico, particiones separadas.15 categorías y77 subcategorías. Baseline CSLS en el mismo test:56,44% Top-1 y83,66% Top-5; mejora+15,91 y+7,85 puntos respectivamente. La cabeza simple154sims alcanza66,48%/89,25%; el ensemble intermedio69,31%/90,81% tampoco es el ganador final.

No confundir158 documentos del antiguo README (usuario redondea a150) con este test ni con3736 documentos de otro informe. El volumen operativo de cientos de miles al mes y la mejora de coste/precisión frente a la primera versión100% LLM están confirmados por el usuario. No hay comparación final emparejada ni porcentaje de ahorro verificable para esa primera versión: la web expresa esa evolución cualitativamente y reserva las cifras para CSLS vs ensemble final. No afirmar throughput medido ni que los resultados de desarrollo prueben rendimiento operativo.

## Verificación y publicación

Build Astro/check sin errores.18 navegaciones browser ES/EN en1440,390 y320px: HTTP200, sin errores JavaScript, imágenes rotas o desbordamientos. Carrusel04/04 y navegación manual comprobados. Equipo con orden solicitado y nueve casos. Sitemap de12 URLs, canonicals coincidentes y JSON-LD válido; sin enlaces al portfolio retirado. Botón de impresión invoca window.print y estilos de impresión revisados.

Preview reconstruida y servicio tenbeltz-landing reiniciado; loopback10022 responde y HTTPS anónimo devuelve401. Formulario de producción bloqueado en QA; no se enviaron contactos. No despliegue en producción ni commit/push. Documentación anterior docs/landing-team-projects-2026-10-08.md describe la primera iteración y queda superada por esta revisión para orden, métricas, número de casos y perfil.
