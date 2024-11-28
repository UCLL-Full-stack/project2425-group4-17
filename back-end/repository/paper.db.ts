import database from '../util/database';
import { Paper } from "../model/paper";

const getAllPapers = async (): Promise<Paper[]> => {
    try {
        const papersPrisma = await database.paper.findMany({ include: { articles: true } });
        return papersPrisma.map(Paper.from);
    } catch (error) {
        console.error(error);
        throw new Error('Error retrieving papers from database.');
    }
};

const getPaperById = async (id: number): Promise<Paper | null> => {
    try {
        const paperPrisma = await database.paper.findUnique({
            where: { id },
            include: { articles: true },
        });
        return paperPrisma ? Paper.from(paperPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Error retrieving paper from database.');
    }
};

const createPaper = async (paper: Paper): Promise<Paper> => {
    try {
        const paperPrisma = await database.paper.create({
            data: {
                date: paper.getDate(),
                namePaper: paper.getNamrPaper(),
                namePublisher: paper.getNamePublisher(),
            },
        });
        return Paper.from(paperPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error creating paper in database.');
    }
};

const updatePaper = async (id: number, updates: Partial<{ namePaper: string; namePublisher: string }>): Promise<Paper> => {
    try {
        const paperPrisma = await database.paper.update({
            where: { id },
            data: updates,
        });
        return Paper.from(paperPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating paper in database.');
    }
};

const deletePaper = async (id: number): Promise<void> => {
    try {
        await database.paper.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting paper from database.');
    }
};

export default {
    getAllPapers,
    getPaperById,
    createPaper,
    updatePaper,
    deletePaper,
};