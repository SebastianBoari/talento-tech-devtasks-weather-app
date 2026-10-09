# Guía del webinar — "JavaScript en acción"

Cada carpeta es el **punto de partida** de una etapa (como en un programa de cocina).
Si algo falla en vivo: abrí la carpeta de la etapa siguiente y seguí desde ahí.

> ⚠️ Abrir siempre con **Live Server** (VS Code → clic derecho en `index.html` → "Open with Live Server").
> Con doble clic NO funciona porque usamos `type="module"`.

| Carpeta | Qué se escribe en vivo | Archivo |
|---|---|---|
| `etapa-1-dom` | `getElementById` + `addEventListener('submit')` + `preventDefault` | `modules/ui.js` |
| `etapa-2-api` | `geocodeCity` con `fetch` / `async-await` | `modules/weather.js` |
| `etapa-3-tareas` | `loadTasks` / `saveTasks` con `localStorage` + JSON | `modules/tasks.js` |
| `etapa-final` | Nada: proyecto terminado | — |

---

## Etapa 1 — DOM y eventos (~10 min)

Archivo: `etapa-1-dom/modules/ui.js`, dentro de `initUI()`:

```js
const WEATHER_FORM = document.getElementById('weather-form');
const CITY_INPUT   = document.getElementById('city');

WEATHER_FORM.addEventListener('submit', (e)=>{
  e.preventDefault();               // sin esto, la página se recarga
  const city = CITY_INPUT.value.trim();
  console.log('Ciudad ingresada:', city);
});
```

**Qué mostrar:** primero probalo SIN `e.preventDefault()` (la página se recarga y el log desaparece), después con él.
**Qué decir:** "El HTML es el esqueleto; con `getElementById` JavaScript agarra una pieza del árbol (el DOM) y le pone un 'oído' con `addEventListener`."

---

## Etapa 2 — API con Open-Meteo (~20 min)

**Antes de programar:** pegá estas URLs en el navegador y mostrá el JSON:
- https://geocoding-api.open-meteo.com/v1/search?name=Rosario&count=1&language=es → nos da `latitude` y `longitude`
- https://api.open-meteo.com/v1/forecast?latitude=-32.95&longitude=-60.64&current_weather=true → nos da el clima

**Qué decir:** "Open-Meteo no entiende nombres de ciudades, entiende coordenadas. Por eso son 2 pasos: ciudad → coordenadas → clima. Es gratis y no pide clave."

Archivo: `etapa-2-api/modules/weather.js`, dentro de `geocodeCity(name)`:

```js
const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=es`;
const res = await fetch(url);                 // pedimos los datos (tarda: por eso await)
if(!res.ok) throw new Error('Error en geocoding');
const data = await res.json();                // convertimos la respuesta en objeto JS
if(!data.results || data.results.length === 0) throw new Error('Ciudad no encontrada');
const {latitude, longitude, name: foundName, country} = data.results[0];
return {latitude, longitude, foundName, country};
```

**Después:** mostrá `fetchWeather` (ya hecha, mismo patrón) y el `try...catch` en `ui.js`.
**Demo de error:** buscá "asdfgh" → aparece "Error: Ciudad no encontrada" (eso es el `catch`).

Conceptos:
- `async` → "esta función va a esperar cosas".
- `await` → "esperá a que llegue la respuesta antes de seguir".
- `try...catch` → "si algo sale mal (sin internet, ciudad inexistente), no rompas la app: mostrá el error".

---

## Etapa 3 — Tareas y localStorage (~20 min)

**Demo inicial:** agregá una tarea → aparece "Sin tareas". ¿Por qué? Porque `saveTasks` no guarda nada todavía.

Archivo: `etapa-3-tareas/modules/tasks.js`:

```js
export function loadTasks(){
  try{
    const raw = localStorage.getItem(TASKS_KEY);   // texto guardado (o null)
    return raw ? JSON.parse(raw) : [];             // texto -> array
  }catch(e){
    console.error('Error leyendo tasks:', e);
    return [];
  }
}

export function saveTasks(tasks){
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); // array -> texto
}
```

**Demo final:** agregá tareas, recargá la página (F5) → siguen ahí. Mostrá DevTools → Application → Local Storage para que vean el texto JSON guardado.

**Explicar `renderTasks` (ya hecha) con el "bucle reactivo" del PDF:**
1. El usuario hace clic (Agregar / Hecho / Eliminar)
2. Se modifica el array en memoria
3. `saveTasks` lo guarda
4. `renderTasks` borra la lista (`innerHTML = ''`) y la vuelve a dibujar desde cero

"La pantalla es solo un reflejo de los datos."

---

## Preguntas probables

- **¿Qué es "Estado: 3"?** Es el `weathercode` de Open-Meteo: 0 = despejado, 1–3 = nublado, 45/48 = niebla, 51–67 = llovizna/lluvia, 71–77 = nieve, 95+ = tormenta. Traducirlo con un objeto es un buen ejercicio para la casa.
- **¿localStorage es una base de datos?** No: solo vive en ESE navegador, solo guarda texto, ~5 MB, y si el usuario borra los datos se pierde.
- **¿Por qué `encodeURIComponent`?** Para que ciudades con espacios o tildes ("San Martín") no rompan la URL.
- **¿Qué es `app.js`?** La misma app en un solo archivo, sin módulos. El HTML usa `main.js` + `modules/`.
