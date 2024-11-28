import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/home.module.css';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>The Voyager</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className={styles.main}>
        <span>
          <h1>Welcome!</h1>
        </span>

        <div className={styles.description}>
          <p>
            Info about The Voyager.
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;