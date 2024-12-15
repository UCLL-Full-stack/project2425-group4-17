import { Article } from '../model/article';
import articleDB from '../repository/article.db';
import userDB from '../repository/user.db';
import paperDB from '../repository/paper.db';
import { ArticleInput } from '../types';

const getAllArticles = async (): Promise<Article[]> => {
    return await articleDB.getAllArticles();
};

const getArticlesByDate = async (date: Date): Promise<Article[]> => {
    return await articleDB.getArticlesByDate(date);
};

const createArticle = async (articleData: ArticleInput, userId: number): Promise<Article> => {
    const user = await userDB.getUserById({ id: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const today = new Date();
    const paper = await paperDB.getPaperByLatestId();
    if (!paper) {
        throw new Error('Latest paper not found');
    }

    const article = new Article({
        title: articleData.title,
        summary: articleData.summary,
        picture: articleData.picture,
        publishedAt: today,
        articleType: articleData.articleType,
        user: user,
        paperId: paper.getId(),
        reviews: [],
        articleLikes: [],
    });

    return await articleDB.addArticle(article);
};

const editArticle = async (id: number, updates: Partial<{ title: string; summary: string; picture: string; articleType: string; }>, userId: number, userRole: string): Promise<Article | null> => {
    const article = await articleDB.getArticleById(id);
    if (!article) {
        throw new Error('Article not found');
    }

    if (article.getUser().getId() !== userId && userRole !== 'admin') {
        throw new Error('Unauthorized: Only the author or an admin can edit this article');
    }

    return await articleDB.editArticle(id, updates);
};

const deleteArticle = async (id: number, userId: number, userRole: string): Promise<void> => {
    const article = await articleDB.getArticleById(id);
    if (!article) {
        throw new Error('Article not found');
    }

    if (article.getUser().getId() !== userId && userRole !== 'admin') {
        throw new Error('Unauthorized: Only the author or an admin can delete this article');
    }

    await articleDB.deleteArticle(id);
};

const getArticlesOfToday = async (): Promise<Article[]> => {
    return await articleDB.getArticlesOfToday();
};

export default {
    getAllArticles,
    getArticlesByDate,
    createArticle,
    editArticle,
    deleteArticle,
    getArticlesOfToday,
};