import database from '../util/database';
import { ArticleLikes } from "../model/articlelikes";

const createLike = async (likeData: { userId: number; articleId: number; date: Date }): Promise<ArticleLikes> => {
    const like = await database.articleLikes.create({
        data: likeData,
    });
    return new ArticleLikes({
        id: like.id,
        user: like.user,
        article: like.article,
        date: like.date,
    });
};

const removeLike = async (userId: number, articleId: number): Promise<void> => {
    await database.articleLikes.delete({
        where: {
            userId_articleId: { userId, articleId },
        },
    });
};

export default {
    createLike,
    removeLike,
};
