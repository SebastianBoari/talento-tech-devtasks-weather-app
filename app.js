const WEATHER_FORM = document.getElementById('weather-form');
const CITY_INPUT = document.getElementById('city');
const WEATHER_RESULT = document.getElementById('weather-result');

const TASK_FORM = document.getElementById('task-form');
const TASK_INPUT = document.getElementById('task-input');
const TASKS_LIST = document.getElementById('tasks-list');

const TASKS_KEY = 'devtask-weather-tasks-v1';

/* ------------------ Weather: Open-Meteo (geocoding + current_weather) ------------------ */

async function geocodeCity(name){
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=es`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Error en geocoding');
  const data = await res.json();
  if(!data.results || data.results.length === 0) throw new Error('Ciudad no encontrada');
  const {latitude, longitude, name: foundName, country} = data.results[0];
  return {latitude, longitude, foundName, country};
}

async function fetchWeather(lat, lon){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Error consultando el servicio de clima');
  const data = await res.json();
  return data.current_weather;
}

WEATHER_FORM.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const city = CITY_INPUT.value.trim();
  if(!city) return;
  WEATHER_RESULT.textContent = 'Consultando...';
  try{
    const geo = await geocodeCity(city);
    const weather = await fetchWeather(geo.latitude, geo.longitude);
    renderWeather(geo, weather);
  }catch(err){
    WEATHER_RESULT.textContent = `Error: ${err.message}`;
  }
});

function renderWeather(geo, weather){
  if(!weather) { WEATHER_RESULT.textContent = 'Sin datos'; return; }
  WEATHER_RESULT.innerHTML = `
    <strong>${geo.foundName}, ${geo.country}</strong>
    <div>Temperatura: ${weather.temperature} °C</div>
    <div>Velocidad del viento: ${weather.windspeed} m/s</div>
    <div>Dirección del viento: ${weather.winddirection}°</div>
    <div>Estado: ${weather.weathercode ?? 'n/a'}</div>
  `;
}

/* ------------------ Tasks: localStorage persistence ------------------ */

function loadTasks(){
  try{
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error('Error leyendo tasks:', e);
    return [];
  }
}

function saveTasks(tasks){
  try{
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }catch(e){
    console.error('Error guardando tasks:', e);
  }
}

function renderTasks(){
  const tasks = loadTasks();
  TASKS_LIST.innerHTML = '';
  if(tasks.length === 0){
    TASKS_LIST.innerHTML = '<li>Sin tareas</li>';
    return;
  }
  tasks.forEach((t, idx)=>{
    const li = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = t.text;
    if(t.done) text.classList.add('completed');

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = t.done ? 'Deshacer' : 'Hecho';
    toggleBtn.addEventListener('click', ()=>{
      toggleTask(idx);
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Eliminar';
    delBtn.addEventListener('click', ()=>{
      deleteTask(idx);
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(delBtn);

    li.appendChild(text);
    li.appendChild(actions);
    TASKS_LIST.appendChild(li);
  });
}

function addTask(text){
  const tasks = loadTasks();
  tasks.push({text, done:false, created: Date.now()});
  saveTasks(tasks);
  renderTasks();
}

function toggleTask(index){
  const tasks = loadTasks();
  if(!tasks[index]) return;
  tasks[index].done = !tasks[index].done;
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(index){
  let tasks = loadTasks();
  tasks = tasks.filter((_,i)=>i!==index);
  saveTasks(tasks);
  renderTasks();
}

TASK_FORM.addEventListener('submit',(e)=>{
  e.preventDefault();
  const text = TASK_INPUT.value.trim();
  if(!text) return;
  addTask(text);
  TASK_INPUT.value = '';
});

// Init
renderTasks();
