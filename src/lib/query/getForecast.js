const days = 3;

export async function getForecastFromCity(city) {
  const API_KEY = process.env.API_KEY;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&aqi=no&days=${days}`
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export async function getForecastFromLatLon(lat, lon) {
  const API_KEY = process.env.API_KEY;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&aqi=no&days=${days}`
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
