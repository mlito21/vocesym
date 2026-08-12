# Voces y Melodías Lojanas · Arquitectura del producto final

## Propósito de este documento

Evitar que el portal se desarrolle por acumulación de funciones. Cada módulo debe responder a un objetivo del proyecto, a una necesidad de mediación patrimonial o a una función de apoyo claramente diferenciada.

La arquitectura se organiza en cuatro capas: **Investigar → Sistematizar → Mediar/Explorar → Aprender/Proyectar**.

> Nota metodológica: la redacción exacta de los objetivos oficiales debe mantenerse como referencia de control en la documentación del proyecto. Este documento traduce esos objetivos a productos digitales verificables y debe actualizarse si el Anexo 6 oficial introduce un producto o compromiso adicional.

---

## 1. Núcleo del producto: Archivo Digital Educativo

El producto final no debe entenderse como una colección de páginas independientes, sino como un **archivo digital educativo y patrimonial** alimentado por una Base Maestra y organizado en experiencias de descubrimiento, aprendizaje e investigación.

### Arquitectura general

```text
BASE MAESTRA
│
├── Creadoras
├── Obras
├── Fuentes
├── Multimedia
├── Relaciones
├── Lugares
├── Mediación patrimonial
├── Preguntas interactivas
└── Recursos educativos
        │
        ▼
VISTAS PREVIEW / WEB
        │
        ▼
API · Apps Script
        │
        ▼
PORTAL WEB
├── Proyecto
├── Archivo de creadoras
├── Obras y perfiles
├── Cronología
├── Mapa cultural
├── Conexiones
├── Descubre jugando
├── Recursos educativos
├── H5P / Lumi / eXeLearning
├── Multimedia
└── Fuentes y trazabilidad
```

---

## 2. Matriz de productos y estado

| Necesidad del proyecto | Evidencia digital | Módulo | Estado | Prioridad |
|---|---|---|---|---|
| Identificar y sistematizar creadoras | Base normalizada, IDs persistentes, categorías y disciplinas | Base Maestra + Archivo | Desarrollado / requiere validación de datos | Crítica |
| Documentar vida y trayectoria | Biografía, hitos, fuentes, estado documental | Ficha pública `creadora.html` | Modelo implementado; falta completar corpus | Crítica |
| Recuperar y visibilizar obras | Obras vinculadas por autora, género, fecha y fuente | Ficha de creadora + futura exploración de obras | Parcial | Crítica |
| Mostrar evolución histórica | Cronología dinámica | `linea-tiempo.html` | Implementado | Alta |
| Relacionar creadoras con territorio | Georreferenciación con precisión explícita | `mapa.html` | Implementado; cobertura limitada por datos | Alta |
| Mostrar relaciones entre creación, obra y transformación | Grafo/relaciones documentales | `conexiones.html` | Implementado | Alta |
| Divulgar vida y obra al público general | Narrativa curatorial por creadora | Mediación patrimonial | Modelo implementado con Blanca Cano | Crítica |
| Facilitar interacción general | Banco de preguntas aleatorias | Inicio + creadora + recursos | Implementado en PREVIEW | Media-Alta |
| Producir recursos educativos | H5P/Lumi/eXeLearning/laboratorios | Recursos + ficha de creadora | Infraestructura lista; contenidos por desarrollar | Crítica |
| Evidenciar fuentes y rigor | Referencias, estados de verificación, derechos | Sección Investiga / trazabilidad | Implementado parcialmente | Crítica |
| Incorporar audio, imagen, partitura o video | Multimedia documentada y autorizada | Ficha pública + recursos | Estructura existente; faltan derechos/materiales | Alta |
| Preservar y circular productos del proyecto | Descarga/enlace a materiales autorizados | Biblioteca/recursos derivados | Pendiente de consolidación | Media |
| Accesibilidad digital | Navegación por teclado, contraste, alt text, subtítulos/transcripciones | Transversal | Parcial; requiere auditoría WCAG | Alta |
| Experiencias inmersivas/RA, si constan como producto comprometido | Recurso RA vinculado a creadora/obra/exposición | Módulo derivado | No implementado todavía | Revisar compromiso oficial |

---

## 3. Estructura definitiva de navegación

### Inicio

Debe explicar el proyecto y ofrecer entradas claras, no convertirse en un catálogo exhaustivo.

1. **Proyecto** — qué se investiga y por qué importa.
2. **Sistematización** — cómo se organiza y valida el corpus.
3. **Explora** — creadoras, cronología, mapa y conexiones.
4. **Interactúa** — pregunta aleatoria y descubrimiento lúdico.
5. **Aprende** — recursos educativos, H5P/Lumi y laboratorios.
6. **Trazabilidad** — fuentes, derechos y estado de investigación.

### Archivo de creadoras

Función: entrada principal al corpus.

Cada tarjeta debe llevar a:

- **Conocer su vida y obra** → ficha patrimonial.
- **Aprender con su obra** → recurso educativo, cuando exista.

### Ficha de creadora

Secuencia recomendada y estable:

1. Identidad y gancho curatorial.
2. Conoce su historia.
3. Por qué importa.
4. Obras documentadas.
5. Pregunta interactiva relacionada.
6. Experiencias de exploración.
7. Legado y conexiones.
8. Mira, escucha y lee.
9. Para aprender — H5P/Lumi/recurso.
10. Investiga — fuentes, estado y derechos.

### Cronología

Debe representar solo hitos con fecha suficientemente documentada y distinguir:

- nacimiento/muerte;
- publicación/estreno/composición;
- hitos profesionales;
- recuperación o reinterpretación posterior.

