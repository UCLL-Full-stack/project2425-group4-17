import express, { Request, Response, NextFunction } from 'express';
import articleLikesService from '../service/articleLikes.service';
import { ensureAuthenticated } from '../middleware/auth.middleware'; // Ensures user is logged in

const articleLikesRouter = express.Router();

/**
 * Add a like to an article.
 */
articleLikesRouter.post('/add', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, articleId } = req.body;
        if (!userId || !articleId) {
            return res.status(400).json({ error: 'Missing userId or articleId.' });
        }

        const newLike = await articleLikesService.addLike(userId, articleId);
        res.status(201).json(newLike);
    } catch (error) {
        next(error);
    }
});

/**
 * Delete a like from an article.
 */
articleLikesRouter.delete('/delete', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, articleId } = req.body;
        if (!userId || !articleId) {
            return res.status(400).json({ error: 'Missing userId or articleId.' });
        }

        await articleLikesService.deleteLike(userId, articleId);
        res.status(200).json({ message: 'Like removed successfully.' });
    } catch (error) {
        next(error);
    }
});

export { articleLikesRouter };
