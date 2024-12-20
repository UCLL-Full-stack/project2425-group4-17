import { ArticleLikes } from '../model/articlelikes';
import articleLikesDB from '../repository/articlelikes.db';
import userDB from '../repository/user.db';
import articleDB from '../repository/article.db';
import { User } from '../model/user';
import { Article } from '../model/article';
import { CreateArticleLikeInput } from '../types';

const createArticleLike = async ({ userId, articleId }: CreateArticleLikeInput): Promise<ArticleLikes> => {
    const user: User | null = await userDB.getUserById({ id: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const article: Article | null = await articleDB.getArticleById(articleId);
    if (!article) {
        throw new Error('Article not found');
    }

    const articleLike = new ArticleLikes({
        userId: userId,
        articleId: articleId,
        date: new Date(),
    });
    return await articleLikesDB.addArticleLike(articleLike);
};

export default {
    createArticleLike,
};