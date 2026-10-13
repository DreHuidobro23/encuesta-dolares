# Encuesta: cambio de dólares online

Web estática (HTML, CSS y JavaScript, sin dependencias) para aplicar la encuesta de la tesis
*Factores que influyen en la intención de uso de recursos online en el mercado de cambio de
dólares de los millennials de Lima Moderna*.

Las respuestas se envían al **Google Form original**, así que llegan a la misma hoja de
respuestas que el formulario. No hay base de datos ni servidor propio.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Página de la encuesta |
| `app.js` | Flujo de preguntas, filtros y envío a Google Forms |
| `config.js` | IDs del formulario, ítems, enlace del sorteo y Pixel de Meta |
| `styles.css` | Estilos (misma paleta de las piezas de LinkedIn e Instagram) |
| `bases.html` | Bases del sorteo (completar los textos `[COMPLETAR]`) |

## Antes de publicar

1. Completa los campos `[COMPLETAR]` de `bases.html`.
2. El registro del sorteo ya está conectado al Google Form "Sorteo gift card S/ 300 – Encuesta
   dólares" (bloque `sorteo` de `config.js`). Aparece solo al terminar la encuesta y guarda los
   datos en ese formulario aparte, para que las respuestas sigan siendo anónimas.
3. Opcional: pega el ID de tu Pixel de Meta en `metaPixelId` para medir las encuestas
   completadas desde la pauta de Instagram.

> Si cambias preguntas u opciones en el Google Form, actualiza `config.js`: los valores
> enviados deben coincidir exactamente con las opciones del formulario.

## Probar en local

```bash
python3 -m http.server 5173
```

Abre http://localhost:5173.

## Publicar en Vercel desde GitHub

1. Crea un repositorio en GitHub y sube esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Encuesta web"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```
2. En vercel.com → **Add New… → Project** → importa el repositorio.
3. Framework Preset: **Other**. No necesita comando de build ni carpeta de salida.
4. **Deploy**. Cada `git push` a `main` vuelve a publicar la web.
