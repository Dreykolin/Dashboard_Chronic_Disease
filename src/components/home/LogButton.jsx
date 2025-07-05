import styles from "@/styles/LogButton.module.css";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LogButton() {
    const { data: session } = useSession();
    const [bottomText, setBottomText] = useState(null);

    if (!session) {
        return (
          <div className={styles.githubButtonContainer}>
            <button className={styles.githubButton} onClick={() => signIn("github", { callbackUrl: "/api/addUser" })}>
              Sign in
            </button>
          </div>
        );
    } else {
        return (
          <div className={styles.githubButtonContainer}>
            <button className={styles.githubButton}
             onClick={() => signOut()}
             onMouseEnter={() => setBottomText("Sign out")}
             onMouseLeave={() => setBottomText(session.user.name)}
            >
              {!bottomText && session.user.name}
              {bottomText && bottomText}
            </button>
          </div>
        );
    }
}
