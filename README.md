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

## Estado del corpus

Según el control editorial de la Base Maestra:

- 61 creadoras registradas.
- 95 obras / fragmentos preliminares.
- 113 fuentes registradas.
- 58 referencias multimedia iniciales.
- 61 propuestas de recursos educativos.
- 0 registros declarados publicables actualmente.

Esto significa que GitHub Pages funciona todavía como **entorno académico PREVIEW**. No debe interpretarse como publicación definitiva del corpus.

## Modos de datos

`config.js` define el entorno por defecto.

### PREVIEW

```text
?mode=preview
```

Utiliza las vistas internas de revisión y permite trabajar con todo el corpus preliminar.

### WEB / producción

```text
?mode=public
```

Utiliza exclusivamente las vistas WEB. Estas vistas permanecen vacías hasta que los registros cumplan los criterios editoriales y legales.

Nunca se debe marcar un registro como publicable únicamente para probar la interfaz.

## Componentes del sitio

- `index.html`: narrativa y presentación general del proyecto.
- `archivo.html`: catálogo dinámico de creadoras.
- `recursos.html`: catálogo dinámico de recursos educativos.
- `recurso.html?id=RE-XXX`: plantilla de recurso parametrizado.
- `linea-tiempo.html`: cronología generada con fechas disponibles.
- `mapa.html`: lugares documentados y cobertura geográfica.
- `conexiones.html`: relaciones entre creadoras, obras y transformaciones.
- `laboratorio-matilde.html`: prototipo de laboratorio de poesía.
- `laboratorio-blanca.html`: prototipo de laboratorio sonoro.
- `laboratorio-emily.html`: prototipo de laboratorio del arreglo.

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

Validar completamente el flujo con un primer lote de perfiles antes de escalar la publicación pública al corpus completo. Los laboratorios existentes sirven como pruebas funcionales de mediación, no como justificación para publicar datos todavía no verificados.
