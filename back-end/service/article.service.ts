import articleDb from "../repository/article.db";
import { Article } from "../model/article";
import { ar } from "date-fns/locale";

const getAllArticles = (): Article[]=>articleDb.getAllArticles();

const getArticlesByDate = (date: Date): Article[] => {
    return articleDb.getArticlesByDate({ date });
};

export default {getAllArticles,getArticlesByDate}