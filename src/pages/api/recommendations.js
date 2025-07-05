import { getForecastFromCity, getForecastFromLatLon } from "@/lib/query/getForecast";
import { cosineSimilarity } from "@/lib/similarity";
import { getActivitiesFromUser } from "@/lib/query/getActivities";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";


export default async function handler(req, res) {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const city = req.query.city;
    const session = await getServerSession(req, res, authOptions);
    // ESTE IF ESTA MAL Y ES UN PARCHE
    let email;
    if (!session)
      email = "josantis2021@udec.cl";
    else
      email = session.user.email;
    let forecast;
    if (lat && lon)
      forecast = await getForecastFromLatLon(lat, lon);
    else if (city)
      forecast = await getForecastFromCity(city);
    else
      throw 1;

    forecast = forecast.forecast.forecastday;
    const activities = await getActivitiesFromUser(email);
    if (!activities)
      throw new Error("an error has occured in connection with databse");

    let data = [];
    forecast.forEach(day => {
      let dayrecs = []
      activities.forEach(activity => {
        dayrecs.push({"name": activity.name, "similarity": cosineSimilarity(day.day, activity)});
      });
      data.push({"date": day.date, "recommendations": dayrecs});
    });

    const reduced_forecast = forecast.map(f => {
      return {
        date: f.date,
        ...f.day
      };
    });

    const recommendations_with_weather = [];

    for (let i = 0; i < data.length; i++) {
        let matched = false;

        for (let j = 0; j < reduced_forecast.length; j++) {
            if (data[i].date == reduced_forecast[j].date) {
                const f_no_date = JSON.parse(JSON.stringify(
                    reduced_forecast[j]
                ));
                delete f_no_date.date;

                recommendations_with_weather.push({
                    ...data[i],
                    ...f_no_date
                });

                matched = true;
                break;
            }
        }

        if (!matched) {
            recommendations_with_weather.push({
                ...data[i],
                "maxtemp_c": undefined,
                "maxtemp_f": undefined,
                "mintemp_c": undefined,
                "mintemp_f": undefined,
                "avgtemp_c": undefined,
                "avgtemp_f": undefined,
                "maxwind_mph": undefined,
                "maxwind_kph": undefined,
                "totalprecip_mm": undefined,
                "totalprecip_in": undefined,
                "totalsnow_cm": undefined,
                "avgvis_km": undefined,
                "avgvis_miles": undefined,
                "avghumidity": undefined,
                "daily_will_it_rain": undefined,
                "daily_chance_of_rain": undefined,
                "daily_will_it_snow": undefined,
                "daily_chance_of_snow": undefined,
                "condition": {
                  "text": undefined,
                  "icon": undefined,
                  "code": undefined
                },
                "uv": undefined
            });
        }
    }

    res.status(200).json(recommendations_with_weather);
  }
  catch (err) {
    console.error(err);
    if (err == 1)
      res.status(400).json({"error": "No city nor latitude/longitude provided"});
    else
      res.status(500).json({"error": "An unexpected error occurred in server :/"});
  }
};
