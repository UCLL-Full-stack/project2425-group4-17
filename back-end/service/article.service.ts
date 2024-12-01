import articleDb from "../repository/article.db";
import { Article } from "../model/article";
import { ar } from "date-fns/locale";

const getAllArticles = (): Promise<Article[]>=>articleDb.getAllArticles();

const getArticlesByDate = async (date: Date): Promise<Article[]> => {
    return await articleDb.getArticlesByDate({ date });
};

const getArticleById = async (id: number): Promise<Article | null> => {
    return await articleDb.getArticleById(id);
};


const addArticle = async (articleData: Article): Promise<Article> => {
    try {
        const newArticle = await articleDb.addArticle({
            title: articleData.getTitle() ?? "Untitled Article",
            summary: articleData.getSummary(),
            picture: articleData.getPicture(),
            publishedAt: new Date(),
            articleType: articleData.getArticleType(),
            userId: articleData.getUser()?.getId(),
            paperId: articleData.getPaper()?.getId(),
            reviews: [],
            articleLikes: [],
        });

        return newArticle;
    } catch (error) {
        console.error('Error in addArticle service:', error);
        throw new Error('Could not add the article.');
    }
};

const editArticle = async (id: number, updatedData: Article): Promise<Article | null> => {
    try {
        // Prepare only non-relational fields to be updated
        const updateData: any = {
            title: updatedData.getTitle(),
            summary: updatedData.getSummary(),
            picture: updatedData.getPicture(),
            publishedAt: updatedData.getPublishedAt(),
            articleType: updatedData.getArticleType(),
        };

        // Call the database method to update the article with non-relational fields
        const updatedArticle = await articleDb.editArticle(id, updateData);

        return updatedArticle;
    } catch (error) {
        console.error('Error in editArticle service:', error);
        throw new Error('Could not edit the article.');
    }
};

const deleteArticle = async (id: number): Promise<void> => {
    await articleDb.deleteArticle(id);
};


export default {
   getAllArticles,
    getArticlesByDate,
    getArticleById,
    addArticle,
    editArticle, 
    deleteArticle,
};