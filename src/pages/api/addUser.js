import insertUser from "@/lib/query/insertUser";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const email = session.user.email;
        const result = await insertUser(email);
        if (!result) {
            throw Error(`Could not insert user ${email}`);
        }

        res.redirect(307, "/");
    }
    catch (err) {
        res.redirect(307, "/");
    }
};
