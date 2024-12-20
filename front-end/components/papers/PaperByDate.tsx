import React, { useEffect, useState } from 'react';
import PaperService from '../../services/PaperService';
import { PaperInput } from '../../types';
import styles from '@styles/paper.module.css';
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const papers = await PaperService.getAllPapers(); 
        const filteredArticles = papers.filter((paper: PaperInput) =>
          paper.date.startsWith(selectedDate)
        );

        setArticles(filteredArticles);
      } catch (err) {
        setError(t("paper.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedDate, t]);

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
      setCreateError(t("paper.createError"));
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("paper.paperClass")} {selectedDate}</h1>
      <label className={styles.label}>
        {t("paper.selectDate")}
        <input type="date" value={selectedDate} onChange={handleDateChange} className={styles.input} />
      </label>
      {articles.length === 0 ? (
        <p>{t("paper.errorNoArticles")}</p>
      ) : (
        <ul className={styles.articlesList}>
          {articles.map((article) => (
            <li key={article.id} className={styles.articleItem}>
              <h2>{article.namePaper}</h2>
              <p>{t("paper.publisher")} {article.namePublisher}</p>
            </li>
          ))}
        </ul>
      )}
      <br /><br />
      <form onSubmit={handleCreatePaper} className={styles.formContainer}>
        <h2>{t("paper.create")}</h2>
        <div>
          <label htmlFor="namePaper">{t("paper.labelName")}</label>
          <input
            type="text"
            id="namePaper"
            value={namePaper}
            onChange={(e) => setNamePaper(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="namePublisher">{t("paper.labelPublisher")}</label>
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
          {createLoading ? t("paper.creating") : t("paper.createButton")}
        </button>
      </form>
    </div>
  );
};

export default PaperByDate;
