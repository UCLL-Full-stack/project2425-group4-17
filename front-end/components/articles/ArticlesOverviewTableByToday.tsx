import React, { useEffect, useState } from 'react';
import { Article, ReviewInput } from '@types';
import ArticleService from '@services/ArticleService';
import ReviewService from '@services/ReviewService';
import ArticleLikesService from '@services/ArticleLikesService';
import styles from '@styles/home.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const ArticlesOverviewTableByToday: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedArticleId, setExpandedArticleId] = useState<number | null>(null);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState<number | null>(null);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await ArticleService.getArticlesOfToday();
                const sortedData = data.sort((a: Article, b: Article) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
                setArticles(sortedData);
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
            const updatedArticles = await ArticleService.getArticlesOfToday();
            const sortedUpdatedArticles = updatedArticles.sort((a: Article, b: Article) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
            setArticles(sortedUpdatedArticles);
        } catch (err) {
            setReviewError('Failed to create review.');
        } finally {
            setReviewLoading(false);
        }
    };

    const handleLikeArticle = async (articleId: number) => {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (!user || !user.token) {
            alert('You must be logged in to like an article.');
            return;
        }

        const article = articles.find(article => article.id === articleId);
        if (!article) {
            alert('Article not found.');
            return;
        }
        try {
            await ArticleLikesService.createArticleLike(articleId, user.token);
            const updatedArticles = await ArticleService.getArticlesOfToday();
            const sortedUpdatedArticles = updatedArticles.sort((a: Article, b: Article) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
            setArticles(sortedUpdatedArticles);
        } catch (err) {
            alert('You have already liked this article.');
        }
    };

    const filteredArticles = articles.filter(article => article.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <h1>Today's Articles</h1>
            <input
                type="text"
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles['search-input']}
            />
            {filteredArticles.length === 0 ? (
                <p>No articles found.</p>
            ) : (
                <table className={`${styles.table} ${styles['table-hover']}`}>
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Article Type</th>
                            <th scope="col">Total Likes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map((article) => (
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
                                            <div className={styles['article-details']}>
                                                <h1>{article.title}</h1>
                                                <div className={styles['grid-article-details']}>
                                                    <div>
                                                        <p>{article.summary}</p>
                                                    </div>
                                                    <div>
                                                        <img src={article.picture} alt={article.title} className={styles['article-image']} /> 
                                                    </div>
                                                </div>
                                                <p className={styles.author}>By: {article.user.username}</p>
                                                <hr></hr>
                                                <div className={styles['grid-article-details-like']}>
                                                    <div>
                                                        <button className={styles['like-button']} onClick={() => article.id !== undefined && handleLikeArticle(article.id)}>
                                                            <i className="fa-regular fa-thumbs-up"></i>{' '}
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <p className={styles['published-at']}>
                                                            Published at:{' '}
                                                            {new Date(article.publishedAt).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <br />
                                                <div className={styles.reviews}>
                                                    <h3>Reviews:</h3>
                                                    {article.reviews.length === 0 ? (
                                                        <p>No reviews found.</p>
                                                    ) : (
                                                        <ul>
                                                            {article.reviews.map((review) => (
                                                                <li key={review.id}>
                                                                    <strong>{review.title}</strong>
                                                                    <p>{review.content}</p>
                                                                    <br />
                                                                    <p>{Array.from({ length: review.rating }, (_, i) => (
                                                                        <i key={i} className="fa-solid fa-star"></i>
                                                                    ))}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div className={styles['review-form']}>
                                                    <br /><br /><br />
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
                                                            <label htmlFor="reviewRating">Rating (1-5)</label>
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