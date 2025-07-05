function norm(x) {
    let s = 0;

    for (let value of x) {
        s += value * value;
    }

    return Math.sqrt(s);
};

/**
 * weather: object with current climate params as given by a call to
 * getWeatherFromCity of getWeatherFromLatLon.
 * activity: object with preferred climate params for activity.
 *
 * TODO: weather should be a global variable available on demand, only
 * do one call of the getWeather* methods to not overload API calls...
 */
export function cosineSimilarity(weather, activity) {
    // Normalization values
    const kelvin_shift = 273.15;
    const max_temp = 333;
    const max_wind = 400; 
    const ave_pressure = 1013.25;
    const max_humidity = 100; 
    const max_cloud = 100;
    const max_vis = 4.83;
    const max_uv = 10;

    // Importance weights
    // TODO: define

    // Current values
    const temp = (weather.avgtemp_c + kelvin_shift) / max_temp;
    const wind = weather.maxwind_kph / max_wind;
    const precip = weather.totalprecip_mm;
    const humidity = weather.avghumidity / max_humidity;
    const vis = weather.avgvis_km / max_vis;
    const uv = weather.uv / max_uv;

    const curr = [
        temp,
        wind,
        precip,
        humidity,
        vis,
        uv
    ];

    // Preferences
    const pref_temp = (activity.temperature + kelvin_shift) / max_temp;
    const pref_wind = activity.wind / max_wind;
    const pref_precip = activity.precipitation;
    const pref_humidity = activity.humidity / max_humidity;
    const pref_vis = activity.visibility / max_vis;
    const pref_uv = activity.uv / max_uv;

    const pref = [
        pref_temp,
        pref_wind,
        pref_precip,
        pref_humidity,
        pref_vis,
        pref_uv
    ];

    // Compute norms
    const curr_norm = norm(curr);
    const pref_norm = norm(pref);

    // Compute dot product
    let p = 0;

    for (let i = 0; i < 6; i++) {
        p += curr[i] * pref[i];
    }

    return (p / (curr_norm * pref_norm));
};
