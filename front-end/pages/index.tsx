import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import ArticlesOverviewTableByToday from '@components/articles/ArticlesOverviewTableByToday';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user || !user.token) {
      router.push('/login');
    }
  }, [router]);

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
        <ArticlesOverviewTableByToday />
      </main>
    </>
  );
};

export default Home;