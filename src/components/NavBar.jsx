import React from 'react';
import styles from '@/styles/NavBar.module.css';
import { FaUserCircle, FaChartBar, FaTable, FaCog } from 'react-icons/fa';

function NavBar({ setActiveTab, activeTab }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <FaChartBar size={24} color="#ff5233" />
          <span>Chronic Disease Super Dashboard</span>
        </div>
      </div>

      <div className={styles.center}>
        <button
          className={`${styles.navLink} ${activeTab === 'Coropletico' ? styles.active : ''}`}
          onClick={() => setActiveTab('Coropletico')}
        >
          Coroplético
        </button>
        <button
          className={`${styles.navLink} ${activeTab === 'Estadísticas' ? styles.active : ''}`}
          onClick={() => setActiveTab('Estadísticas')}
        >
          Estadísticas
              </button>
         <button
  className={`${styles.navLink} ${activeTab === 'Estadísticas2' ? styles.active : ''}`}
  onClick={() => setActiveTab('Estadísticas2')}
>
                  Comparativa de enfermedades
              </button>

        <button
          className={`${styles.navLink} ${activeTab === 'Datos Crudos' ? styles.active : ''}`}
          onClick={() => setActiveTab('Datos Crudos')}
        >
          Datos Crudos
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
