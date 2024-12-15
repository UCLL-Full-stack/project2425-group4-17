import database from '../util/database';
import { Review } from '../model/review';

const getAllReviews = async (): Promise<Review[]> => {
    try {
        const reviewsPrisma = await database.review.findMany({
            include: {
                user: true,
                article: true,
            },
        });
        return reviewsPrisma.map(Review.from);
    } catch (error) {
        console.error(error);
        throw new Error('Error retrieving reviews from database.');
    }
};

const getReviewById = async (id: number): Promise<Review | null> => {
    try {
        const reviewPrisma = await database.review.findUnique({
            where: { id },
            include: {
                user: true,
                article: true,
            },
        });
        return reviewPrisma ? Review.from(reviewPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Error retrieving review from database.');
    }
};

const addReview = async (review: Review): Promise<Review> => {
    try {
        const userId = review.getUserid();
        const articleId = review.getArticleId();
        const reviewPrisma = await database.review.create({
            data: { 
                title: review.getTitle(),
                content: review.getContent(),
                rating: review.getRating() ?? 0,
                user: { connect: { id: review.getUserid() } },
                article: { connect: { id: articleId } },
            },
            include: {
                user: true,
                article: true,
            },
        });
        console.log(reviewPrisma);
        return Review.from(reviewPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error creating review in database.');
    }
};

const editReview = async (id: number, updates: Partial<{ title: string; content: string; rating?: number }>): Promise<Review> => {
    try {
        const reviewPrisma = await database.review.update({
            where: { id },
            data: updates,
            include: {
                user: true,
                article: true,
            },
        });
        return Review.from(reviewPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating review in database.');
    }
};

const deleteReview = async (id: number): Promise<void> => {
    try {
        await database.review.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting review from database.');
    }
};

export default {
    getAllReviews,
    getReviewById,
    addReview,
    editReview,
    deleteReview,
};