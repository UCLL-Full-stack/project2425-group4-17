/*

import reviewDB from '../repository/review.db';
import { Review } from '../model/review';

const getAllReviews = async (): Promise<Review[]> => {
    return await reviewDB.getAllReviews();
};

const getReviewById = async (id: number): Promise<Review | null> => {
    return await reviewDB.getReviewById(id);
};

const createReview = async (data: { title: string; content: string; rating?: number; user: User; article: Article }): Promise<Review> => {
    const newReview = new Review(data);
    return await reviewDB.createReview(newReview);
};

const updateReview = async (id: number, updates: Partial<{ title: string; content: string; rating: number }>): Promise<Review> => {
    return await reviewDB.updateReview(id, updates);
};

const deleteReview = async (id: number): Promise<void> => {
    await reviewDB.deleteReview(id);
};

export default {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
};
*/