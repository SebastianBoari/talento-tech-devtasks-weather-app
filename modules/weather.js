export async function geocodeCity(name){
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=es`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Error en geocoding');
  const data = await res.json();
  if(!data.results || data.results.length === 0) throw new Error('Ciudad no encontrada');
  const {latitude, longitude, name: foundName, country} = data.results[0];
  return {latitude, longitude, foundName, country};
}

export async function fetchWeather(lat, lon){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Error consultando el servicio de clima');
  const data = await res.json();
  return data.current_weather;
}

export function renderWeather(container, geo, weather){
  if(!weather) { container.textContent = 'Sin datos'; return; }
  container.innerHTML = `
    <strong>${geo.foundName}, ${geo.country}</strong>
    <div>Temperatura: ${weather.temperature} °C</div>
    <div>Velocidad del viento: ${weather.windspeed} m/s</div>
    <div>Dirección del viento: ${weather.winddirection}°</div>
    <div>Estado: ${weather.weathercode ?? 'n/a'}</div>
  `;
}
