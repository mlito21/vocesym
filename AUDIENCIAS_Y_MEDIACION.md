# Audiencias y modelo de mediación · Voces y Melodías Lojanas

## Principio de diseño

El portal no debe presentar la experiencia del equipo investigador como experiencia principal del visitante. El contenido se organiza en tres capas con públicos y finalidades diferentes.

## 1. Descubrir · público general

Público prioritario:

- ciudadanía;
- comunidad lojana;
- visitantes interesados en cultura y patrimonio;
- familias;
- estudiantes que exploran por interés personal;
- personas sin formación literaria o musical especializada.

Preguntas que debe responder una experiencia patrimonial:

1. ¿Quién fue/es esta creadora?
2. ¿Qué hizo?
3. ¿Qué obras conocemos?
4. ¿Por qué su trayectoria es relevante para el patrimonio lojano?
5. ¿Qué puedo ver, escuchar, leer o explorar?

Entidad de datos:

- `21_Mediacion_Patrimonial`
- `22_PREVIEW_Mediacion`
- `23_WEB_Mediacion`

Página web:

- `creadora.html?id=CR-XXX`

La mediación patrimonial no exige objetivos de aprendizaje, rúbricas ni producción académica del visitante.

## 2. Aprender · comunidad educativa

Públicos:

- estudiantes;
- docentes;
- mediadores culturales;
- educación no formal.

Aquí sí pueden aparecer:

- objetivos de aprendizaje;
- secuencias didácticas;
- actividades;
- laboratorios;
- H5P/eXeLearning;
- evidencias;
- instrumentos de evaluación;
- guías docentes.

Entidad de datos:

- `05_Recursos_educativos`
- `14_PREVIEW_Recursos`
- `10_WEB_Recursos`

Los laboratorios de Matilde Hidalgo, Blanca Cano, Rocío del Carmen Espinosa Ontaneda y Emily Ordóñez pertenecen a esta capa y no deben reemplazar la experiencia patrimonial general. En el corte actual, solo el laboratorio de Matilde está publicado; los otros tres permanecen en el entorno interno hasta completar sus controles documentales y pedagógicos.

## 3. Investigar · especialistas y equipo del proyecto

Públicos:

- investigadores;
- estudiantes universitarios avanzados;
- equipo de Voces y Melodías Lojanas;
- especialistas en patrimonio, literatura y música.

Contenidos:

- fuentes;
- estados de verificación;
- variantes de títulos y autorías;
- procedencia de imágenes;
- derechos;
- vacíos documentales;
- relaciones entre registros;
- referencias bibliográficas.

Esta capa es necesaria para la trazabilidad, pero no debe dominar la experiencia inicial del visitante general.

## Flujo recomendado por creadora

`Archivo → Conocer su vida y obra → Explorar obras y legado → [opcional] Aprender con su obra → [opcional] Investigar fuentes`

## Primer prototipo de mediación

`MP-047 · CR-047 · Blanca Cano Palacio`

Objetivo del prototipo: validar que la página permita a una persona no especialista conocer su trayectoria, sus obras y su relevancia antes de ofrecer actividades educativas o documentación técnica.

## Regla de escalado

No crear 61 páginas HTML manuales. `creadora.html` es una plantilla parametrizada por `ID_CREADORA`. Los contenidos públicos específicos se incorporan progresivamente a `21_Mediacion_Patrimonial` y pasan a WEB solo cuando están verificados y autorizados.
