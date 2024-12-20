import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import ArticleService from '@services/ArticleService';
import styles from '@styles/articleForm.module.css';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from 'next';

const CreateArticle: React.FC = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [picture, setPicture] = useState('');
  const [articleType, setArticleType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user || !user.token) {
      setError(t('createArticle.errorNoLogin'));
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
      await ArticleService.createArticle(articleData, user.token);
      router.push('/');
    } catch (err) {
      setError(t('createArticle.errorFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('createArticle.pageTitle')}</title>
      </Head>
      <Header />
      <br /><br />
      <main className={styles.formContainer}>
        <h1>{t('createArticle.formTitle')}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">{t('createArticle.title')}</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="summary">{t('createArticle.summary')}</label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="picture">{t('createArticle.picture')}</label>
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
            <label htmlFor="articleType">{t('createArticle.articleType')}</label>
            <select
              id="articleType"
              value={articleType}
              onChange={(e) => setArticleType(e.target.value)}
              required
            >
              <option value="">{t('createArticle.selectArticleType')}</option>
              <option value="Informatif">{t('createArticle.options.informatif')}</option>
              <option value="Job add">{t('createArticle.options.jobAdd')}</option>
              <option value="product add">{t('createArticle.options.productAdd')}</option>
              <option value="sport">{t('createArticle.options.sport')}</option>
              <option value="politics">{t('createArticle.options.politics')}</option>
              <option value="global news">{t('createArticle.options.globalNews')}</option>
              <option value="show bizz">{t('createArticle.options.showBizz')}</option>
            </select>
          </div>
          <br />
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? t('createArticle.creating') : t('createArticle.submitButton')}
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
          ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
  };
};

export default CreateArticle;
