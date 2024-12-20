import { User } from './user';
import { Article } from './article';
import { ArticleLike as ArticleLikesPrisma, User as UserPrisma, Article as ArticlePrisma } from '@prisma/client';

export class ArticleLikes {
    private id?: number;
    private userId: number;
    private articleId: number;
    private date: Date;

    constructor(articleLikes: { id?: number; userId: number; articleId: number; date: Date; }) {
        this.id = articleLikes.id;
        this.userId = articleLikes.userId;
        this.articleId = articleLikes.articleId;
        this.date = articleLikes.date;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUser(): number {
        return this.userId;
    }

    getArticle(): number {
        return this.articleId;
    }

    getDate(): Date {
        return this.date;
    }

    static from({
        id,
        user,
        article,
        date,
    }: ArticleLikesPrisma & {user: UserPrisma, article: ArticlePrisma}): ArticleLikes {
        return new ArticleLikes({
            id,
            userId: user.id,
            articleId: article.id,
            date,
        });
}
}