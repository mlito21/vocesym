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