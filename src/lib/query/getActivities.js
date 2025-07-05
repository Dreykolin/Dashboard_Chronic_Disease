import connectionPool from "@/lib/db";

export async function getActivities() {
  const query = 'SELECT * FROM public."Activity"';
  let activities = await connectionPool.query(query);
  return activities.rows;
};

export async function getActivitiesFromUser(user) {
  const query = `SELECT * FROM public."Activity" WHERE owner='${user}'`;
  let activities = await connectionPool.query(query);
  return activities.rows;
}