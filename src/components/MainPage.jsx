import styles from '@/styles/MainPage.module.css';
import Coropletico from '@/components/Coropletico';
import NavBar from '@/components/NavBar';

export default function MainPage() {
  return (
    <div> 
      <NavBar />
      <main className={styles.content}>
        <Coropletico />
      </main>
    </div>
  );
}