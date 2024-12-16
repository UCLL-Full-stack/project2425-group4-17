import React, { useEffect, useState } from 'react';
import { Article } from '@types';
import ArticleService from '@services/ArticleService';

const ArticlesOverviewTableByToday: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedArticleId, setExpandedArticleId] = useState<number | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await ArticleService.getArticlesOfToday();
                setArticles(data);
            } catch (err) {
                setError('Failed to fetch articles.');
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const toggleArticleDetails = (id: number) => {
        setExpandedArticleId(expandedArticleId === id ? null : id);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Today's Articles</h1>
            {articles.length === 0 ? (
                <p>No articles found.</p>
            ) : (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Article Type</th>
                            <th scope="col">Total Likes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <React.Fragment key={article.id}>
                                <tr onClick={() => toggleArticleDetails(article.id)} style={{ cursor: 'pointer' }}>
                                    <td>{article.title}</td>
                                    <td>{article.articleType}</td>
                                    <td>{article.articleLikes.length}</td>
                                </tr>
                                {expandedArticleId === article.id && (
                                    <tr>
                                        <td colSpan={3}>
                                            <div>
                                                <h2>{article.title}</h2>
                                                <p>{article.summary}</p>
                                                <img src={article.picture} alt={article.title} />
                                                <p>By: {article.user.username}</p>
                                                <p>Published at: {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <h3>Reviews:</h3>
                                                {article.reviews.length === 0 ? (
                                                    <p>No reviews found.</p>
                                                ) : (
                                                    <ul>
                                                        {article.reviews.map((review) => (
                                                            <li key={review.id}>
                                                                <strong>{review.title}</strong>
                                                                <p>{review.content}</p>
                                                                <p>Rating: {review.rating}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ArticlesOverviewTableByToday;