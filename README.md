# Voces y Melodías Lojanas · Archivo Digital Educativo

Proyecto web para sistematizar, explorar y mediar educativamente el patrimonio cultural femenino lojano.

## Arquitectura

```text
Base Maestra · Google Sheets
          ↓
Vistas controladas PREVIEW / WEB
          ↓
Google Apps Script · API JSON/JSONP
          ↓
GitHub · HTML/CSS/JavaScript
          ↓
GitHub Pages
```

La Base Maestra es la fuente única de contenidos. El repositorio no debe duplicar manualmente biografías, obras o recursos que puedan obtenerse de la API.

## Estado público verificado

Corte de control: 15 de agosto de 2026.

- 61 creadoras en el directorio preliminar.
- 2 fichas con información pública completa.
- 4 obras, 1 recurso multimedia y 1 lugar publicados.
- 1 laboratorio educativo público: `RE-001`, vinculado con Matilde Hidalgo Navarro y la obra `OB-0001`.
- 1 pregunta interactiva verificada: `PG-003`.
- 0 relaciones y 0 mediaciones patrimoniales publicadas.

La Base Maestra contiene más registros en investigación. El portal no los presenta como públicos hasta que superen la revisión documental, editorial, pedagógica y de derechos. Los identificadores de prueba se excluyen tanto en las vistas WEB como en la capa de aplicación.

## Entornos de datos

El frontend de GitHub Pages funciona únicamente en modo público y consulta la API de solo lectura configurada en `config.js`. No existe un parámetro de URL que habilite datos internos.

El entorno académico PREVIEW se administra por separado en Apps Script y en las vistas internas de la Base Maestra. No debe compartir endpoint ni configuración con el portal público.

La API pública utiliza exclusivamente las vistas WEB. `07_WEB_Creadoras` expone un índice preliminar con identificador, nombre, categoría y disciplina. Biografías, obras, fuentes, imágenes, multimedia, preguntas y recursos solo se incorporan cuando cumplen los criterios editoriales y legales.

Nunca se debe marcar un registro como publicable únicamente para probar la interfaz.

## Componentes del sitio

- `index.html`: narrativa y presentación general del proyecto.
- `archivo.html`: catálogo dinámico de creadoras.
- `recursos.html`: catálogo dinámico de recursos educativos.
- `recurso.html?id=RE-XXX`: plantilla de recurso parametrizado.
- `laboratorio.html?id=RE-XXX`: laboratorio guiado de cinco estaciones.
- `linea-tiempo.html`: cronología generada con fechas disponibles.
- `mapa.html`: lugares documentados y cobertura geográfica.
- `conexiones.html`: relaciones entre creadoras, obras y transformaciones.
- `Codigo_API_PUBLICA.gs`: fuente versionada de la API pública para Apps Script.

## Regla de desarrollo

A partir de esta fase, GitHub `main` es la fuente única de verdad del frontend.

Flujo recomendado en Visual Studio Code:

```bash
git pull
# editar y probar localmente
git add .
git commit -m "descripción del cambio"
git push
```

Antes de editar localmente debe ejecutarse `git pull` para evitar trabajar sobre una versión antigua.

## Publicación de datos

La promoción de una creadora desde PREVIEW a WEB requiere como mínimo:

1. identidad y nombre normalizados;
2. biografía revisada;
3. fuente principal trazable;
4. obras y roles confirmados;
5. estado de verificación = Verificado;
6. `PUBLICABLE_WEB = Sí`;
7. derechos de imagen resueltos cuando se publique fotografía;
8. derechos/licencias de texto, partitura, audio o video resueltos cuando corresponda;
9. revisión pedagógica del recurso educativo;
10. comprobación de accesibilidad;
11. aprobación editorial final.

Véase `PRODUCTION_READINESS.md` para el flujo completo.

## Prioridad inmediata

Completar por lotes las fichas patrimoniales, obras, fuentes, derechos y recursos antes de ampliar el contenido disponible. `RE-047`, `RE-052` y `RE-058` permanecen fuera del portal hasta que sus creadoras, obras, preguntas y materiales hayan sido verificados. Un estado interno de desarrollo no equivale a autorización de publicación.
