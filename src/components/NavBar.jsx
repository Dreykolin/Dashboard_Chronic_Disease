import React from 'react';
import styles from '@/styles/NavBar.module.css';
import { FaUserCircle, FaChartBar, FaTable, FaCog } from 'react-icons/fa';

function NavBar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <FaChartBar size={24} color="#ff5233" />
          <span>Chronic Disease Super Dashboard</span>
        </div>
      </div>
      
      <div className={styles.center}>
        <a href="#" className={`${styles.navLink} ${styles.active}`}>Coropletico</a>
        <a href="#" className={styles.navLink}>Estadísticas</a>
        <a href="#" className={styles.navLink}>Datos Crudos</a>
      </div>
    </nav>
  );
}

export default NavBar;