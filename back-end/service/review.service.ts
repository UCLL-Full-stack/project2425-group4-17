import { Review } from '../model/review';
import reviewDB from '../repository/review.db';
import userDB from '../repository/user.db';
import articleDB from '../repository/article.db';
import { ReviewInput } from '../types';

const getAllReviews = async (): Promise<Review[]> => {
    return await reviewDB.getAllReviews();
};

const createReview = async (reviewData: ReviewInput, userId: number, articleId: number): Promise<Review> => {
    const user = await userDB.getUserById({ id: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const article = await articleDB.getArticleById(articleId);
    if (!article) {
        throw new Error('Article not found');
    }

    const review = new Review({
        title: reviewData.title,
        content: reviewData.content,
        rating: reviewData.rating,
        userId: userId,
        articleId: articleId,
    });

    return await reviewDB.addReview(review);
};

const editReview = async (id: number, updates: Partial<{ content: string; rating?: number }>, userId: number, userRole: string): Promise<Review | null> => {
    const review = await reviewDB.getReviewById(id);
    if (!review) {
        throw new Error('Review not found');
    }

    if (review.getUserid() !== userId && userRole !== 'admin') {
        throw new Error('Unauthorized: Only the author or an admin can edit this review');
    }

    return await reviewDB.editReview(id, updates);
};

const deleteReview = async (id: number, userId: number, userRole: string): Promise<void> => {
    const review = await reviewDB.getReviewById(id);
    if (!review) {
        throw new Error('Review not found');
    }

    if (review.getUserid() !== userId && userRole !== 'admin') {
        throw new Error('Unauthorized: Only the author or an admin can delete this review');
    }

    await reviewDB.deleteReview(id);
};

export default {
    getAllReviews,
    createReview,
    editReview,
    deleteReview,
};