import express, { Request, Response, NextFunction } from 'express';
import articleLikesService from '../service/articlelikes.service';
import { Request as JwtRequest, UnauthorizedError } from 'express-jwt';

const articleLikesRouter = express.Router();

/**
 * @swagger
 * /articlelikes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Like an article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 description: ID of the article to like
 *     responses:
 *       201:
 *         description: Article successfully liked.
 */
articleLikesRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.body;
        const psdRequest = <JwtRequest>req;
        const userId = psdRequest.auth?.id;

        if (!userId) {
            throw new UnauthorizedError('credentials_required', { message: 'Missing credentials' });
        }

        const articleLike = await articleLikesService.createArticleLike({ userId, articleId });
        res.status(201).json(articleLike);
    } catch (error) {
        next(error);
    }
});

export { articleLikesRouter };