### Mapa cultural

Debe representar lugares documentados y mantener visible el nivel de precisión:

- ciudad;
- institución;
- espacio cultural;
- pendiente de georreferenciación.

Nunca debe inferir coordenadas biográficas sin evidencia.

### Conexiones

Debe mostrar relaciones verificables entre:

- creadora ↔ obra;
- compositora ↔ arreglista;
- autora ↔ intérprete;
- obra original ↔ adaptación;
- creadora ↔ institución/archivo, cuando esté sustentado.

### Interacción general

El banco de preguntas es una capa transversal, no una evaluación escolar.

Usos:

- Inicio: 1 pregunta aleatoria.
- Ficha: 1 pregunta sobre la creadora.
- Recursos: recorrido de 5 preguntas.

### Recursos educativos

Deben estar separados de la mediación patrimonial.

Cada recurso puede tener:

- público/nivel;
- objetivo de aprendizaje;
- obra o creadora base;
- actividad;
- evidencia/evaluación, cuando corresponda;
- accesibilidad;
- URL H5P/Lumi/eXeLearning;
- opción de pantalla completa.

No es obligatorio que las 61 creadoras tengan inmediatamente un recurso didáctico complejo. Sí es deseable que todas dispongan, al menos, de una mediación patrimonial coherente cuando los datos sean suficientes.

---

## 4. Elementos que todavía faltan para considerar el portal “producto final”

### A. Contenido y calidad de datos

- Completar biografías verificadas por lotes.
- Resolver lugares y fechas pendientes.
- Normalizar títulos y roles de obras.
- Revisar derechos de imágenes, partituras, audio, video y textos.
- Promover registros PREVIEW → WEB solo después de validación.

### B. Multimedia patrimonial

- Fotografías autorizadas.
- Audio autorizado o enlaces institucionales.
- Fragmentos textuales permitidos.
- Partituras o imágenes de fuentes cuando los derechos lo permitan.
- Transcripciones/subtítulos para contenidos audiovisuales.

### C. Recursos educativos reales

- Construir H5P/Lumi/eXeLearning a partir de contenidos patrimoniales validados.
- Registrar `EMBED_URL`, `EMBED_FORMATO`, `EMBED_ALTURA` en la Base Maestra.
- Definir cuáles son recursos para público general, escolar, universitario o docente.

### D. Accesibilidad

Antes de producción debe existir una auditoría transversal de:

- contraste;
- teclado;
- foco visible;
- etiquetas de formulario;
- texto alternativo;
- estructura semántica;
- subtítulos/transcripciones;
- reducción de movimiento cuando corresponda;
- funcionamiento móvil.

### E. Producción y sostenibilidad

- Dominio o URL institucional, si corresponde.
- Página de créditos/equipo.
- Política de uso y derechos.
- Criterio de citación del archivo.
- Fecha/versión del corpus.
- Registro de cambios.
- Analítica respetuosa de privacidad, si se requiere evaluar uso.
- Copia/respaldo periódico de la Base Maestra.

---

## 5. Realidad aumentada y otros productos derivados

La RA no debe incorporarse solo para “tener tecnología”. Debe responder a una experiencia concreta y utilizar contenido ya validado.

Ejemplos válidos:

- escanear una pieza de RETazos y abrir la ficha de la creadora;
- activar audio, lectura poética o interpretación musical autorizada;
- superponer una cronología breve o una obra destacada;
- enlazar desde una exposición física al Archivo Digital Educativo.

Si la RA está comprometida explícitamente en los objetivos/productos oficiales, debe considerarse un subproducto obligatorio. Si no lo está, puede implementarse como fase de extensión después de estabilizar el archivo web.

---

## 6. Definición del producto final mínimo viable

El producto puede considerarse funcionalmente completo cuando:

1. La arquitectura PREVIEW/WEB esté estable.
2. El Archivo cargue dinámicamente el corpus aprobado.
3. Cada creadora publicada tenga ficha patrimonial suficiente.
4. Las obras publicadas estén vinculadas y documentadas.
5. Cronología, mapa y conexiones funcionen con datos reales.
6. Exista interacción general mediante preguntas verificadas.
7. Exista una colección inicial de recursos educativos reales H5P/Lumi/eXeLearning.
8. Multimedia y derechos estén controlados.
9. Fuentes y estado documental sean visibles.
10. Se complete una auditoría de accesibilidad y responsive.

---

## 7. Orden recomendado de trabajo desde este punto

### Fase 1 · Congelar arquitectura

No agregar módulos nuevos salvo que el Anexo 6 revele un compromiso omitido.

### Fase 2 · Validar primer lote

Completar documentalmente 3–5 creadoras y atravesar todo el flujo PREVIEW → WEB.

### Fase 3 · Recursos reales

Construir 2–3 H5P/Lumi ejemplares ligados a contenidos ya validados.

### Fase 4 · Multimedia y derechos

Incorporar materiales autorizados.

### Fase 5 · Escalamiento

Trabajar el resto del corpus por lotes y no por páginas HTML individuales.

### Fase 6 · Productos derivados

RA, exposición física, QR, RETazos u otros soportes deben consumir la misma Base Maestra o enlazar al mismo archivo, evitando duplicar información.

---

## Principio rector

**Un dato se registra una sola vez; múltiples productos lo reutilizan.**

La Base Maestra es la fuente de verdad. Cronología, mapa, conexiones, preguntas, fichas, H5P/Lumi, RA y productos expositivos deben derivarse de esa misma información o enlazarse mediante identificadores persistentes.
