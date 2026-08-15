/**
 * Voces y Melodías Lojanas — API pública de solo lectura
 *
 * Este archivo debe instalarse en un proyecto de Apps Script INDEPENDIENTE
 * del proyecto institucional PREVIEW. Lee la misma Base Maestra, pero solo
 * consulta las hojas WEB. No acepta ni interpreta el parámetro mode=preview.
 */

var SPREADSHEET_ID = '1B2fUMsHDJFPPpoH06UICs-Fm8AbUIA0UjEnU6MXqWjE';
var CACHE_SECONDS = 300;

function doGet(e) {
  var action = getAction_(e);
  var callback = getCallback_(e);

  try {
    var payload = getPublicPayload_(action);
    var body = JSON.stringify(payload);

    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + body + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService
      .createTextOutput(body)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);

    var failure = JSON.stringify({
      ok: false,
      mode: 'live',
      error: 'No fue posible generar la respuesta pública.'
    });

    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + failure + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService
      .createTextOutput(failure)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getAction_(e) {
  var requested = String(
    (e && e.parameter && e.parameter.action) || 'site'
  ).toLowerCase();

  var allowed = {
    site: true,
    creators: true,
    works: true,
    media: true,
    resources: true,
    relations: true,
    locations: true,
    mediations: true,
    questions: true
  };

  return allowed[requested] ? requested : 'site';
}

function getCallback_(e) {
  var callback = String(
    (e && e.parameter && e.parameter.callback) || ''
  ).trim();

  if (!callback) return '';

  // Evita que el parámetro JSONP permita inyectar código arbitrario.
  var validCallback = /^[A-Za-z_$][0-9A-Za-z_$]*(?:\.[A-Za-z_$][0-9A-Za-z_$]*)*$/;
  return validCallback.test(callback) ? callback : '';
}

function getPublicPayload_(action) {
  var cache = CacheService.getScriptCache();
  var cacheKey = 'vml-public-v2-' + action;
  var cached = cache.get(cacheKey);

  if (cached) return JSON.parse(cached);

  var payload;

  if (action === 'creators') {
    payload = getCreators_();
  } else if (action === 'works') {
    payload = getWorks_();
  } else if (action === 'media') {
    payload = getMedia_();
  } else if (action === 'resources') {
    payload = getResources_();
  } else if (action === 'relations') {
    payload = getRelations_();
  } else if (action === 'locations') {
    payload = getLocations_();
  } else if (action === 'mediations') {
    payload = getMediations_();
  } else if (action === 'questions') {
    payload = getQuestions_();
  } else {
    payload = getSitePayload_();
  }

  cache.put(cacheKey, JSON.stringify(payload), CACHE_SECONDS);
  return payload;
}

function getSitePayload_() {
  var creators = getCreators_().items;
  var works = getWorks_().items;
  var media = getMedia_().items;
  var resources = getResources_().items;
  var relations = getRelations_().items;
  var locations = getLocations_().items;
  var mediations = getMediations_().items;
  var questions = getQuestions_().items;

  var byCreatorWorks = groupBy_(works, 'ID_CREADORA');
  var byCreatorResources = groupBy_(resources, 'ID_CREADORA');
  var byCreatorMediations = groupBy_(mediations, 'ID_CREADORA');
  var byCreatorQuestions = groupBy_(questions, 'ID_CREADORA');

  return {
    ok: true,
    mode: 'live',
    generatedAt: new Date().toISOString(),
    relations: relations,
    locations: locations,
    media: media,
    resources: resources.map(normalizeResource_),
    mediations: mediations.map(normalizeMediation_),
    questions: questions.map(normalizeQuestion_),
    creators: creators.map(function(c) {
      var creatorId = c.ID_CREADORA;
      var creatorResources = (byCreatorResources[creatorId] || [])
        .map(normalizeResource_);
      var creatorMediations = (byCreatorMediations[creatorId] || [])
        .map(normalizeMediation_);
      var creatorQuestions = (byCreatorQuestions[creatorId] || [])
        .map(normalizeQuestion_);

      return {
        id: creatorId,
        category: c['CATEGORÍA'],
        discipline: c.DISCIPLINA,
        name: c.NOMBRE_COMPLETO,
        birth: c['AÑO_NACIMIENTO'],
        place: c.LUGAR_NACIMIENTO,
        bio: c['BIOGRAFÍA_VALIDADA'],
        source: c.FUENTE_PRINCIPAL,
        photoSource: c['FUENTE_FOTOGRAFÍA'],
        initials: initials_(c.NOMBRE_COMPLETO),
        works: (byCreatorWorks[creatorId] || []).map(function(w) {
          return {
            id: w.ID_OBRA,
            title: w.OBRA_NORMALIZADA,
            type: w.TIPO,
            role: w.ROL_CREADORA,
            year: w['AÑO_OBRA'],
            genre: w['GÉNERO'],
            source: w.FUENTE
          };
        }),
        resources: creatorResources,
        learning: creatorResources.length ? creatorResources[0] : null,
        mediations: creatorMediations,
        mediation: creatorMediations.length ? creatorMediations[0] : null,
        questions: creatorQuestions
      };
    })
  };
}

function getCreators_() {
  return readPublicView_('07_WEB_Creadoras', 3, 10);
}

function getWorks_() {
  return readPublicView_('08_WEB_Obras', 3, 13);
}

function getMedia_() {
  return readPublicView_('09_WEB_Multimedia', 3, 8);
}

function getResources_() {
  // La vista WEB de recursos contiene 18 columnas.
  return readPublicView_('10_WEB_Recursos', 3, 18);
}

function getRelations_() {
  return readPublicView_('17_WEB_Relaciones', 3, 14);
}

function getLocations_() {
  return readPublicView_('20_WEB_Lugares', 3, 13);
}

function getMediations_() {
  return readPublicView_('23_WEB_Mediacion', 3, 18);
}

function getQuestions_() {
  return readPublicView_('26_WEB_Preguntas', 3, 16);
}

function readPublicView_(sheetName, headerRow, width) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(sheetName);

  if (!sh) throw new Error('Falta una vista WEB configurada.');

  var lastRow = sh.getLastRow();
  if (lastRow <= headerRow) return { items: [] };

  var values = sh
    .getRange(headerRow, 1, lastRow - headerRow + 1, width)
    .getDisplayValues();

  var headers = values.shift();
  var items = values
    .filter(function(row) {
      return row.some(function(value) { return Boolean(value); });
    })
    .map(function(row) {
      var item = {};
      headers.forEach(function(header, index) {
        item[header] = row[index];
      });
      return item;
    })
    .filter(isPublicRow_)
    .filter(isProductionRow_);

  return { items: items };
}

