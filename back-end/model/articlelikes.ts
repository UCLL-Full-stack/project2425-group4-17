import { User } from './user';
import { Article } from './article';

export class ArticleLikes {
    private id?: number;
    private user: User;
    private article: Article;

    constructor(articleLikes: { id?: number; user: User; article: Article }) {
        this.id = articleLikes.id;
        this.user = articleLikes.user;
        this.article = articleLikes.article;
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

    equals(articleLikes: ArticleLikes): boolean {
        return this.id === articleLikes.getId() &&
         this.user.equals(articleLikes.getUser()) &&
         this.article.equals(articleLikes.getArticle());
    }
}