import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Article, ReviewInput } from '@types';
import ArticleService from '@services/ArticleService';
import ReviewService from '@services/ReviewService';
import ArticleLikesService from '@services/ArticleLikesService';
import styles from '@styles/home.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ArticlesOverviewTableByToday: React.FC = () => {
    const { t } = useTranslation();
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
                setError(t('articleOverview.errorNotFetched'));
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [t]);

    const toggleArticleDetails = (id: number) => {
        setExpandedArticleId(expandedArticleId === id ? null : id);
    };

    const handleCardClick = (id: number) => {
        if (expandedArticleId === id) {
            return;
        }
        toggleArticleDetails(id);
    };

    const handleReviewSubmit = async (articleId: number) => {
        setReviewLoading(true);
        setReviewError(null);

        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (!user || !user.token) {
            setReviewError(t('articleOverview.errorNotLoggedIn'));
            setReviewLoading(false);
            return;
        }

        const article = articles.find(article => article.id === articleId);
        if (!article) {
            setReviewError(t('articleOverview.errorNotFound'));
            setReviewLoading(false);
            return;
        }

        if (article.user.id === user.id) {
            setReviewError(t('articleOverview.errorOwn'));
            setReviewLoading(false);
            return;
        }

        if (article.reviews.some(review => review.user.id === user.id)) {
            setReviewError(t('articleOverview.errorAlreadyLiked'));
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
            setReviewError(t('articleOverview.errorCreateReview'));
        } finally {
            setReviewLoading(false);
        }
    };

    const handleLikeArticle = async (articleId: number) => {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (!user || !user.token) {
            alert(t('articleOverview.errorNotLoggedIn'));
            return;
        }

        const article = articles.find(article => article.id === articleId);
        if (!article) {
            alert(t('articleOverview.errorNotFound'));
            return;
        }
        try {
            await ArticleLikesService.createArticleLike(articleId, user.token);
            const updatedArticles = await ArticleService.getArticlesOfToday();
            const sortedUpdatedArticles = updatedArticles.sort((a: Article, b: Article) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
            setArticles(sortedUpdatedArticles);
        } catch (err) {
            alert(t('articleOverview.errorAlreadyLiked'));
        }
    };

    const filteredArticles = articles.filter(article => article.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return <p>{t('loading', 'Loading...')}</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.subTitle}>{t('articleOverview.Today')}</h1>
            <div className={styles['search-container']}>
                <input
                    type="text"
                    placeholder={t('articleOverview.listTitle')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles['search-input']}
                />
            </div>
            {filteredArticles.length === 0 ? (
                <p>{t('articleOverview.notFound')}</p>
            ) : (
                <div className={styles.articlesGrid}>
                    {filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            className={`${styles.articleCard} ${expandedArticleId === article.id ? styles.expanded : ''}`}
                            onClick={() => article.id !== undefined && handleCardClick(article.id)}
                        >
                            {expandedArticleId === article.id && (
                                <i
                                    className={`fa-solid fa-xmark ${styles.closeIcon}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        article.id !== undefined && toggleArticleDetails(article.id);
                                    }}
                                ></i>
                            )}
                            <h2
                                onClick={(e) => {
                                    e.stopPropagation();
                                    article.id !== undefined && toggleArticleDetails(article.id);
                                }}
                            >
                                {article.title}
                            </h2>
                            <p className={styles.articleType}>{article.articleType}</p>
                            <p className={styles.articleLikes}>{article.articleLikes.length} {t('articleOverview.Likes')}</p>
                            {expandedArticleId === article.id && (
                                <div className={styles.articleDetails} onClick={(e) => e.stopPropagation()}>
                                    <div>
                                        <p>{article.summary}</p>
                                    </div>
                                    <div>
                                        <img src={article.picture} alt={article.title} className={styles['article-image']} />
                                    </div>
                                    <p className={styles.author}>{t('articleOverview.by')} {article.user.username}</p>
                                    <hr />
                                    <div className={styles['grid-article-details-like']}>
                                        <div>
                                            <button className={styles['like-button']} onClick={() => article.id !== undefined && handleLikeArticle(article.id)}>
                                                <i className="fa-regular fa-thumbs-up"></i>{' '} {article.articleLikes.length}
                                            </button>
                                        </div>
                                        <div>
                                            <p className={styles['published-at']}>
                                                {t('articleOverview.publishedAt')}{' '}
                                                {new Date(article.publishedAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <br />
                                    <div className={styles.reviews}>
                                        <h3>{t('articleOverview.review')}</h3>
                                        {article.reviews.length === 0 ? (
                                            <p>{t('articleOverview.reviewsNotFound')}</p>
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
                                        <h3>{t('articleOverview.write')}</h3>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                article.id !== undefined && handleReviewSubmit(article.id);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div>
                                                <label htmlFor="reviewTitle">{t('articleOverview.listTitle')}</label>
                                                <input
                                                    type="text"
                                                    id="reviewTitle"
                                                    value={reviewTitle}
                                                    onChange={(e) => setReviewTitle(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="reviewContent">{t('articleOverview.content')}</label>
                                                <textarea
                                                    id="reviewContent"
                                                    value={reviewContent}
                                                    onChange={(e) => setReviewContent(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="reviewRating">{t('articleOverview.rating')} (1-5)</label>
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
                                                {reviewLoading ? t('loading', 'Submitting...') : t('articleOverview.submit', 'Submit Review')}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArticlesOverviewTableByToday;
