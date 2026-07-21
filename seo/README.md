# SEO — documentación y trazabilidad

Histórico de todo el trabajo de SEO sobre tenbeltz.com. La idea es que cualquiera (o
cualquier agente) pueda reconstruir qué se cambió, por qué, y qué quedó pendiente, sin
tener que releer conversaciones ni el historial de git.

## Índice

| Documento | Contenido |
|---|---|
| [`estado-actual.md`](estado-actual.md) | Foto del sitio ahora: URLs, indexación, herramientas conectadas |
| [`historico.md`](historico.md) | Registro cronológico de cambios, con fecha y verificación |
| [`pendientes.md`](pendientes.md) | Backlog priorizado de tareas abiertas |
| [`decisiones.md`](decisiones.md) | Decisiones tomadas y su porqué, para no volver a discutirlas |
| [`aprendizajes.md`](aprendizajes.md) | Errores de diagnóstico y hallazgos no obvios |
| [`../docs/deploy/nginx-seo.md`](../docs/deploy/nginx-seo.md) | Configuración de servidor pendiente y aplicada |

## Cómo mantener esto

Cuando se toque algo de SEO:

1. Añade una entrada en `historico.md` con la fecha, qué se cambió y **cómo se verificó**.
   Una entrada sin verificación no sirve: el valor está en poder distinguir "lo cambié" de
   "comprobé que funciona en producción".
2. Actualiza `estado-actual.md` si cambia la foto general.
3. Mueve o cierra lo que corresponda en `pendientes.md`.
4. Si se descartó una alternativa por una razón concreta, apúntala en `decisiones.md`.

## Principio de trabajo

Verificar antes de afirmar. Buena parte del trabajo de esta web ha consistido en corregir
diagnósticos previos que sonaban plausibles y eran falsos — ver `aprendizajes.md`. Cuando
un informe diga que algo está roto, compruébalo con `curl` o leyendo el fichero antes de
actuar.
