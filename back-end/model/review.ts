import { User } from './user';
import { Article } from './article';

export class Review {
    private id?: number;
    private title: string;
    private content: string;
    private rating?: number;
    private user: User;
    private article: Article;

    constructor(review: { id?: number; title: string; content: string; rating?: number; user: User; article: Article }) {
        this.validate(review);
        this.id = review.id;
        this.title = review.title;
        this.content = review.content;
        this.rating = review.rating;
        this.user = review.user;
        this.article = review.article;
    }

    getId(): number | undefined {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getContent(): string {
        return this.content;
    }

    getRating(): number | undefined {
        return this.rating;
    }

    getUser(): User {
        return this.user;
    }

    getArticle(): Article {
        return this.article;
    }

    validate(review: { title: string; content: string; rating?: number }) {
        if (!review.title || !review.content) {
            throw new Error('Title and content are required');
        }
        if (review.rating && (review.rating < 0 || review.rating > 5)) {
            throw new Error('Rating must be between 0 and 5');
        }
    }

    equals(review: Review): boolean {
        return (
            this.id === review.getId() &&
            this.title === review.getTitle() &&
            this.content === review.getContent() &&
            this.rating === review.getRating() &&
            this.user.equals(review.getUser()) &&
            this.article.equals(review.getArticle())
        );
    }
}