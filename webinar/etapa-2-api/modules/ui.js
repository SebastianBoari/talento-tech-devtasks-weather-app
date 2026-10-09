import {geocodeCity, fetchWeather, renderWeather} from './weather.js';
import {renderTasks, addTask} from './tasks.js';

export function initUI(){
  const WEATHER_FORM = document.getElementById('weather-form');
  const CITY_INPUT = document.getElementById('city');
  const WEATHER_RESULT = document.getElementById('weather-result');

  // Weather form (ya hecho en la etapa 1, ahora conectado a la API)
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

  // Las tareas llegan en la etapa 3
}
