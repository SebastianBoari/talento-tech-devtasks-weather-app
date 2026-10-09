import {geocodeCity, fetchWeather, renderWeather} from './weather.js';
import {renderTasks, addTask} from './tasks.js';

export function initUI(){
  const WEATHER_FORM = document.getElementById('weather-form');
  const CITY_INPUT = document.getElementById('city');
  const WEATHER_RESULT = document.getElementById('weather-result');

  const TASK_FORM = document.getElementById('task-form');
  const TASK_INPUT = document.getElementById('task-input');
  const TASKS_LIST = document.getElementById('tasks-list');

  // Weather form
  WEATHER_FORM.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const city = CITY_INPUT.value.trim();
    if(!city) return;
    WEATHER_RESULT.textContent = 'Consultando...';
    try{
      const geo = await geocodeCity(city);
      const weather = await fetchWeather(geo.latitude, geo.longitude);
      renderWeather(WEATHER_RESULT, geo, weather);
    }catch(err){
      WEATHER_RESULT.textContent = `Error: ${err.message}`;
    }
  });

  // Tasks form
  TASK_FORM.addEventListener('submit',(e)=>{
    e.preventDefault();
    const text = TASK_INPUT.value.trim();
    if(!text) return;
    addTask(text, TASKS_LIST);
    TASK_INPUT.value = '';
  });

  // Inicial render
  renderTasks(TASKS_LIST);
}
