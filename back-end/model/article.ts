import { User } from './user';
import { Paper } from './paper';
import { Review } from './review';
import { ArticleLikes } from './articlelikes';

export class Article {
    private id?: number;
    private title: string;
    private summary: string;
    private picture: string;
    private publishedAt: Date;
    private articleType: string;
    private user: User;
    private paper: Paper;
    private reviews: Review[] = [];
    private articleLikes: ArticleLikes[] = [];

    constructor(article: { id?: number; title: string; summary: string; picture: string; publishedAt: Date; articleType: string; user: User; paper: Paper; reviews: Review[]; articleLikes: ArticleLikes[] }) {
        this.validate(article);
        this.id = article.id;
        this.title = article.title;
        this.summary = article.summary;
        this.picture = article.picture;
        this.publishedAt = article.publishedAt;
        this.articleType = article.articleType;
        this.user = article.user;
        this.paper = article.paper;
        this.reviews = article.reviews;
        this.articleLikes = article.articleLikes;
    }

    getId(): number | undefined {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getSummary(): string {
        return this.summary;
    }

    getPicture(): string {
        return this.picture;
    }

    getPublishedAt(): Date {
        return this.publishedAt;
    }

    getArticleType(): string {
        return this.articleType;
    }

    getUser(): User {
        return this.user;
    }

    getPaper(): Paper {
        return this.paper;
    }

    getReviews(): Review[] {
        return this.reviews;
    }

    getArticleLikes(): ArticleLikes[] {
        return this.articleLikes;
    }

    validate(article: { title: string; summary: string; picture: string; publishedAt: Date; articleType: string }) {
        if (!article.title || !article.summary) {
            throw new Error('Title and summary are required');
        }
        if (!article.publishedAt || isNaN(article.publishedAt.getTime())) {
            throw new Error('Published date is invalid');
        }
        if (!article.picture) {
            throw new Error('Picture is required');
        }
    }

    static from(articlePrisma: any): Article {
        return new Article({
            id: articlePrisma.id,
            title: articlePrisma.title,
            summary: articlePrisma.summary,
            picture: articlePrisma.picture,
            publishedAt: new Date(articlePrisma.publishedAt),
            articleType: articlePrisma.articleType,
            user: User.from(articlePrisma.user),
            paper: Paper.from(articlePrisma.paper),
            reviews: articlePrisma.reviews.map((review: any) => Review.from(review)),
            articleLikes: articlePrisma.articleLikes.map((like: any) => ArticleLikes.from(like)),
        });
    }

    equals(article: Article): boolean {
        return this.id === article.getId() &&
         this.title === article.getTitle() &&
         this.publishedAt.getTime() === article.getPublishedAt().getTime();
    }
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            summary: this.summary,
            picture: this.picture,
            publishedAt: this.publishedAt,
            articleType: this.articleType,
            user: this.user,
            paper: this.paper,
            reviews: this.reviews.map(review => ({
                id: review.getId(),
                title: review.getTitle(),
                content: review.getContent(),
                rating: review.getRating(),
                user: {
                    id: review.getUser().getId(),
                    username: review.getUser().getUsername(),
                },
            })),
            articleLikes: this.articleLikes.map(like => ({
                id: like.getId(),
                user: {
                    id: like.getUser().getId(),
                    username: like.getUser().getUsername(),
                },
                date: like.getDate(),
            })),
        };
    }
}