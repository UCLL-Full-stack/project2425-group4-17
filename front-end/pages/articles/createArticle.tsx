import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import ArticleService from '@services/ArticleService';

const CreateArticle: React.FC = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [picture, setPicture] = useState('');
  const [articleType, setArticleType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user || !user.token) {
      setError('You must be logged in to create an article.');
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
      setError('Failed to create article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Article</title>
      </Head>
      <Header />
      <main>
        <h1>Create Article</h1>
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
            <label htmlFor="articleType">Article Type</label>
            <input
              type="text"
              id="articleType"
              value={articleType}
              onChange={(e) => setArticleType(e.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Article'}
          </button>
        </form>
      </main>
    </>
  );
};

export default CreateArticle;