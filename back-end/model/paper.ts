export class Paper {
    private id?: number;
    private date: Date;

    constructor(paper: { id?: number; date: Date }) {
        this.validate(paper);
        this.id = paper.id;
        this.date = paper.date;
    }

    getId(): number | undefined {
        return this.id;
    }

    getDate(): Date {
        return this.date;
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