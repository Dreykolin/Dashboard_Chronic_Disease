import styles from '@/styles/MainPage.module.css';
import Coropletico from '@/components/Coropletico'

export default function RecommendationWrapper() {
  return (
    <div className={styles.recWrap}>
      <Coropletico />
    </div>
  );
}
