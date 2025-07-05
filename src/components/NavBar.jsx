import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/NavBar.module.css';

import LogButton from "@/components/home/LogButton";

import { useSession } from "next-auth/react";

function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();

  const PerfilLoad = () => {
    router.push('/perfil');
  };
  const MenuLoad = () => {
    router.push('/');
  };

  const userImageSrc = session ? session.user.image : '/usuario.png';

  return (
    <div className={styles.navbar}>
      <div className={styles.left}></div>

      <div className={styles.center}>
        <button className={styles.userButton} onClick={MenuLoad}>
          <img src="./logo.png" alt="Logo" className={styles.logo} />
        </button>
      </div>

      <div className={styles.right}>
        <LogButton />
        <button className={styles.userButton} onClick={PerfilLoad}>
          <img src={userImageSrc} alt="User" className={styles.userImg} />
        </button>
      </div>
    </div>
  );
}

export default NavBar;