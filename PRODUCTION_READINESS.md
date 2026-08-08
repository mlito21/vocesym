# Voces y Melodías Lojanas · Preparación para producción

## Estado actual

El repositorio dispone de una arquitectura funcional:

Google Sheets (Base Maestra) → vistas PREVIEW/WEB → Apps Script/API → portal HTML/CSS/JS → GitHub Pages.

La Base Maestra registra actualmente:

- 61 creadoras identificadas.
- 95 obras o fragmentos preliminares.
- 113 fuentes registradas.
- 58 referencias multimedia iniciales.
- 61 propuestas de recursos educativos.
- 0 registros publicables según el control editorial vigente.

Por tanto, el sitio publicado en GitHub Pages debe considerarse por ahora un **entorno PREVIEW académico**, no una publicación definitiva del corpus.

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
API_MODE: "preview"
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

Configuración web futura:

```js
API_MODE: "public"
```

Las vistas WEB solo deben recibir registros que cumplan los controles editoriales.

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
- CR-058 · Emily Katherine Ordóñez Celi

Objetivo: completar documentación, derechos, biografía, obras y recurso educativo, y utilizar estos perfiles para validar todo el flujo de producción.

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

No es publicar las 61 creadoras de inmediato. El siguiente hito es conseguir que el primer lote piloto atraviese completamente el flujo editorial y aparezca correctamente en las vistas WEB. Una vez validado el proceso, se escala por lotes.