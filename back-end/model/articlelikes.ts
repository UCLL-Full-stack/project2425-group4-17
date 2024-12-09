import { User } from './user';
import { Article } from './article';

export class ArticleLikes {
    private id?: number;
    private user: User;
    private article: Article;
    private date: Date;

    constructor(articleLikes: { id?: number; user: User; article: Article; date: Date; }) {
        this.id = articleLikes.id;
        this.user = articleLikes.user;
        this.article = articleLikes.article;
        this.date = articleLikes.date;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    getArticle(): Article {
        return this.article;
    }

    getDate(): Date {
        return this.date;
    }

    equals(articleLikes: ArticleLikes): boolean {
        return this.id === articleLikes.getId() &&
            this.user.equals(articleLikes.getUser()) &&
            this.article.equals(articleLikes.getArticle()) &&
            this.date.getTime() === articleLikes.getDate().getTime();
    }

    static from(prismaArticleLikes: any): ArticleLikes {
        const user = User.from(prismaArticleLikes.user);
        const article = Article.from(prismaArticleLikes.article);
        return new ArticleLikes({
            id: prismaArticleLikes.id,
            user,
            article,
            date: new Date(prismaArticleLikes.date),
        });
    }
}