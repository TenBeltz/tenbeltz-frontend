# Nueva orientación comercial de TenBeltz

Fecha: 2026-11-02. Propuesta inicial desarrollada después por petición expresa de Aritz.

**Continuación:** web ES/EN implementada; [estado real, verificaciones y despliegue](verificacion.md). Los apartados siguientes conservan el razonamiento de la propuesta inicial; las indicaciones de implementación pendiente describen aquella fase, no el estado técnico vigente.

TenBeltz se dirige a empresas de distintos sectores que quieren incorporar IA a su trabajo. La web se organizará alrededor de los procesos que pueden mejorar y del acompañamiento para poner las soluciones en uso. La captación específica de empresas de software deja de ser prioritaria.

La decisión de audiencia procede de Aritz. La oferta, la arquitectura y los textos que siguen son la propuesta para llevarla a la web.

## Propuesta para revisar

1. [Posicionamiento y oferta](posicionamiento.md): a quién hablamos, qué vendemos, qué recibe el cliente y qué experiencia lo respalda.
2. [Mapa de páginas y recorrido comercial](arquitectura.md): navegación, destino de las páginas actuales y nueva orientación de la autoevaluación.
3. [Texto completo de la home](home-es.md): contenido en español, llamadas a la acción, preguntas frecuentes y formulario.

El mensaje principal propuesto es **«Implementamos IA en el trabajo diario de tu empresa»**. La acción principal es **«Hablemos de tu empresa»**. Sirve tanto a quien conoce el proceso que quiere mejorar como a quien necesita ayuda para encontrarlo.

## Criterios de la propuesta

- Una entrada comercial común, con soluciones por tarea y ejemplos de diferentes sectores.
- Diagnóstico, implementación y adopción como oferta; formación también contratable por separado.
- Experiencia técnica explicada a través del problema, la solución y la forma de comprobar el resultado.
- Identidad TenBeltz conservada: flor original, IBM Plex, fondo papel y acento berenjena.
- Casos con atribución precisa. Las hipótesis comerciales y los ejemplos de tareas se distinguen de los trabajos realizados.

## Alcance de esta entrega

Preparación comercial y editorial. Actualizados el contexto compartido de marketing, las instrucciones locales y el resumen de negocio. Los documentos de octubre sobre dos audiencias quedan como historial; la fuente vigente es [el contexto comercial](../../.agents/product-marketing.md).

La web, la preview y producción conservan su implementación actual. El mapa incluye rutas propuestas que aún no existen. El texto inglés y el diseño de las páginas se prepararán en la fase de implementación; no se han modificado formularios ni enviado consultas.

## Secuencia de implementación

1. Aplicar la home, navegación, contacto y pie en ES/EN sobre los componentes existentes.
2. Reorientar `/ia-para-empresas` y `/services`; adaptar casos y las páginas existentes de voz e IA privada.
3. Crear las páginas de soluciones con la profundidad descrita en el mapa. Mientras se construyen, la home puede usar anclas y los casos existentes, sin enlaces a rutas pendientes.
4. Sustituir el acceso general al diagnóstico técnico por una orientación de procesos. Mantener diferenciadas la autoevaluación y la consultoría contratada.
5. Comprobar build, idiomas, rutas, metadatos, enlaces, accesibilidad, móvil y contacto interceptado en preview privada. Publicación después de la revisión final del usuario.

## Cómo comprobar la dirección comercial

En las siguientes conversaciones, registrar sector, rol, trabajo que quieren mejorar, frecuencia, herramientas, responsable, rango de inversión que declara el cliente y siguiente paso. Las frases de los clientes servirán para ajustar los textos.

Comparar consultas cualificadas, conversaciones celebradas, propuestas solicitadas y proyectos contratados. Una consulta cualificada tiene una necesidad identificable y un interlocutor capaz de avanzar; el diagnóstico puede ayudar a concretar el proceso. Separar implementación y formación en el seguimiento. No fijar porcentajes de conversión ni atribuir resultados al rediseño sin una referencia comparable.

## Comprobación de la entrega

Revisión documental contra los proyectos y las rutas del repositorio: enlaces relativos, anclas existentes de los casos, alcance de las cifras y atribuciones. No corresponde una prueba de aplicación a esta entrega, que no cambia código ejecutable. No hay nuevas mediciones de tráfico, entrevistas ni validación de demanda.
