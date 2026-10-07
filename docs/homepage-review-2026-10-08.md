# Revisión de la composición de la home — 2026-10-08

## Alcance

A petición de Aritz, estudiar la sensación de falta de armonía al hacer scroll sin modificar el diseño. En esta iteración sólo se cambia el comportamiento de la franja de clientes y sus enlaces. Revisión de capturas completas y por tramos, tipografía e imágenes cargadas, a 1440×1000 y 390×844. Las observaciones son valoración de diseño; las medidas proceden del DOM servido por el entorno dev.

## Diagnóstico

La paleta papel/carbón/berenjena, la tipografía y las líneas finas proporcionan una base coherente y sobria. Hero → clientes → proyectos tiene un orden comprensible: propuesta, confianza y ejemplos. La sensación de discontinuidad aumenta a partir de servicios.

1. **Demasiadas secciones con la misma importancia.** Los encabezados numerados, títulos grandes y márgenes amplios presentan casi todos los bloques como capítulos principales. Falta una jerarquía entre propuesta/prueba y explicaciones secundarias.
2. **Ritmo lento en servicios, especialmente móvil.** El bento de escritorio se convierte en cinco tarjetas altas apiladas. La sección mide unos 2350 px, casi 2,8 pantallas de 844 px, antes de empezar el método. El contenido de cada tarjeta recibe mucho espacio respecto a la información nueva que aporta.
3. **Cambios fuertes de lenguaje visual.** Fotografías ilustrativas de proyectos, tarjetas con iconos lineales, tarjeta de producción oscura, banda de método totalmente oscura y retrato grande. Cada recurso tiene sentido aislado; la sucesión todavía se percibe como una colección de componentes.
4. **El relato vuelve sobre preguntas ya respondidas.** «Con quién trabajamos» llega después de proyectos, cinco servicios y método, aunque la hero ya define el público. La presentación de Aritz comienza alrededor de y=6140 en móvil, después de más de siete pantallas. La responsabilidad técnica personal podría contribuir antes a la confianza.
5. **Las imágenes pesan más que la evidencia del trabajo.** Las portadas están correctamente identificadas como ilustrativas, pero muestran contexto de uso, no el sistema construido ni sus resultados. Su protagonismo visual deja una impresión más genérica de la que merece el trabajo real.
6. **Cierre largo.** El contacto ocupa aproximadamente 1505 px en móvil por el formulario completo. Tras un recorrido extenso introduce otra tarea de bastante tamaño. Conviene valorar la relación entre contacto inmediato y cualificación cuando se revise la composición.

## Medidas de referencia

| Sección | Escritorio: alto | Móvil: alto |
| --- | ---: | ---: |
| Hero | 657 px | 547 px |
| Clientes | 198 px | 188 px |
| Proyectos | 1189 px | 1312 px |
| Servicios | 1223 px | 2350 px |
| Método | 570 px | 1000 px |
| Público | 460 px | 665 px |
| Aritz | 759 px | 874 px |
| Contacto | 885 px | 1505 px |

Altura total aproximada: 6299 px en escritorio y 8888 px en móvil. La longitud por sí sola no determina calidad; aquí importa cuánto avanza la información entre pantallas y cómo cambia su peso visual.

## Orientación para una futura revisión

Resolver primero la composición de toda la home: jerarquía, densidad y transiciones. Dar protagonismo a propuesta, trabajo real y responsabilidad técnica; resumir servicios y método, integrar mejor el público y reservar profundidad para páginas de detalle. Establecer una pauta compartida de imágenes y alineaciones. Evaluar el recorrido completo en móvil antes de decidir más componentes.

No se han aplicado estas propuestas. Las capturas temporales de estudio están en `/tmp/tenbeltz-redesign-qa/study-*.png`. Revisión realizada por loopback, sin enviar formularios ni modificar producción.

## Aplicación posterior autorizada

Tras recibir el diagnóstico, Aritz pide avanzar («adelante tú mandas»). Se aplica la revisión de composición documentada en `docs/redesign-2026-10-07.md`, apartado Composición global de la home. El diagnóstico y las medidas anteriores se conservan como referencia del estado previo. Nueva home ES: 3742 px en escritorio 1440×1000 y 5062 px en móvil 390×844; servicios móvil 1203 px y presentación personal en y=2032. Revisión visual a cuatro anchos y en los dos idiomas; build y publicación dev completados. Aceptación visual humana pendiente.
