import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import addActivity from "@/lib/query/addActivity";
import deleteActivity from "@/lib/query/deleteActivity";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    if (!req.query.id_activity)
      throw "No Activity provided";
    const id_activity = req.query.id_activity;
    await deleteActivity(id_activity);
    res.status(200).json({ message: "Activity deleted successfully", user: session.user });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
}
