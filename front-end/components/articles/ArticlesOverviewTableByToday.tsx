import React, { useEffect, useState } from 'react';
import { Article, ReviewInput } from '@types';
import ArticleService from '@services/ArticleService';
import ReviewService from '@services/ReviewService';

const ArticlesOverviewTableByToday: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedArticleId, setExpandedArticleId] = useState<number | null>(null);

    // Review form states
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState<number | null>(null);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [reviewLoading, setReviewLoading] = useState(false);

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

    const handleReviewSubmit = async (articleId: number) => {
        setReviewLoading(true);
        setReviewError(null);

        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (!user || !user.token) {
            setReviewError('You must be logged in to create a review.');
            setReviewLoading(false);
            return;
        }

        const article = articles.find(article => article.id === articleId);
        if (!article) {
            setReviewError('Article not found.');
            setReviewLoading(false);
            return;
        }

        if (article.user.id === user.id) {
            setReviewError('You cannot review your own article.');
            setReviewLoading(false);
            return;
        }

        if (article.reviews.some(review => review.user.id === user.id)) {
            setReviewError('You have already reviewed this article.');
            setReviewLoading(false);
            return;
        }

        try {
            const reviewData: ReviewInput = {
                title: reviewTitle,
                content: reviewContent,
                rating: reviewRating ?? undefined,
                articleId: articleId,
            };
            await ReviewService.createReview(reviewData, user.token);
            setReviewTitle('');
            setReviewContent('');
            setReviewRating(null);
            // Refresh the article list to show the new review
            const updatedArticles = await ArticleService.getArticlesOfToday();
            setArticles(updatedArticles);
        } catch (err) {
            setReviewError('Failed to create review.');
        } finally {
            setReviewLoading(false);
        }
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
                                <tr
                                    onClick={() => article.id !== undefined && toggleArticleDetails(article.id)}
                                    style={{ cursor: 'pointer' }}
                                >
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
                                                <p>
                                                    Published at:{' '}
                                                    {new Date(article.publishedAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
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
                                                <h3>Write a Review:</h3>
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        article.id !== undefined && handleReviewSubmit(article.id);
                                                    }}
                                                >
                                                    <div>
                                                        <label htmlFor="reviewTitle">Title</label>
                                                        <input
                                                            type="text"
                                                            id="reviewTitle"
                                                            value={reviewTitle}
                                                            onChange={(e) => setReviewTitle(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="reviewContent">Content</label>
                                                        <textarea
                                                            id="reviewContent"
                                                            value={reviewContent}
                                                            onChange={(e) => setReviewContent(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="reviewRating">Rating</label>
                                                        <input
                                                            type="number"
                                                            id="reviewRating"
                                                            value={reviewRating || ''}
                                                            onChange={(e) => setReviewRating(Number(e.target.value))}
                                                            min="0"
                                                            max="5"
                                                            required
                                                        />
                                                    </div>
                                                    {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}
                                                    <button type="submit" disabled={reviewLoading}>
                                                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                </form>
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
