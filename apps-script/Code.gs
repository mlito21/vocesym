
const SPREADSHEET_ID = '1B2fUMsHDJFPPpoH06UICs-Fm8AbUIA0UjEnU6MXqWjE';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'site';
  const payload = action === 'creators' ? getCreators_()
                : action === 'works' ? getWorks_()
                : action === 'media' ? getMedia_()
                : action === 'resources' ? getResources_()
                : getSitePayload_();

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSitePayload_() {
  const creators = getCreators_().items;
  const works = getWorks_().items;
  const resources = getResources_().items;
  const byCreatorWorks = groupBy_(works, 'ID_CREADORA');
  const byCreatorResources = groupBy_(resources, 'ID_CREADORA');

  return {
    mode: 'live',
    generatedAt: new Date().toISOString(),
    creators: creators.map(c => ({
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
      works: (byCreatorWorks[c.ID_CREADORA] || []).map(w => ({
        id: w.ID_OBRA,
        title: w.OBRA_NORMALIZADA,
        type: w.TIPO,
        role: w.ROL_CREADORA,
        year: w['AÑO_OBRA'],
        genre: w['GÉNERO']
      })),
      learning: normalizeLearning_((byCreatorResources[c.ID_CREADORA] || [])[0])
    }))
  };
}

function getCreators_(){ return readView_('07_WEB_Creadoras', 3, 10); }
function getWorks_(){ return readView_('08_WEB_Obras', 3, 13); }
function getMedia_(){ return readView_('09_WEB_Multimedia', 3, 8); }
function getResources_(){ return readView_('10_WEB_Recursos', 3, 15); }

function readView_(sheetName, headerRow, width) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(sheetName);
  if (!sh) throw new Error('No existe la hoja: ' + sheetName);
  const lastRow = sh.getLastRow();
  if (lastRow <= headerRow) return {items:[]};
  const values = sh.getRange(headerRow, 1, lastRow-headerRow+1, width).getDisplayValues();
  const headers = values.shift();
  const items = values.filter(r => r.some(Boolean)).map(r => {
    const o={}; headers.forEach((h,i)=>o[h]=r[i]); return o;
  });
  return {items};
}
function groupBy_(arr, key) {
  return arr.reduce(function(m, x) {
    var groupKey = x[key];
    if (!m[groupKey]) {
      m[groupKey] = [];
    }
    m[groupKey].push(x);
    return m;
  }, {});
}
function initials_(name){
  return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
}
function normalizeLearning_(r){
  if(!r) return null;
  return {
    title:r.TIPO_RECURSO,
    sequence:r['SECUENCIA_PEDAGÓGICA'],
    areas:r['ÁREAS_SUGERIDAS'],
    level:r.NIVEL_EDUCATIVO,
    objective:r.OBJETIVO_APRENDIZAJE,
    activity:r.ACTIVIDAD_INTERACTIVA,
    evidence:r.EVIDENCIA,
    assessment:r['INSTRUMENTO_EVALUACIÓN'],
    accessibility:r.ACCESIBILIDAD,
    technology:r['TECNOLOGÍA']
  };
}
