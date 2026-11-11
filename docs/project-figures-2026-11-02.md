# Figuras interactivas para el catálogo

Fecha: 2026-11-02. Aritz solicita probar la representación isométrica en todo el catálogo y redesplegar únicamente desarrollo para revisarla.

## Implementación

- Los nueve proyectos de `/casos` y `/en/case-studies` tienen una escena SVG propia, tres pasos y dos ejemplos preparados por idioma. Los clics sobre la geometría SVG y los botones nativos de paso comparten el estado; el teclado utiliza los botones bajo la ilustración. El selector cambia de ejemplo y vuelve al primer paso. Cada figura conserva su propio estado.
- El resultado cambia con el paso y el ejemplo: llamada/resumen, petición/mesa/reserva, clasificación documental, consulta con fuentes, borrador pericial, correo/tarea/aprobación, resolución/validación, expediente/fecha/registro e informe con citas.
- Los ejemplos incluyen revisión y excepciones: ausencia de disponibilidad, clasificación ambigua, falta de fuente, discrepancia de fechas, duplicados y campos ausentes. Son simulaciones locales con datos ficticios, rotuladas como tales. No se ejecuta IA, no se reciben archivos ni se conectan sistemas de clientes.
- Los cuatro proyectos del carrusel de home reutilizan versiones estáticas de las figuras. El enlace lleva al caso, conservando el gesto de desplazamiento del carrusel. La flor de hero permanece.
- Se conserva toda la evidencia y el detalle técnico desplegable de cada proyecto, así como sus atribuciones.
- El launcher flotante del diagnóstico se oculta mientras una figura interactiva está visible, para permitir usar los controles. Conserva su comportamiento en el resto de páginas.
- SVG renderizado en servidor, sin bibliotecas adicionales. Movimiento breve al seleccionar un paso, desactivado con movimiento reducido. Sin JavaScript se muestran las ilustraciones, un aviso y el contenido de los casos; los controles sin funcionalidad permanecen ocultos.

## Fuente y adaptación de la skill

