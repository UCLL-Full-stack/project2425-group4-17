import { User } from '../..//back-end/model/user';
import { Paper } from '../..//back-end/model/paper';
import { Review } from '../..//back-end/model/review';
import { ArticleLikes } from '../..//back-end/model/articlelikes';

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
    articleLikes: ArticleLikes[];
};