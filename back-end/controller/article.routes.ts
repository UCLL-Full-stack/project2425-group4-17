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
 *            name: date
 *            schema:
 *              type: string
 *              format: date
 *              required: true
 *              description: The article publishedAt date.
 *      responses:
 *          200:
 *              description: A list of articles for the given date.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Article'
 */
articleRouter.get('/:date', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const date = new Date(req.params.date);
        if (isNaN(date.getTime())) {
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

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete an article by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the article to delete.
 *     responses:
 *       200:
 *         description: Article deleted successfully.
 *       404:
 *         description: Article not found.
 *       400:
 *         description: Invalid request data.
 */
articleRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid article ID' });
        }
        await articleService.deleteArticle(id);
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export { articleRouter };
