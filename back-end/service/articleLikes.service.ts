import { ArticleLikes } from "../model/articlelikes";
import articleLikesDB from '../repository/articlelikes.db';

const addLike = async (userId: number, articleId: number): Promise<ArticleLikes> => {
    const likeData = {
        userId,
        articleId,
        date: new Date(),
    };
    return await articleLikesDB.createLike(likeData);
};

const deleteLike = async (userId: number, articleId: number): Promise<void> => {
    await articleLikesDB.removeLike(userId, articleId);
};

export default {
    addLike,
    deleteLike,
};
