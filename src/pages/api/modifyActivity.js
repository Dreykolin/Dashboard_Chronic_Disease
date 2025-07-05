
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import addActivity from "@/lib/query/addActivity";
import deleteActivity from "@/lib/query/deleteActivity";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const email = session.user.email;
  const id_activity = req.query.id_activity;
  const name = req.query.name;
  const min_temp = req.query.min_temp;
  const max_temp = req.query.max_temp;
  const wind = req.query.wind;
  const humidity = req.query.humidity;
  const uv = req.query.uv;

  await deleteActivity(id_activity);
  const activity = {
    owner: email,
    name,
    min_temp,
    max_temp,
    wind,
    humidity,
    uv
  };
  await addActivity(activity);

  res.status(200).json({ message: "This is protected data", user: session.user });
}
