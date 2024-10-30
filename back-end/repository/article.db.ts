import { Article } from "../model/article";
import { ArticleLikes } from "../model/articlelikes";
import { Paper } from "../model/paper";
import { Review } from "../model/review";
import { User } from "../model/user";

const user = new User({
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    username: "johnny",
    password: "securepassword",
    role: "author",
    reviews: [],
    articles: [],
    articleLikes: []
});

const paper = new Paper({
    id: 1,
    date: new Date(),
    namePaper: "Science Today",
    namePublisher: "Knowledge Publishers",
    articles: []
});

const review1 = new Review({
    id: 1,
    title: "Insightful",
    content: "This article provides a deep understanding of TypeScript.",
    rating: 5,
    user: user,
    article: articlePlaceholder
});

const review2 = new Review({
    id: 2,
    title: "Well-written",
    content: "Clear and concise.",
    rating: 4,
    user: new User({
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "janesmith@example.com",
        username: "janey",
        password: "anotherpassword",
        role: "reviewer",
        reviews: [],
        articles: [],
        articleLikes: []
    }),
    article: articlePlaceholder 
});

const articleLike1 = new ArticleLikes({
    id: 1,
    user: user,
    article: articlePlaceholder,
    date: new Date()
});
const article1 = new Article({
    id: 1,
    title: "Understanding TypeScript",
    summary: "An in-depth article about TypeScript and its features.",
    picture: "https://example.com/image.jpg",
    publishedAt: new Date(),
    articleType: "Educational",
    user: user,
    paper: paper,
    reviews: [review1, review2],
    articleLikes: [articleLike1]
    })

const articles= [
    article1,

]
;



const getAllArticles = (): Article[] => articles;

const getArticlesByDate = ({ date }: { date: Date }): Article[] => { 
    return articles.filter((article) => article.getPublishedAt() === date);
};

export default{
    getAllArticles,
    getArticlesByDate
};