function isPublicRow_(item) {
  // Las hojas WEB ya deberían estar filtradas. Esta comprobación añade una
  // segunda barrera cuando la vista incluye una columna PUBLICABLE_WEB.
  if (!Object.prototype.hasOwnProperty.call(item, 'PUBLICABLE_WEB')) {
    return true;
  }

  var value = normalizeText_(item.PUBLICABLE_WEB);
  return value === 'si' || value === 'yes' || value === 'true' ||
    value === '1' || value === 'publicado' || value === 'publicable';
}

function isProductionRow_(item) {
  return Object.keys(item).every(function(key) {
    if (key.indexOf('ID_') !== 0) return true;
    return !/(^|-)TEST(-|$)/i.test(String(item[key] || '').trim());
  });
}

function groupBy_(arr, key) {
  return arr.reduce(function(groups, item) {
    var groupKey = item[key];
    if (!groupKey) return groups;
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {});
}

function initials_(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(function(part) { return Boolean(part); })
    .slice(0, 2)
    .map(function(part) { return part.charAt(0); })
    .join('')
    .toUpperCase();
}

function normalizeText_(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeResource_(r) {
  if (!r) return null;
  return {
    id: r.ID_RECURSO,
    creatorId: r.ID_CREADORA,
    creator: r.CREADORA,
    title: r.TIPO_RECURSO,
    sequence: r['SECUENCIA_PEDAGÓGICA'],
    areas: r['ÁREAS_SUGERIDAS'],
    level: r.NIVEL_EDUCATIVO,
    workBase: r.OBRA_BASE,
    objective: r.OBJETIVO_APRENDIZAJE,
    activity: r.ACTIVIDAD_INTERACTIVA,
    evidence: r.EVIDENCIA,
    assessment: r['INSTRUMENTO_EVALUACIÓN'],
    accessibility: r.ACCESIBILIDAD,
    technology: r['TECNOLOGÍA'],
    projectObjective: r.OBJETIVO_PROYECTO
  };
}

function normalizeMediation_(m) {
  if (!m) return null;
  return {
    id: m.ID_MEDIACION,
    creatorId: m.ID_CREADORA,
    creator: m.CREADORA,
    title: m.TITULO_PUBLICO,
    hook: m.GANCHO,
    guideQuestion: m.PREGUNTA_GUIA,
    biography: m.SINTESIS_BIOGRAFICA,
    contribution: m.APORTE_PATRIMONIAL,
    featuredWorks: m.OBRAS_DESTACADAS,
    experience1: m.EXPERIENCIA_1,
    experience2: m.EXPERIENCIA_2,
    experience3: m.EXPERIENCIA_3,
    multimedia: m.MULTIMEDIA,
    legacy: m.LEGADO,
    audience: m.PUBLICO,
    accessibility: m.ACCESIBILIDAD,
    verificationStatus: m['ESTADO_VERIFICACIÓN'],
    publishable: m.PUBLICABLE_WEB
  };
}

function normalizeQuestion_(q) {
  if (!q) return null;
  return {
    id: q.ID_PREGUNTA,
    type: q.TIPO,
    question: q.PREGUNTA,
    options: [q.OPCION_A, q.OPCION_B, q.OPCION_C, q.OPCION_D]
      .filter(function(option) { return Boolean(option); }),
    answer: q.RESPUESTA_CORRECTA,
    feedback: q.RETROALIMENTACION,
    creatorId: q.ID_CREADORA,
    workId: q.ID_OBRA,
    difficulty: q.DIFICULTAD,
    source: q.FUENTE,
    destination: q.ENLACE_DESTINO,
    verificationStatus: q['ESTADO_VERIFICACIÓN'],
    publishable: q.PUBLICABLE_WEB
  };
}
