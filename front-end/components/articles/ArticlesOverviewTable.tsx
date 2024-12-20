import React, { useEffect, useState } from 'react';
import { Article } from '@types';
import { useTranslation } from 'next-i18next';

const ArticlesOverviewTable: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation('common');

    useEffect(() => {
        const fetchArticles = async () => {
            const token = localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser') || '{}').token : null;
            if (!token) {
                setError(t('articles.errorNoToken'));
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setArticles(data);
            } catch (err) {
                setError(t('articles.errorFetch'));
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [t]);

    if (loading) return <p>{t('articles.loading')}</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>{t('articles.allArticles')}</h1>
            {articles.length === 0 ? (
                <p>{t('articles.noArticles')}</p>
            ) : (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">{t('articles.tableHeaders.title')}</th>
                            <th scope="col">{t('articles.tableHeaders.publishedDate')}</th>
                            <th scope="col">{t('articles.tableHeaders.type')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.id}>
                                <td>{article.title}</td>
                                <td>{new Date(article.publishedAt).toLocaleDateString()}</td>
                                <td>{article.articleType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ArticlesOverviewTable;
