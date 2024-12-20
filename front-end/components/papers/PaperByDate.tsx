import React, { useEffect, useState } from 'react';
import PaperService from '../../services/PaperService';
import { PaperInput } from '../../types';
import styles from '@styles/paper.module.css';

const PaperByDate: React.FC = () => {
  const [articles, setArticles] = useState<PaperInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date().toISOString().split('T')[0]; 
    return today;
  });

  const [namePaper, setNamePaper] = useState('');
  const [namePublisher, setNamePublisher] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const papers = await PaperService.getAllPapers(); 
        const filteredArticles = papers.filter((paper: PaperInput) =>
          paper.date.startsWith(selectedDate)
        );

        setArticles(filteredArticles);
      } catch (err) {
        setError('Failed to fetch articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleCreatePaper = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreateLoading(true);
    setCreateError(null);

    try {
      const currentDateTime = new Date().toISOString();
      await PaperService.createPaper({ date: currentDateTime, namePaper, namePublisher });
      setNamePaper('');
      setNamePublisher('');
      // Refresh the articles list
      const papers = await PaperService.getAllPapers(); 
      const filteredArticles = papers.filter((paper: PaperInput) =>
        paper.date.startsWith(selectedDate)
      );
      setArticles(filteredArticles);
    } catch (err) {
      setCreateError('Failed to create paper.');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Paper(s) for {selectedDate}</h1>
      <label className={styles.label}>
        Select date:
        <input type="date" value={selectedDate} onChange={handleDateChange} className={styles.input} />
      </label>
      {articles.length === 0 ? (
        <p>No articles found for the selected date.</p>
      ) : (
        <ul className={styles.articlesList}>
          {articles.map((article) => (
            <li key={article.id} className={styles.articleItem}>
              <h2>{article.namePaper}</h2>
              <p>Publisher: {article.namePublisher}</p>
            </li>
          ))}
        </ul>
      )}
      <br /><br />
      <form onSubmit={handleCreatePaper} className={styles.formContainer}>
        <h2>Create a new paper</h2>
        <div>
          <label htmlFor="namePaper">Paper Name</label>
          <input
            type="text"
            id="namePaper"
            value={namePaper}
            onChange={(e) => setNamePaper(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="namePublisher">Publisher Name</label>
          <input
            type="text"
            id="namePublisher"
            value={namePublisher}
            onChange={(e) => setNamePublisher(e.target.value)}
            required
          />
        </div>
        {createError && <p style={{ color: 'red' }}>{createError}</p>}
        <button type="submit" disabled={createLoading}>
          {createLoading ? 'Creating...' : 'Create Paper'}
        </button>
      </form>
    </div>
  );
};

export default PaperByDate;