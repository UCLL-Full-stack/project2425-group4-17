import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import ArticlesOverviewTableByToday from '@components/articles/ArticlesOverviewTableByToday';
import styles from '@styles/home.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { GetServerSideProps } from 'next';


const Home: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user || !user.token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{t('app.title')}</title>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
  };
};

export default Home;

