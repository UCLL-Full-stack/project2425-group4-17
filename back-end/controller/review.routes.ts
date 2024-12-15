import express, { Request, Response, NextFunction } from 'express';
import reviewService from '../service/review.service';
import { ReviewInput } from '../types';
import { Request as JwtRequest, UnauthorizedError } from 'express-jwt';

const reviewRouter = express.Router();

/**
 * @swagger
 * /reviews:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all reviews
 *     responses:
 *       200:
 *         description: A list of reviews.
 */
reviewRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the review
 *                 example: "Great article!"
 *               content:
 *                 type: string
 *                 description: Content of the review
 *                 example: "This article was very informative and well-written."
 *               rating:
 *                 type: integer
 *                 description: Rating of the review (0-5)
 *                 example: 5
 *               articleId:
 *                 type: integer
 *                 description: ID of the article being reviewed
 *                 example: 1
 *     responses:
 *       201:
 *         description: Review successfully created.
 */
reviewRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewData: ReviewInput = req.body;
        //console.log(reviewData);
        const psdRequest = <JwtRequest>req;
        const userId = psdRequest.auth?.id;

        if (!userId) {
            throw new UnauthorizedError('credentials_required', { message: 'Missing credentials' });
        }

        const newReview = await reviewService.createReview(reviewData, userId, reviewData.articleId);
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Edit an existing review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       200:
 *         description: Review successfully updated.
 */
reviewRouter.put('/:id', async (req: Request<{ id: string }, {}, { title?: string; content?: string; rating?: number }>, res: Response, next: NextFunction) => {
    try {
        const reviewId = parseInt(req.params.id, 10);
        const updates = req.body;
        const psdRequest = <JwtRequest>req;
        const userId = psdRequest.auth?.id;
        const userRole = psdRequest.auth?.role;

        if (!userId || !userRole) {
            throw new UnauthorizedError('credentials_required', { message: 'Missing credentials' });
        }

        const updatedReview = await reviewService.editReview(reviewId, updates, userId, userRole);
        if (updatedReview) {
            res.status(200).json(updatedReview);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID to delete
 *     responses:
 *       204:
 *         description: Review successfully deleted.
 */
reviewRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const reviewId = parseInt(req.params.id, 10);
        const psdRequest = <JwtRequest>req;
        const userId = psdRequest.auth?.id;
        const userRole = psdRequest.auth?.role;

        if (!userId || !userRole) {
            throw new UnauthorizedError('credentials_required', { message: 'Missing credentials' });
        }

        await reviewService.deleteReview(reviewId, userId, userRole);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

export { reviewRouter };