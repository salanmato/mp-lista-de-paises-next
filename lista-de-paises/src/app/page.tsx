import styles from "./page.module.css";
import AllCountries from "./allCountries/page";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <header className={styles.header}><h1>Lista de Países</h1></header>
      </div>
      <AllCountries />
    </main>
  );
}
