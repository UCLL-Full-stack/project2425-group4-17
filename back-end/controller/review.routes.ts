/*

import express, { Request, Response, NextFunction } from 'express';
import reviewService from '../service/review.service';

const reviewRouter = express.Router();

reviewRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
});

reviewRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const review = await reviewService.getReviewById(id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
});

reviewRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewData = req.body;
        const review = await reviewService.createReview(reviewData);
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
});

reviewRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updates = req.body;
        const review = await reviewService.updateReview(id, updates);
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
});

reviewRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        await reviewService.deleteReview(id);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export { reviewRouter };
*/
