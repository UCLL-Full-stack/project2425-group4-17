import { User } from './user';
import { Article } from './article';
import { Review as ReviewPrisma } from '@prisma/client';
import { User as UserPrisma } from '@prisma/client';
import { Article as ArticlePrisma } from '@prisma/client';

export class Review {
    private id?: number;
    private title: string;
    private content: string;
    private rating?: number;
    private userId: number;
    private articleId: number;

    constructor(review: { id?: number; title: string; content: string; rating?: number; userId: number; articleId: number }) {
        this.validate(review);
        this.id = review.id;
        this.title = review.title;
        this.content = review.content;
        this.rating = review.rating;
        this.userId = review.userId;
        this.articleId = review.articleId;
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

    getUserid(): number {
        return this.userId;
    }

    getArticleId(): number {
        return this.articleId;
    }

    validate(review: { title: string; content: string; rating?: number }) {
        if (!review.title || !review.content) {
            throw new Error('Title and content are required');
        }
        if (review.rating && (review.rating < 0 || review.rating > 5)) {
            throw new Error('Rating must be between 0 and 5');
        }
    }

    
    static from({
        id,
        title,
        content,
        rating,
        user,
        article,
    }: ReviewPrisma & {user: UserPrisma, article: ArticlePrisma}): Review {
        return new Review({
            id,
            title,
            content,
            rating,
            userId: user.id,
            articleId: article.id,
        });
    }

    equals(review: Review): boolean {
        return (
            this.id === review.getId() &&
            this.title === review.getTitle() &&
            this.content === review.getContent() &&
            this.rating === review.getRating() &&
            this.userId === review.getUserid() &&
            this.articleId === review.getArticleId()
        );
    }
}