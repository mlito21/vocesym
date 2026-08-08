# Calidad de datos · Voces y Melodías Lojanas

Este documento traduce el estado real de la Base Maestra en decisiones de producción. No sustituye la revisión académica de las fuentes.

## Regla

Un recurso educativo puede estar técnicamente desarrollado y, sin embargo, su perfil documental no estar listo para publicación. **Desarrollo web ≠ validación científica/editorial**.

## Primer lote de revisión

| ID | Creadora | Estado actual | Fortalezas | Vacíos para producción | Prioridad |
|---|---|---|---|---|---|
| CR-047 | Blanca Cano Palacio | En revisión · No publicable | Lugar y fechas documentadas; biografía desarrollada; fuentes UNL, bibliográfica e institucional; varias obras documentadas; laboratorio sonoro | Revisión académica final; derechos/autorización de fotografía; revisión final de obras y fuentes; aprobación editorial | Alta |
| CR-001 | Matilde Hidalgo Navarro | Preliminar · No publicable | Año de nacimiento; fuente bibliográfica principal; laboratorio de poesía | Lugar pendiente; biografía validada ausente; fotografía pendiente de autorización; obras y atribuciones requieren revisión; aprobación editorial | Media-alta |
| CR-058 | Emily Katherine Ordóñez Celi | Preliminar · No publicable | Fuente vinculada con trabajo sobre arreglos de Blanca Cano; archivo personal para fotografía; laboratorio del arreglo | Lugar pendiente; biografía validada ausente; derechos de fotografía; revisión documental de arreglos y rol; aprobación editorial | Media-alta |

## Candidata más próxima a producción

**CR-047 · Blanca Cano Palacio** es actualmente el perfil piloto más avanzado documentalmente. La Base Maestra ya contiene:

- año y lugar de nacimiento;
- año de fallecimiento;
- biografía extensa en estado "En revisión";
- referencias bibliográficas, trabajo de titulación UNL y fuente institucional municipal;
- conjunto de obras identificadas;
- recurso educativo avanzado.

Sin embargo, `PUBLICABLE_WEB` continúa en **No**, por lo que no debe pasar a la vista WEB hasta completar los controles pendientes.

## Checklist de producción · CR-047 Blanca Cano Palacio

### Ficha de creadora

- [x] Identificador estable: `CR-047`.
- [x] Nombre completo normalizado: Blanca Cano Palacio.
- [x] Año de nacimiento: 1929.
- [x] Lugar de nacimiento: Loja, Ecuador.
- [x] Año de fallecimiento: 1982.
- [x] Biografía desarrollada.
- [x] Fuentes principales identificadas y trazables.
- [ ] Revisión académica final de la biografía.
- [ ] Fuente fotográfica definitiva seleccionada.
- [ ] Derechos/autorización de fotografía resueltos.
- [ ] Estado de verificación = Verificado.
- [ ] `PUBLICABLE_WEB = Sí`.

### Obras actualmente registradas

| ID | Obra | Estado documental | Pendiente principal |
|---|---|---|---|
| OB-0072 | Loja en septiembre de flores | En revisión | Confirmar alcance exacto de la autoría textual de Antonio J. Castro y resolver derechos de obra |
| OB-0073 | Cecilia | En revisión | Completar año de obra si existe evidencia suficiente y resolver derechos |
| OB-0096 | Ensueño | En revisión | Completar fecha cuando exista fuente y resolver derechos |
| OB-0097 | Primaveral | En revisión | Resolver la posible correspondencia con “Primavera” y derechos |
| OB-0098 | La voz del maizal | En revisión | Precisar rol de Antonio J. Castro y resolver derechos |
| OB-0099 | Sobre el pajonal | En revisión | Precisar rol de Antonio J. Castro y resolver derechos |
| OB-0100 | Estrella | En revisión | Completar fecha cuando exista fuente y resolver derechos |

Ninguna de estas obras debe pasar todavía a WEB: `DERECHOS_OBRA` permanece en **Pendiente de revisión** y `PUBLICABLE_WEB` en **No**.

### Recurso educativo RE-047

El Laboratorio sonoro presenta un nivel de desarrollo alto:

- secuencia: Contextualizar → escuchar/examinar → identificar → comparar → interpretar/crear;
- áreas: Educación Musical, Patrimonio cultural y Lengua y Literatura;
- nivel: Bachillerato y educación superior, adaptable a EGB Superior;
- objetivo de aprendizaje definido;
- actividad interactiva de cinco estaciones;
- evidencia prevista;
- rúbrica analítica definida conceptualmente;
- criterios de accesibilidad previstos;
- implementación HTML5 + Bootstrap + JavaScript.

Pendientes para considerarlo un REA publicable:

- [ ] Incorporar únicamente audios/partituras con derechos o autorización resueltos.
- [ ] Implementar transcripciones/subtítulos cuando se incorpore audio/video.
- [ ] Incorporar alternativa textual para partituras o elementos musicales visuales.
- [ ] Convertir la rúbrica conceptual en instrumento visible y aplicable dentro del recurso.
- [ ] Verificar navegación completa por teclado.
- [ ] Revisar contraste y foco visible en todos los estados interactivos.
- [ ] Realizar revisión pedagógica final.
- [ ] Cambiar estado de `En desarrollo` a un estado editorial aprobado solo después de la revisión.

### Decisión actual

**CR-047 no debe publicarse todavía en las vistas WEB.** Sí puede mantenerse como perfil piloto completo en PREVIEW. El siguiente hito es resolver autorías/roles de las obras y derechos de uso antes de activar la publicación.

## Campos críticos del corpus

La revisión general de `01_Creadoras` muestra un patrón claro:

- la mayoría de los lugares de nacimiento continúan como "Pendiente de verificación";
- muchas biografías validadas todavía están vacías;
- los derechos de fotografía aparecen mayoritariamente como "Pendiente de autorización";
- los estados de verificación son principalmente "Preliminar";
- la publicación web permanece desactivada.

Estos campos deben priorizarse antes de intentar ampliar el sitio público.

## Orden recomendado de validación por creadora

1. `NOMBRE_COMPLETO`
2. `AÑO_NACIMIENTO`
3. `LUGAR_NACIMIENTO`
4. `AÑO_FALLECIMIENTO`, cuando corresponda
5. `BIOGRAFÍA_VALIDADA`
6. `FUENTE_PRINCIPAL`
7. Obras y roles en `02_Obras`
8. `FUENTE_FOTOGRAFÍA`
9. `DERECHOS_FOTOGRAFÍA`
10. `ESTADO_VERIFICACIÓN`
11. revisión del recurso en `05_Recursos_educativos`
12. `PUBLICABLE_WEB`

## Estados recomendados

### Preliminar

Registro identificado, pero todavía requiere verificación documental.

### En revisión

Existe evidencia suficiente para una revisión académica/editorial específica.

### Verificado

La información que se pretende publicar ha sido contrastada y aprobada.

### Publicable

Además de estar verificado, se han resuelto derechos, accesibilidad y aprobación editorial. Solo entonces `PUBLICABLE_WEB` debe establecerse en `Sí`.

## Criterio para datos desconocidos

No sustituir un campo desconocido por una inferencia. Usar un estado explícito de pendiente y convertirlo en una tarea de investigación. El mapa, la cronología y las fichas deben reflejar el nivel real de evidencia disponible.