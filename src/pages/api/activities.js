import { getActivities, getActivitiesFromUser } from "@/lib/query/getActivities";

export default async function handler(req, res) {
  try {
    const email = req.query.email;
<<<<<<< HEAD
=======
    // const example_user = "cano28";
    if (!email)
      throw "No email provided";

>>>>>>> frontend
    const activities = await getActivitiesFromUser(email);
    let data = [];
    activities.map(a => {
      data.push({
        id_activity: a.id_activity,
        name: a.name,
        temp: a.temperature,
        max_temp: a.max_temperature,
        min_temp: a.min_temperature,
        wind: a.wind,
        humidity: a.humidity,
        uv: a.uv
      });
    });
    res.status(200).json(data);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({"error": "An unexpected error occurred in server :/"});
  }
};
