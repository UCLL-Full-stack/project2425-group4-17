import { User } from '../model/user';
import { Paper } from '../model/paper';
import { Review } from '../model/review';
import { ArticleLikes } from '../model/articlelikes';

type UserInput = {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    password?: string;
};

type ArticleInput = {
    id?: number;
    title: string;
    summary: string;
    picture: string;
    publishedAt: Date;
    articleType: string;
    user: User;
    paper: Paper;
    reviews: Review[];
    articleLikes: ArticleLikes[];
};

type PaperInput = {
    date: Date;
    namePaper: string;
    namePublisher: string;
};

type ReviewInput = {
    title: string;
    content: string;
    rating?: number;
    articleId: number;
};

type CreateArticleLikeInput = {
    userId: number;
    articleId: number;
};
  
type AuthenticationResponse = {
    token: string;
    username: string;
    fullname: string;
    role: string;
};

export {
    UserInput,
    ArticleInput,
    PaperInput,
    ReviewInput,
    AuthenticationResponse,
    CreateArticleLikeInput
};