import { ArticleLikes } from '../model/articlelikes';
import database from '../util/database';

const addArticleLike = async (articleLike: ArticleLikes): Promise<ArticleLikes> => {
    try {
        const articleLikePrisma = await database.articleLike.create({
            data: {
                userId: articleLike.getUser(),
                articleId: articleLike.getArticle(),
                date: articleLike.getDate(),
            },
            include: {
                user: true,
                article: true,
            },
        });
        return ArticleLikes.from(articleLikePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error saving article like to the database.');
    }
};

export default {
    addArticleLike,
};