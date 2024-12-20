import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import ArticleService from '@services/ArticleService';
import styles from '@styles/articleForm.module.css';

const EditArticle: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('Title');
  const [summary, setSummary] = useState('Summary');
  const [picture, setPicture] = useState('https://via.placeholder.com/150');
  const [articleType, setArticleType] = useState('Article type');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user || !user.token) {
      setError('You must be logged in to edit an article.');
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
      setError('Failed to update article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Article</title>
      </Head>
      <Header />
      <br /><br />
      <main className={styles.formContainer}>
        <h1>Edit Article</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="picture">Picture URL</label>
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
            <label htmlFor="articleType">Article Type</label>
            <select
              id="articleType"
              value={articleType}
              onChange={(e) => setArticleType(e.target.value)}
              required
            >
              <option value="Informatif">Informatif</option>
              <option value="Job add">Job add</option>
              <option value="product add">product add</option>
              <option value="sport">sport</option>
              <option value="politics">politics</option>
              <option value="global news">global news</option>
              <option value="show bizz">show bizz</option>
            </select>
          </div>
          <br />
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </main>
    </>
  );
};

export default EditArticle;