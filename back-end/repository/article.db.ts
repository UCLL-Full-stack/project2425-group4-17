import { Article } from '../model/article';
import database from '../util/database';

const getAllArticles = async (): Promise<Article[]> => {
    try {
        const articlesPrisma = await database.article.findMany({
            include: {
                user: true,
                paper: true,
                reviews: {
                    include: {
                        user: true,
                        article: true,
                    },
                },
                articleLikes: true,
            },
        });
        return articlesPrisma.map((articlePrisma) => Article.from(articlePrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getArticlesByDate = async (date: Date): Promise<Article[]> => {
    try {
        const articlesPrisma = await database.article.findMany({
            where: {
                publishedAt: date,
            },
            include: {
                user: true,
                paper: true,
                reviews: true,
                articleLikes: true,
            },
        });
        return articlesPrisma.map((articlePrisma) => Article.from(articlePrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getArticleById = async (id: number): Promise<Article | null> => {
    try {
        const articlePrisma = await database.article.findUnique({
            where: { id },
            include: {
                user: true,
                paper: true,
                reviews: {
                    include: {
                        user: true,
                        article: true,
                    },
                },
                articleLikes: true,
            },
        });
        return articlePrisma ? Article.from(articlePrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Error retrieving article from the database.');
    }
};

const addArticle = async (article: Article): Promise<Article> => {
    try {
        const userId = article.getUser().getId();
        const paperId = article.getPaperId();

        if (userId === undefined || paperId === undefined) {
            throw new Error('User ID and Paper ID are required');
        }

        const articlePrisma = await database.article.create({
            data: {
                title: article.getTitle(),
                summary: article.getSummary(),
                picture: article.getPicture(),
                publishedAt: article.getPublishedAt(),
                articleType: article.getArticleType(),
                userId: userId,
                paperId: paperId,
            },
            include: {
                user: true,
                paper: true,
                reviews: true,
                articleLikes: true,
            },
        });
        return Article.from(articlePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error saving article to the database.');
    }
};

const editArticle = async (id: number, updates: Partial<{ title: string; summary: string; picture: string; articleType: string }>): Promise<Article> => {
    try {
        const articlePrisma = await database.article.update({
            where: { id },
            data: updates,
            include: {
                user: true,
                paper: true,
                reviews: {
                    include: {
                        user: true,
                        article: true,
                    },
                },
                articleLikes: true,
            },
        });

        return Article.from(articlePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating article in the database.');
    }
};

const deleteArticle = async (id: number): Promise<void> => {
    try {
        await database.article.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting article from the database.');
    }
};

const getArticlesOfToday = async (): Promise<Article[]> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const articlesPrisma = await database.article.findMany({
            where: {
                publishedAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            include: {
                user: true,
                paper: true,
                reviews: {
                    include: {
                        user: true,
                        article: true,
                    },
                },
                articleLikes: true,
            },
        });
        return articlesPrisma.map((articlePrisma) => Article.from(articlePrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllArticles,
    getArticlesByDate,
    getArticleById,
    addArticle,
    editArticle,
    deleteArticle,
    getArticlesOfToday,
};