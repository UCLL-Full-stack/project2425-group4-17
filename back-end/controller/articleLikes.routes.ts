import express, { Request, Response, NextFunction } from 'express';
import articleLikesService from '../service/articleLikes.service';
import { authenticateJWT } from '../middleware/auth.middleware'; // JWT middleware

const articleLikesRouter = express.Router();

/**
 * @swagger
 * /article-likes/add:
 *   post:
 *     security:
 *       - bearerAuth: []  # Requires user authentication
 *     summary: Add a like to an article
 *     description: Adds a new like to an article for the currently logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       201:
 *         description: Like successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user:
 *                   type: object
 *                 article:
 *                   type: object
 *                 date:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *       401:
 *         description: Unauthorized. User not logged in or invalid token.
 */
articleLikesRouter.post('/add', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.body;

        if (!articleId) {
            return res.status(400).json({ error: 'Missing articleId.' });
        }

        const userId = (req as any).user.id; // `req.user` is populated by `express-jwt`.

        const newLike = await articleLikesService.addLike(userId, articleId);
        res.status(201).json(newLike);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /article-likes/delete:
 *   delete:
 *     security:
 *       - bearerAuth: []  # Requires user authentication
 *     summary: Delete a like from an article
 *     description: Removes an existing like for an article by the currently logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       200:
 *         description: Like successfully removed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Like removed successfully."
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *       401:
 *         description: Unauthorized. User not logged in or invalid token.
 */
articleLikesRouter.delete('/delete', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.body;

        if (!articleId) {
            return res.status(400).json({ error: 'Missing articleId.' });
        }

        const userId = (req as any).user.id; // `req.user` is populated by `express-jwt`.

        await articleLikesService.deleteLike(userId, articleId);
        res.status(200).json({ message: 'Like removed successfully.' });
    } catch (error) {
        next(error);
    }
});

export { articleLikesRouter };
