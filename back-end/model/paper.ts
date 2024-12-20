import { Paper as PaperPrisma } from '@prisma/client';
import { Article } from './article';

export class Paper {
    private id?: number;
    private date: Date;
    private namePaper: string;
    private namePublisher: string;
    private articles: Article[] = [];

    constructor(paper: { id?: number; date: Date;namePaper: string;namePublisher: string; articles: Article[]; }) {
        this.validate(paper);
        this.id = paper.id;
        this.date = paper.date;
        this.namePaper = paper.namePaper;
        this.namePublisher = paper.namePublisher;
        this.articles = paper.articles;
    }

    getId(): number | undefined {
        return this.id;
    }

    getDate(): Date {
        return this.date;
    }

    getNamrPaper(): string{
        return this.namePaper;
    }

    getNamePublisher(): string{
        return this.namePublisher;
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

    static from({
        id,
        date,
        namePaper,
        namePublisher
    }: PaperPrisma): Paper {
        return new Paper({
            id,
            date,
            namePaper,
            namePublisher,
            articles: []
        });
    }

    toJSON() {
        return {
            id: this.id,
            date: this.date,
            namePaper: this.namePaper,
            namePublisher: this.namePublisher,
            articles: this.articles.map(article => ({
                id: article.getId,
                title: article.getTitle,
                summary: article.getSummary,
            })),
        };
    }
}