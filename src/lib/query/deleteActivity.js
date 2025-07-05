import connectionPool from "@/lib/db";

export default async function deleteActivity(id_activity) {
  const query = `DELETE FROM public."Activity" WHERE id_activity=${id_activity}`;
  console.log(query);
  await connectionPool.query(query);
};
