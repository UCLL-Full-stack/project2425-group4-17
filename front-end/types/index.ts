

export type UserInput = {
    firstName?: string;
    lastName?: string;
    fullname?: string;
    email?: string;
    username?: string;
    password?: string;
    role?: string;
};

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
};

export type Article = {
    id?: number;
    title: string;
    summary: string;
    picture: string;
    publishedAt: Date;
    articleType: string;
    user: User;
    paper: Paper;
    reviews: Review[];
    articleLikes: ArticleLike[];
};

export type ReviewInput = {
    title: string;
    content: string;
    rating?: number;
    articleId: number;
};

export type Review = {
    id: number;
    title: string;
    content: string;
    rating: number;
    articleId: number;
    user: User;
};

export type Paper = {
    id: number;
    title: string;
    content: string;
    publishedAt: Date;
};

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};

export type ArticleLike = {
    id: number;
    user: User;
    articleId: number;
};