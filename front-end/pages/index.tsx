import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import ArticlesOverviewTableByToday from '@components/articles/ArticlesOverviewTableByToday';
import styles from '@styles/home.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


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
        <meta name="description" content="Your daily news source" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <Header />
        <main className="">
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Welcome to The Voyager!</h1>
        </div>
        <ArticlesOverviewTableByToday />
        </main>
      </div>
    </>
  );
};

export default Home;

