import React from 'react';
import styles from '@/styles/home/ActivityRecommendation.module.css'

function ActivityRecommendation({ text, similarity }) {     //Receives recommendation text.
  let hue = 120*similarity;
  //styles.recommendation_color = "background-color: hsl(hue, 100, 85)";
 // style={{ backgroundColor: `hsl(${hue}, 100%, 90%)` }}
 similarity = (similarity*100).toFixed(0); 
 return (
    <li className={styles.recommendation_li}>
      <div className={styles.recommendation_rect}>
        <p>
          {text || 'Recomendaciones de actividades basadas en usuarios + personalizaciones de usuario.'}
        </p>
        <div className={styles.rec_bar}>
          <div
            className={styles.rec_bar_fill}
            style={{
              width: `${similarity}%`,
              backgroundColor: `hsl(${hue}, 100%, 85%)`
            }}
          >
            {similarity}%
          </div>
        </div>
      </div>
    </li>
  );
}

export default ActivityRecommendation;