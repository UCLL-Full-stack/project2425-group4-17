import express, { Request, Response, NextFunction } from 'express';
import articleService from '../service/article.service';
import { ArticleInput } from '../types';
import { Request as JwtRequest, UnauthorizedError } from 'express-jwt';
import { Article } from '../model/article';
import { id } from 'date-fns/locale';

const articleRouter = express.Router();

// Middleware to check JWT token
/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         title:
 *           type: string
 *           description: Title of the article
 *         summary:
 *           type: string
 *           description: Summary of the article
 *         picture:
 *           type: string
 *           description: URL of the article picture
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           description: Publication date of the article
 *         articleType:
 *           type: string
 *           description: Type of the article
 *         user:
 *           $ref: '#/components/schemas/User'
 *         paper:
 *           $ref: '#/components/schemas/Paper'
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         articleLikes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ArticleLikes'
 *     ArticleInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the article
 *         summary:
 *           type: string
 *           description: Summary of the article
 *         picture:
 *           type: string
 *           description: URL of the article picture
 *         articleType:
 *           type: string
 *           description: Type of the article
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all articles
 *     responses:
 *       200:
 *         description: A list of articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Article'
 */
articleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articles = await articleService.getAllArticles();
        res.status(200).json(articles);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /articles/date:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of articles by date
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date to filter articles by
 *     responses:
 *       200:
 *         description: A list of articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Article'
 */
articleRouter.get('/date', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const date = new Date(req.query.date as string);
        const articles = await articleService.getArticlesByDate(date);
        res.status(200).json(articles);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /articles:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 */
articleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articleData: ArticleInput = req.body;
        const psdRequest = <JwtRequest>req
        const id = psdRequest.auth?.id;
        console.log(id);
        const newArticle = await articleService.createArticle(articleData, id);
        res.status(201).json(newArticle);

    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Edit an existing article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: Article successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad request or validation error.
 */
articleRouter.put('/:id', async (req: Request<{ id: string }, {}, { title?: string; summary?: string; picture?: string; articleType?: string; }>, res: Response, next: NextFunction) => {
    try {
        const articleId = parseInt(req.params.id, 10);
        const updates = req.body;
        const psdRequest = <JwtRequest>req;
        const userId = psdRequest.auth?.id;
        const userRole = psdRequest.auth?.role;

        if (!userId || !userRole) {
            throw new UnauthorizedError('credentials_required', { message: 'Missing credentials' });
        }

        const updatedArticle = await articleService.editArticle(articleId, updates, userId, userRole);
        if (updatedArticle) {
            res.status(200).json({
                id: updatedArticle.getId(),
                title: updatedArticle.getTitle(),
                summary: updatedArticle.getSummary(),
                picture: updatedArticle.getPicture(),
                articleType: updatedArticle.getArticleType(),
            });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete an article by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID to delete
 *     responses:
 *       204:
 *         description: Article successfully deleted.
 *       400:
 *         description: Bad request or validation error.
 */
articleRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articleId = parseInt(req.params.id, 10);
        const psdRequest = <JwtRequest>req;
        const userId = psdRequest.auth?.id;
        const userRole = psdRequest.auth?.role;

        await articleService.deleteArticle(articleId, userId, userRole);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

export { articleRouter };