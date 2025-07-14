// components/FilterMenu.jsx
import React from 'react';
import styles from '@/styles/FilterMenu.module.css';

// Opciones que mostraremos en los filtros. Puedes agregar más.
const AÑOS_DISPONIBLES = ['2019', '2015', '2010', '2008', '2000'];
const SEXOS_DISPONIBLES = [
  { value: 'SEX_BTSX', label: 'Ambos Sexos' },
  { value: 'SEX_MLE', label: 'Hombres' },
  { value: 'SEX_FMLE', label: 'Mujeres' },
];

export default function FilterMenu({ isOpen, onClose, filters, onFilterChange }) {
  // Aplicamos una clase CSS para mostrar u ocultar el menú
  const menuClass = isOpen ? `${styles.menu} ${styles.open}` : styles.menu;

  return (
    <>
      {/* Fondo oscuro semi-transparente que aparece cuando el menú está abierto */}
      {isOpen && <div className={styles.backdrop} onClick={onClose}></div>}
      
      <div className={menuClass}>
        <div className={styles.menuHeader}>
          <h3>Filtrar Datos</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <div className={styles.menuContent}>
          <div className={styles.filterGroup}>
            <label htmlFor="year-select">Año:</label>
            <select
              id="year-select"
              value={filters.year}
              onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
            >
              {AÑOS_DISPONIBLES.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="sex-select">Sexo:</label>
            <select
              id="sex-select"
              value={filters.sex}
              onChange={(e) => onFilterChange({ ...filters, sex: e.target.value })}
            >
              {SEXOS_DISPONIBLES.map(sexo => (
                <option key={sexo.value} value={sexo.value}>{sexo.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}