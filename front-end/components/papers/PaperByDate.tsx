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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Articles for {selectedDate}</h1>
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
    </div>
  );
};

export default PaperByDate;