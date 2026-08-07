# Prototipo web · Voces y Melodías Lojanas

## Arquitectura
Google Sheets (base maestra) → Apps Script (API JSON) → sitio HTML/CSS/JS.

## Qué funciona ya
- Portada y narrativa del proyecto.
- Explorador de creadoras por disciplina.
- Ficha individual.
- Obras relacionadas.
- Tres laboratorios educativos piloto.
- Modo demostración sin servidor.
- Código de API listo para leer las vistas WEB de la Google Sheet.

## Activar conexión real
1. Abra la Google Sheet maestra.
2. Extensiones → Apps Script.
3. Reemplace el contenido de Code.gs con `apps-script/Code.gs`.
4. Guardar.
5. Implementar → Nueva implementación → Aplicación web.
6. Configure la ejecución con la cuenta propietaria y un nivel de acceso compatible con el público previsto.
7. Copie la URL terminada en `/exec`.
8. Abra `config.js` y péguela en `API_URL`.
9. Publique los archivos web en un hosting estático (GitHub Pages, Netlify o servidor institucional).

Nota: mientras las vistas WEB estén vacías, la API devolverá cero creadoras. Para probar el diseño sin publicar datos no verificados, deje `API_URL` vacío y se usará `data/demo.json`.

## Regla editorial
No marcar `PUBLICABLE_WEB = Sí` ni `ESTADO = Validado` solo para probar el sitio. El modo demo existe precisamente para no alterar el control científico y legal del proyecto.
