import express, { Request, Response, NextFunction } from 'express';
import paperService from '../service/paper.service';

const paperRouter = express.Router();

/**
 * @swagger
 * /papers:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all papers
 *     responses:
 *       200:
 *         description: A list of papers.
 */
paperRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const papers = await paperService.getAllPapers();
        res.status(200).json(papers);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /papers/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a specific paper by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A paper object.
 */
paperRouter.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid paper ID.' });
        }

        const paper = await paperService.getPaperById(id);
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found.' });
        }

        res.status(200).json(paper);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /papers:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new paper
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               namePaper:
 *                 type: string
 *               namePublisher:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paper successfully created.
 */
paperRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, namePaper, namePublisher } = req.body;
        const newPaper = await paperService.createPaper({ date: new Date(date), namePaper, namePublisher });
        res.status(201).json(newPaper);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /papers/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update an existing paper
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namePaper:
 *                 type: string
 *               namePublisher:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paper successfully updated.
 */
paperRouter.put('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid paper ID.' });
        }

        const updates = req.body;
        const updatedPaper = await paperService.updatePaper(id, updates);
        res.status(200).json(updatedPaper);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /papers/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a paper by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paper successfully deleted.
 */
paperRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid paper ID.' });
        }

        await paperService.deletePaper(id);
        res.status(200).json({ message: 'Paper successfully deleted.' });
    } catch (error) {
        next(error);
    }
});

export { paperRouter };
