const SPREADSHEET_ID = '1B2fUMsHDJFPPpoH06UICs-Fm8AbUIA0UjEnU6MXqWjE';

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'site';
  var mode = (e && e.parameter && e.parameter.mode) || 'public';

  var payload;
  if (action === 'creators') {
    payload = getCreators_(mode);
  } else if (action === 'works') {
    payload = getWorks_(mode);
  } else if (action === 'media') {
    payload = getMedia_(mode);
  } else if (action === 'resources') {
    payload = getResources_(mode);
  } else if (action === 'relations') {
    payload = getRelations_(mode);
  } else if (action === 'locations') {
    payload = getLocations_(mode);
  } else {
    payload = getSitePayload_(mode);
  }

  var callback = e && e.parameter && e.parameter.callback;

  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(payload) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSitePayload_(mode) {
  var creators = getCreators_(mode).items;
  var works = getWorks_(mode).items;
  var resources = getResources_(mode).items;
  var relations = getRelations_(mode).items;
  var locations = getLocations_(mode).items;

  var byCreatorWorks = groupBy_(works, 'ID_CREADORA');
  var byCreatorResources = groupBy_(resources, 'ID_CREADORA');

  return {
    mode: mode === 'preview' ? 'preview' : 'live',
    generatedAt: new Date().toISOString(),
    relations: relations,
    locations: locations,
    creators: creators.map(function(c) {
      return {
        id: c.ID_CREADORA,
        category: c['CATEGORÍA'],
        discipline: c.DISCIPLINA,
        name: c.NOMBRE_COMPLETO,
        birth: c['AÑO_NACIMIENTO'],
        place: c.LUGAR_NACIMIENTO,
        bio: c['BIOGRAFÍA_VALIDADA'],
        source: c.FUENTE_PRINCIPAL,
        photoSource: c['FUENTE_FOTOGRAFÍA'],
        initials: initials_(c.NOMBRE_COMPLETO),
        works: (byCreatorWorks[c.ID_CREADORA] || []).map(function(w) {
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
        learning: normalizeLearning_((byCreatorResources[c.ID_CREADORA] || [])[0])
      };
    })
  };
}

function getCreators_(mode) {
  return mode === 'preview'
    ? readView_('12_PREVIEW_Creadoras', 3, 10)
    : readView_('07_WEB_Creadoras', 3, 10);
}

function getWorks_(mode) {
  return mode === 'preview'
    ? readView_('13_PREVIEW_Obras', 3, 13)
    : readView_('08_WEB_Obras', 3, 13);
}

function getMedia_(mode) {
  return readView_('09_WEB_Multimedia', 3, 8);
}

function getResources_(mode) {
  return mode === 'preview'
    ? readView_('14_PREVIEW_Recursos', 3, 15)
    : readView_('10_WEB_Recursos', 3, 15);
}

function getRelations_(mode) {
  return mode === 'preview'
    ? readView_('16_PREVIEW_Relaciones', 3, 14)
    : readView_('17_WEB_Relaciones', 3, 14);
}

function getLocations_(mode) {
  return mode === 'preview'
    ? readView_('19_PREVIEW_Lugares', 3, 13)
    : readView_('20_WEB_Lugares', 3, 13);
}

function readView_(sheetName, headerRow, width) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(sheetName);
  if (!sh) throw new Error('No existe la hoja: ' + sheetName);

  var lastRow = sh.getLastRow();
  if (lastRow <= headerRow) return { items: [] };

  var values = sh
    .getRange(headerRow, 1, lastRow - headerRow + 1, width)
    .getDisplayValues();

  var headers = values.shift();
  var items = values
    .filter(function(r) {
      return r.some(function(v) { return Boolean(v); });
    })
    .map(function(r) {
      var o = {};
      headers.forEach(function(h, i) { o[h] = r[i]; });
      return o;
    });

  return { items: items };
}

function groupBy_(arr, key) {
  return arr.reduce(function(m, x) {
    var groupKey = x[key];
    if (!m[groupKey]) m[groupKey] = [];
    m[groupKey].push(x);
    return m;
  }, {});
}

function initials_(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(function(x) { return Boolean(x); })
    .slice(0, 2)
    .map(function(x) { return x[0]; })
    .join('')
    .toUpperCase();
}

function normalizeLearning_(r) {
  if (!r) return null;
  return {
    title: r.TIPO_RECURSO,
    sequence: r['SECUENCIA_PEDAGÓGICA'],
    areas: r['ÁREAS_SUGERIDAS'],
    level: r.NIVEL_EDUCATIVO,
    objective: r.OBJETIVO_APRENDIZAJE,
    activity: r.ACTIVIDAD_INTERACTIVA,
    evidence: r.EVIDENCIA,
    assessment: r['INSTRUMENTO_EVALUACIÓN'],
    accessibility: r.ACCESIBILIDAD,
    technology: r['TECNOLOGÍA']
  };
}
