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

export {articleRouter}