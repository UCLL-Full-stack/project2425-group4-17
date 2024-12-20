import { Paper } from "../model/paper";
import paperDB from '../repository/paper.db';
import { PaperInput } from "../types";

const getAllPapers = async (): Promise<Paper[]> => {
    return await paperDB.getAllPapers();
};

const getPaperById = async (id: number): Promise<Paper | null> => {
    return await paperDB.getPaperById(id);
};

const createPaper = async (data: PaperInput): Promise<Paper> => {
    const newPaper = new Paper({
      date: data.date,
      namePaper: data.namePaper,
      namePublisher: data.namePublisher,
      articles: [],
    });
    return await paperDB.createPaper(newPaper);
  };

const updatePaper = async (id: number, updates: Partial<{ namePaper: string; namePublisher: string }>): Promise<Paper> => {
    return await paperDB.updatePaper(id, updates);
};

const deletePaper = async (id: number): Promise<void> => {
    await paperDB.deletePaper(id);
};

export default {
    getAllPapers,
    getPaperById,
    createPaper,
    updatePaper,
    deletePaper,
};