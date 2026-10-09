// Paso 1: ciudad -> coordenadas
// Probá en el navegador: https://geocoding-api.open-meteo.com/v1/search?name=Rosario&count=1&language=es
export async function geocodeCity(name){
  // TODO EN VIVO:
  //   1. armar la URL con el nombre de la ciudad (encodeURIComponent)
  //   2. const res = await fetch(url)
  //   3. si !res.ok -> throw new Error('Error en geocoding')
  //   4. const data = await res.json()
  //   5. si no hay data.results -> throw new Error('Ciudad no encontrada')
  //   6. devolver { latitude, longitude, foundName, country } de data.results[0]

}

// Paso 2: coordenadas -> clima (mismo patrón que geocodeCity)
// Probá: https://api.open-meteo.com/v1/forecast?latitude=-32.95&longitude=-60.64&current_weather=true
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
    <div>Velocidad del viento: ${weather.windspeed} km/h</div>
    <div>Dirección del viento: ${weather.winddirection}°</div>
    <div>Estado: ${weather.weathercode ?? 'n/a'}</div>
  `;
}
