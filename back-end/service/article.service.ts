import articleDb from "../repository/article.db";
import { Article } from "../model/article";
import { ar } from "date-fns/locale";

const getAllArticles = (): Article[]=>articleDb.getAllArticles();

const getArticlesByDate = (date: Date): Article[] => {
    return articleDb.getArticlesByDate({ date });
};

const editArticle = (id: number, updatedData: Partial<Article>) => {
    return articleDb.editArticle(id, updatedData);
};

const addArticle = (articleData: any) => {
    return articleDb.addArticle(articleData);
};

export default {
    getAllArticles,
    getArticlesByDate,
    addArticle,
    editArticle,
};