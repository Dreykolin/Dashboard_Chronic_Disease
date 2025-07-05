import React, { useState, useEffect } from 'react';
import DailyRecommendation from './DailyRecommendation';
import WeekdaySelector from './WeekDaySelector';

import styles from '@/styles/home/WeeklyRecommendation.module.css';

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const getDayNameFromDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  const dayIndex = date.getDay(); 
  const adjustedIndex = (dayIndex + 6) % 7;
  return DAYS_OF_WEEK[adjustedIndex];
};


function WeeklyRecommendations({ recs }) {
  const [currentDayName, setCurrentDayName] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);

  useEffect(() => {
    if (recs && recs.length > 0) {
      const todayObj = new Date();
    const todayDayIndex = (todayObj.getDay() + 6) % 7; // Monday = 0
    const actualTodayName = DAYS_OF_WEEK[todayDayIndex];
    //console.log("Recs raw:", recs);
    console.log(recs[0].day)

    //console.log("Recs days:", recs.map(r => getDayNameFromDate(r.day)));
    //console.log("Today should be:", actualTodayName);

    let dataForToday = recs.find(r => getDayNameFromDate(r.date) === actualTodayName);

    if (dataForToday) {
      setCurrentDayName(actualTodayName);
      setSelectedDayData(dataForToday);
    } else {
      const firstDayNameInRecs = getDayNameFromDate(recs[0].date);
      setCurrentDayName(firstDayNameInRecs);
      setSelectedDayData(recs[0]);
    }
  } else {
    setCurrentDayName('');
    setSelectedDayData(null);
  }
}, [recs]);

  const handleDayChange = (newDayName) => {
    setCurrentDayName(newDayName);
    if (recs) {
      const newSelectedData = recs.find(r => getDayNameFromDate(r.date) === newDayName);
      setSelectedDayData(newSelectedData || null);
    }
  };

  return (
    <div className={styles.weekly_wrapper}>
      {/*<p>
        Selected Day: <strong>{currentDayName || 'None'}</strong>
      </p>*/}
      <WeekdaySelector selectedDay={currentDayName} onDayChange={handleDayChange} />

      {selectedDayData ? (
        <DailyRecommendation
          key={selectedDayData.date} 
          weekDayName={currentDayName}
          dayData={selectedDayData}  
        />
      ) : (
        currentDayName && <p>No existen recomendaciones para el día {currentDayName}.</p>
      )}
    </div>
  );
}

export default WeeklyRecommendations;