import { Article } from './article';

export class Paper {
    private id?: number;
    private date: Date;
    private articles: Article[] = [];

    constructor(paper: { id?: number; date: Date; articles: Article[]; }) {
        this.validate(paper);
        this.id = paper.id;
        this.date = paper.date;
        this.articles = paper.articles;
    }

    getId(): number | undefined {
        return this.id;
    }

    getDate(): Date {
        return this.date;
    }

    getArticles(): Article[] {
        return this.articles;
    }

    validate(paper: { date: Date }) {
        if (!paper.date || isNaN(paper.date.getTime())) {
            throw new Error('Valid date is required');
        }
    }

    equals(paper: Paper): boolean {
        return this.id === paper.getId() && 
        this.date.getTime() === paper.getDate().getTime();
    }
}