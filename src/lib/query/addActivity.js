import connectionPool from "@/lib/db";

export default async function addActivity(activity) {
  const precipitation = 0;
  const visibility = 25;
  const {
    owner,
    name,
    min_temp,
    max_temp,
    wind,
    humidity,
    uv
  } = activity;
  const query = `INSERT INTO public."Activity" ("owner", "name", "max_temperature", "min_temperature", "wind",
  "humidity", "uv", "precipitation", "visibility") VALUES 
  ('${owner}', '${name}', ${max_temp}, ${min_temp}, ${wind}, ${humidity}, ${uv}, ${precipitation}, ${visibility})`;
  console.log(query);
  await connectionPool.query(query);
};