Se ha leído y aplicado `iso-figure`, de [MrBongoC/ai-iso-skill](https://github.com/MrBongoC/ai-iso-skill), commit `44b4da7714148eef547cc1b102e433472dfe3531`. El núcleo de proyección y la composición por caras se adaptan en `src/lib/isometric-project.ts`. La licencia MIT original se conserva en `docs/third-party/iso-figure-LICENSE.txt`.

Los ejemplos originales de escritorio/instrumentos no se han copiado. Las escenas, textos y estados se han creado para estos nueve casos. Se adaptan la placa monocroma, los controles y el formato de archivo a componentes Astro compartidos entre ES/EN y a las normas de marca. Los controles accesibles son botones HTML nativos bajo la ilustración, con nombre y estado pulsado; los clics sobre los objetos se resuelven en sus grupos SVG, el SVG tiene una descripción del proceso. No hay instalación global de skills, plugins ni proveedores.

## Mantenimiento

- `src/data/project-figures.ts`: ejemplos ES/EN y pasos de cada caso.
- `src/lib/isometric-project.ts`: proyección geométrica, nueve escenas dibujadas por separado y encuadres individuales del SVG.
- `src/components/ProjectFigure.astro`: presentación, controles y estado independiente.
- `src/templates/CasesPage.astro` y `src/components/ProjectPreview.astro`: catálogo y versiones estáticas del carrusel.
- `tools/qa/project-figures.cjs`: verificación real en navegador. Usa `PLAYWRIGHT_PACKAGE` para un Playwright ya disponible y, opcionalmente, `PLAYWRIGHT_EXECUTABLE` para Chromium. `QA_BASE` y `QA_OUTPUT` permiten elegir origen y carpeta. Intercepta el contacto y bloquea destinos externos.

## Publicación y límites

La entrega utiliza el servicio de desarrollo existente `tenbeltz-landing.service`, loopback `10022`, en https://tenbeltz-landing.dev.tenbeltz.com/casos. Se compila con `npm run build` y se reinicia únicamente este servicio de usuario. No modifica DNS, puertos, autenticación, backend ni producción.

La aceptación estética de Aritz y la interacción en un teléfono físico quedan pendientes. Los archivos ajenos ya modificados en el checkout se preservan; esta iteración no implica commit/push.


## Verificación de la entrega

Build final: Astro check sin errores ni warnings, tres hints heredados; permanece el aviso habitual del chunk grande. Las 28 rutas locales responden 200 con un h1; nueve figuras en cada idioma del catálogo. Servicio de desarrollo active/running y HTTPS anónimo 401 con TLS válido.
Verificación final en Chromium local aislado, sin instalar paquetes del sistema: 432 estados (9proyectos×2ejemplos×3pasos×2idiomas×4anchos),16layouts de catálogo/home a1440/768/390/320, teclado Enter/Espacio, selector/reinicio, independencia entre figuras, límites SVG, carrusel, evidencias desplegables y ausencia de overflow correctos. Launcher oculto durante interacción y movimiento reducido comprobados; movimiento normal revisado. Alternativa sinJS:9SVG por idioma, controles inactivos ocultos y detalle nativo abierto con teclado. Cero erroresJS registrados y cero peticiones de contacto intentadas. Capturas individuales y hoja de contacto revisadas. Informe/capturas locales ignorados en `tmp/project-figures-qa/`; test reproducible `tools/qa/project-figures.cjs`.

La alternativa sin JavaScript se verifica mediante teclado para el detalle técnico; la navegación móvil expandida y el launcher existentes pueden solapar el objetivo del puntero durante el desplazamiento automático del navegador de pruebas. No se ha rediseñado la navegación sin JS en esta iteración. Login positivo Nginx nuevo y teléfono físico no probados.


## Revisión visual V2 — 2026-11-02

Aritz rechaza la repetición de documentos, servidores y pantallas de la primera versión, aunque aprueba la idea interactiva. Se elimina el catálogo de objetos genéricos y su composición fija en tres columnas. Compartir primitivas geométricas y controles no debe convertir casos diferentes en el mismo dibujo.

La V2 utiliza nueve composiciones independientes:

| Caso | Composición |
|---|---|
| Konect / Irontec | Mesa de escucha con auriculares, señal de audio seleccionable y panel de conversación/resumen. |
| Qamarero | Sala con tres mesas de distinta capacidad, sillas, puesto de recepción y comprobante de reserva. Cambia la mesa seleccionada y el comprobante. |
| Clasificación documental | Entrada de documentos, instrumento de clasificación y tres destinos. Un documento ambiguo cambia el recorrido hacia revisión. Es una metáfora visual, no hardware entregado al cliente. |
| Biiak | Expediente abierto dentro de un espacio protegido, consulta y fuentes enlazadas. La respuesta sin fuente muestra la ausencia en el dibujo. |
| Informes periciales | Dos documentos de origen, cronología con fechas contrastables y un informe abierto con referencias. La discrepancia conserva la advertencia. |
| Gestión de despachos | Bandeja de correo y tablero de trabajo con tres columnas. La aprobación mueve la tarea; un duplicado se descarta. |
| Resoluciones | Documento de resolución con campos resaltados, extracción y registro estructurado. La fecha ausente permanece vacía. |
| Seguimiento de expedientes | Reloj, expediente, calendario con anillas y registro plegado. El ejemplo corregido cambia la fecha y el expediente. |
| Informes técnicos | Volúmenes de fuentes, mapa de deduplicación y tres secciones de informe. La tercera fuente/copia aparece sólo en el ejemplo de duplicados. |

Las escenas tienen encuadres individuales, caras opacas en orden de profundidad, trazos homogéneos y acentos contenidos en los elementos activos. Los cambios de paso revelan contenido en la escena; no se limita la interacción a cambiar el texto exterior. Se conservan el movimiento reducido y las ilustraciones estáticas sin JS.

El catálogo muestra cada escena a todo el ancho del artículo, con el ejemplo en una columna lateral en escritorio y debajo en móvil. La explicación del caso y la evidencia técnica siguen disponibles. La home reutiliza las nuevas ilustraciones; hero/flor conservados. Sólo desarrollo, pendiente de nueva aceptación visual humana.


### Verificación V2

Build final correcto (Astro check: cero errores/warnings; tres hints heredados). 432 estados y 16 layouts ES/EN a 1440/768/390/320; clics físicos sobre la geometría de los tres grupos de cada escena en ambos idiomas, teclado, variantes visibles y ocultas, carrusel, evidencia y fallback sin JS correctos. Cero errores JS e intentos de contacto. Después del ajuste final de dos rótulos: 36 encuadres, controles móviles visibles y 28 rutas locales HTTP 200, con un h1. Capturas de página y hoja de las nueve escenas revisadas. Artefactos en `tmp/project-figures-qa/v2/final/`.

Desplegado únicamente en el servicio dev existente; HTTP 200, servicio active, TLS válido y HTTPS anónimo 401. No se ha vuelto a probar login positivo Nginx ni teléfono físico. Pendiente de valoración estética de Aritz. Manual remoto/registro actualizados; Mac pendiente de sincronizar.

## 2026-11-11 — Descartado

Aritz decide no usar las ilustraciones isométricas ("al final no me llegaron a convencer"). Home y `/casos` vuelven al estado publicado (imágenes de proyecto). El código (`ProjectFigure.astro`, `project-figures.ts`, `isometric-project.ts`, `tools/qa/project-figures.cjs`) y el diff de integración se archivaron en `~/.local/share/tenbeltz-frontend-archive/project-figures-2026-11-11.{tar.gz,diff}` antes de retirarlos del árbol de trabajo. Nunca llegó a producción.
