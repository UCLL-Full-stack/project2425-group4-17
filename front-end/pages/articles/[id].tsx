import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import ArticleService from '@services/ArticleService';
import styles from '@styles/articleForm.module.css';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { GetServerSideProps } from 'next';

const EditArticle: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('Title');
  const [summary, setSummary] = useState('Summary');
  const [picture, setPicture] = useState('https://via.placeholder.com/150');
  const [articleType, setArticleType] = useState('Article type');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user || !user.token) {
      setError(t('editArticle.errorLogin'));
      setLoading(false);
      return;
    }

    const articleData = {
      title,
      summary,
      picture,
      articleType,
    };

    try {
      await ArticleService.updateArticle(id as string, articleData, user.token);
      router.push('/user');
    } catch (err) {
      setError(t('editArticle.errorUpdate'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('editArticle.editArticle')}</title>
      </Head>
      <Header />
      <br /><br />
      <main className={styles.formContainer}>
        <h1>{t('editArticle.editArticle')}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">{t('editArticle.title')}</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="summary">{t('editArticle.summary')}</label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="picture">{t('editArticle.pictureUrl')}</label>
            <input
              type="text"
              id="picture"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              required
            />
          </div>
          <div>
            <br />
            <label htmlFor="articleType">{t('editArticle.articleType')}</label>
            <select
              id="articleType"
              value={articleType}
              onChange={(e) => setArticleType(e.target.value)}
              required
            >
              <option value="Informatif">{t('editArticle.informative')}</option>
              <option value="Job add">{t('editArticle.jobAdd')}</option>
              <option value="product add">{t('editArticle.productAdd')}</option>
              <option value="sport">{t('editArticle.sport')}</option>
              <option value="politics">{t('editArticle.politics')}</option>
              <option value="global news">{t('editArticle.globalNews')}</option>
              <option value="show bizz">{t('editArticle.showBizz')}</option>
            </select>
          </div>
          <br />
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? t('editArticle.saving') : t('editArticle.save')}
          </button>
        </form>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "editArticle"])),
    },
  };
};

export default EditArticle;
