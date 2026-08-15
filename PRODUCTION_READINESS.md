# Voces y Melodías Lojanas · Preparación para producción

## Estado actual

El repositorio dispone de una arquitectura funcional:

Google Sheets (Base Maestra) → vistas PREVIEW/WEB → Apps Script/API → portal HTML/CSS/JS → GitHub Pages.

Estado público verificado al 15 de agosto de 2026:

- 61 creadoras en el directorio preliminar; 2 tienen ficha pública completa.
- 4 obras, 1 recurso multimedia y 1 lugar publicados.
- 1 laboratorio educativo público (`RE-001`) y 1 pregunta verificada (`PG-003`).
- 0 relaciones y 0 mediaciones patrimoniales publicadas.

El portal ofrece un **catálogo público preliminar** de identificación y consume únicamente vistas WEB. El material académico en revisión permanece en un entorno PREVIEW separado; no puede habilitarse desde la URL pública.

## Dos entornos lógicos

### PREVIEW

Uso: equipo de investigación, demostraciones académicas, revisión y desarrollo.

Fuente de datos:

- 12_PREVIEW_Creadoras
- 13_PREVIEW_Obras
- 14_PREVIEW_Recursos
- 16_PREVIEW_Relaciones
- 19_PREVIEW_Lugares

Configuración web:

```js
API_MODE: "preview" // solo en el entorno interno separado
```

Puede mostrar información preliminar, siempre identificada como tal.

### PRODUCCIÓN / WEB

Uso: publicación pública definitiva.

Fuente de datos:

- 07_WEB_Creadoras
- 08_WEB_Obras
- 09_WEB_Multimedia
- 10_WEB_Recursos
- 17_WEB_Relaciones
- 20_WEB_Lugares
- 23_WEB_Mediacion
- 26_WEB_Preguntas

Configuración del portal:

```js
API_MODE: "public"
```

La vista `07_WEB_Creadoras` puede exponer únicamente identificador, nombre, categoría y disciplina como índice preliminar. Las vistas WEB de biografías, obras, fuentes, multimedia y recursos solo deben recibir contenido que cumpla los controles editoriales.

## Criterios mínimos para promover una creadora a producción

1. Identidad y nombre normalizados.
2. Biografía revisada y sustentada.
3. Fuente principal trazable.
4. Obras normalizadas y roles confirmados.
5. Estado de verificación = Verificado.
6. PUBLICABLE_WEB = Sí.
7. Derechos de fotografía resueltos si se publica imagen.
8. Derechos/licencias de textos, partituras, audio o video resueltos cuando corresponda.
9. Recurso educativo revisado pedagógicamente si se publica como REA.
10. Accesibilidad comprobada.
11. Revisión editorial final.

## Regla de publicación

Nunca se debe cambiar un registro a Verificado/Publicable únicamente para que aparezca en el sitio. La promoción PREVIEW → WEB representa una decisión editorial y documental.

## Prioridad de trabajo para el corpus

Se recomienda validar por lotes pequeños, no las 61 creadoras simultáneamente.

### Lote 1 · pilotos completos

- CR-001 · Matilde Hidalgo Navarro
- CR-047 · Blanca Cano Palacio
- CR-052 · Rocío del Carmen Espinosa Ontaneda
- CR-058 · Emily Katherine Ordóñez Celi

Estado: Matilde completa actualmente el flujo público. Blanca conserva una actividad interna completa, pero sus fuentes y contenidos siguen sin publicación. Rocío y Emily permanecen en diseño preliminar porque sus actividades todavía no están desarrolladas. Ninguna debe promoverse por conveniencia de interfaz.

### Lote 2 · creadoras con fuentes y obras relativamente desarrolladas

Seleccionar registros con fuentes bibliográficas/institucionales suficientes y material verificable.

### Lote 3 · registros con vacíos importantes

Mantener en PREVIEW y abrir tareas específicas de investigación documental.

## Arquitectura de presentación pública

La lógica de navegación debe conservar cinco niveles:

1. Proyecto: propósito y objetivos.
2. Sistematización: cómo se construye y valida el corpus.
3. Explora: creadoras, cronología, mapa y conexiones.
4. Aprende: catálogo y laboratorios educativos.
5. Trazabilidad: fuentes, derechos, estados y vacíos.

## Próximo hito de producción

El índice preliminar permite localizar las 61 creadoras sin presentar como verificadas sus fichas. `RE-001` valida el flujo completo de un primer laboratorio público. El siguiente hito es cerrar documentación, derechos, obra, pregunta y actividad de un segundo perfil antes de promoverlo a las vistas WEB.
