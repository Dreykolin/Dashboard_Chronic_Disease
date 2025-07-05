import React from 'react';
import DayButton from './DayButton';
import styles from '@/styles/home/WeekDaySelector.module.css';

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function WeekdaySelector({ selectedDay, onDayChange }) {
  const currentDay = new Date();
  
  const today = DAYS_OF_WEEK[(currentDay.getDay() + 6 ) % 7];
  const tomorrow = DAYS_OF_WEEK[currentDay.getDay() % 7];
  const dayAfterTomorrow = DAYS_OF_WEEK[(currentDay.getDay() + 1) % 7];

  const daysToDisplay = [
    {
      display: 'Hoy',
      actualDay: today,
    },
    {
      display: tomorrow,
      actualDay: tomorrow,
    },
    {
      display: dayAfterTomorrow,
      actualDay: dayAfterTomorrow,
    },
  ];

  //console.log('selectedDay:', selectedDay);
  //daysToDisplay.forEach(d => console.log('actualDay:', d.actualDay));

  return (
    <div className={styles.weekday_selector}>
      {daysToDisplay.map((dayInfo) => (
        <DayButton key={dayInfo.actualDay}
          day={dayInfo.display}
          isSelected={selectedDay === dayInfo.actualDay}
          onClick={() => onDayChange(dayInfo.actualDay)}
        />
      ))}
    </div>
  );
}

export default WeekdaySelector;