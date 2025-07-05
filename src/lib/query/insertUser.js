import connectionPool from "@/lib/db";

export default async function insertUser(email) {
    const query_key = 'INSERT INTO public."User"("username", "email") VALUES($1, $2)';
    const query_values = [email, email];
    const query_result = await connectionPool.query(query_key, query_values);

    return !!query_result;
};
