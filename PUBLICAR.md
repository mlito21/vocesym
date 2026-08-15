# Publicación y verificación

GitHub `main` es la fuente de verdad del frontend. GitHub Pages publica automáticamente los cambios de esa rama.

## 1. Antes de publicar el frontend

1. Actualizar la copia local desde `main`.
2. Comprobar la sintaxis de todos los archivos JavaScript.
3. Verificar que los enlaces y recursos locales existan.
4. Incrementar el parámetro `?v=` del script modificado para evitar una versión obsoleta en caché.
5. Confirmar que ningún identificador `TEST` pueda aparecer en producción.
6. Probar portada, archivo, recursos, laboratorio, cronología, mapa y conexiones.

No se deben copiar archivos sueltos sobre una versión anterior: HTML, CSS y JavaScript forman una unidad de despliegue.

## 2. Publicar datos desde la Base Maestra

Las vistas WEB son la única fuente del portal público. Marcar `PUBLICABLE_WEB = Sí` requiere verificación documental, revisión editorial, control de derechos y, cuando corresponda, revisión pedagógica.

Un recurso no debe publicarse si su creadora, obra base o pregunta asociada permanecen en revisión. Los registros de prueba deben conservar `PUBLICABLE_WEB = No` y usar identificadores reconocibles como `TEST`.

## 3. Desplegar la API pública

`Codigo_API_PUBLICA.gs` contiene la versión de referencia. Debe instalarse en un proyecto de Apps Script independiente del entorno PREVIEW y desplegarse como aplicación web de solo lectura.

La API publicada debe responder, como mínimo, a estas acciones:

- `creators`
- `works`
- `media`
- `resources`
- `relations`
- `locations`
- `mediations`
- `questions`

Después de crear una nueva versión del despliegue, actualizar `PUBLIC_API_URL` en `config.js` solo si cambió la URL ejecutable.

## 4. Control posterior

La publicación se considera completa únicamente cuando:

- GitHub Pages informa que la compilación terminó correctamente;
- `action=questions` devuelve `PG-003` y no el payload general;
- la portada muestra una pregunta autocorregible;
- `RE-001` abre cinco estaciones sin redirecciones;
- `RE-047`, `RE-052` y `RE-058` responden como no publicados;
- no aparecen nombres ni identificadores de prueba;
- los contadores coinciden con las vistas WEB.
