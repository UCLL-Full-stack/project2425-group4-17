/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      Lecturer:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            name:
 *              type: string
 *              description: Lecturer name.
 *            expertise:
 *              type: string
 *              description: Lecturer expertise.
 */
import express, { NextFunction, Request, Response } from 'express';
import articleService from '../service/article.service';

const articleRouter = express.Router();

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get a list of all articles.
 *     responses:
 *       200:
 *         description: A list of articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/article'
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
 * /articles/{date}:
 *  get:
 *      summary: Get articles by date.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The article publishedAt date.
 *      responses:
 *          200:
 *              description: A Articles List.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Article'
 */
articleRouter.get('/:date', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const date = new Date(req.params.date);
        if (isNaN(date.getTime())) {
            // Handle invalid date format
            return res.status(400).json({ error: "Invalid date format" });
        }
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
 *     summary: Add a new article.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Article created successfully.
 *       400:
 *         description: Invalid request data.
 */
articleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newArticle = req.body;
        const createdArticle = await articleService.addArticle(newArticle);
        res.status(201).json(createdArticle);
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
 *     summary: Edit an existing article.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the article to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: Article updated successfully.
 *       404:
 *         description: Article not found.
 *       400:
 *         description: Invalid request data.
 */
articleRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid article ID' });
        }
        const updatedArticle = req.body;
        const result = await articleService.editArticle(id, updatedArticle);
        if (!result) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export {articleRouter}