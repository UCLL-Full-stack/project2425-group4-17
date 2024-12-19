import React, { useEffect, useState } from 'react';
import PaperService from '../../services/PaperService'; // Import PaperService
import { PaperInput } from '../../types';

const ArticlesToday: React.FC = () => {
  const [articles, setArticles] = useState<PaperInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    return today;
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const papers = await PaperService.getAllPapers(); // Use PaperService to fetch papers
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
    <div>
      <h1>Articles for {selectedDate}</h1>
      <label>
        Select date:
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </label>
      {articles.length === 0 ? (
        <p>No articles found for the selected date.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <h2>{article.namePaper}</h2>
              <p>Publisher: {article.namePublisher}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArticlesToday;
