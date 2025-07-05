import React from 'react';
import styles from '@/styles/home/DayButton.module.css';

function DayButton({ day, isSelected, onClick }) {
  const buttonClassName = `${styles.day_button} ${isSelected ? styles.selected : ''}`;
  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={() => onClick(day)}
    >
      {day}
    </button>
  );
}

export default DayButton;
