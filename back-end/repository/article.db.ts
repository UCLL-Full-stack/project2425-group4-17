import { Article } from "../model/article";
import { ArticleLikes } from "../model/articlelikes";
import { Paper } from "../model/paper";
import { Review } from "../model/review";
import { User } from "../model/user";

const getRandomPastDate = () => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};



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

const article1 = new Article({
    id: 1,
    title: "Understanding TypeScript",
    summary: "An in-depth article about TypeScript and its features.",
    picture: "https://example.com/image.jpg",
    publishedAt: getRandomPastDate(),
    articleType: "Educational",
    user: user,
    paper: paper,
    reviews: [],
    articleLikes: []
});

const article2 = new Article({
    id: 2,
    title: "The Future of JavaScript",
    summary: "Exploring the latest trends in JavaScript development.",
    picture: "https://example.com/image2.jpg",
    publishedAt: getRandomPastDate(),
    articleType: "Tech",
    user: user,
    paper: paper,
    reviews: [],
    articleLikes: []
});

const article3 = new Article({
    id: 3,
    title: "Introduction to React",
    summary: "A beginner's guide to building user interfaces with React.",
    picture: "https://example.com/image3.jpg",
    publishedAt: getRandomPastDate(),
    articleType: "Educational",
    user: user,
    paper: paper,
    reviews: [],
    articleLikes: []
});

const article4 = new Article({
    id: 4,
    title: "Node.js: A Comprehensive Overview",
    summary: "Understanding the basics and advanced features of Node.js.",
    picture: "https://example.com/image4.jpg",
    publishedAt: getRandomPastDate(),
    articleType: "Educational",
    user: user,
    paper: paper,
    reviews: [],
    articleLikes: []
});

const article5 = new Article({
    id: 5,
    title: "Exploring Machine Learning",
    summary: "An introduction to the concepts and applications of machine learning.",
    picture: "https://example.com/image5.jpg",
    publishedAt: getRandomPastDate(),
    articleType: "Tech",
    user: user,
    paper: paper,
    reviews: [],
    articleLikes: []
});

paper.getArticles().push(article1, article2, article3, article4, article5);

const review1 = new Review({
    id: 1,
    title: "Insightful",
    content: "This article provides a deep understanding of TypeScript.",
    rating: 5,
    user: user,
    article: article1 
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
    article: article1
});

const articleLike1 = new ArticleLikes({
    id: 1,
    user: user,
    article: article1,
    date: new Date()
});

article1.getArticleLikes().push(articleLike1);

const articles = [
    article1,
    article2,
    article3,
    article4,
    article5,
];

const getAllArticles = (): Article[] => articles;

const getArticlesByDate = ({ date }: { date: Date }): Article[] => { 
    return articles.filter((article) => article.getPublishedAt() === date);
};

export default{
    getAllArticles,
    getArticlesByDate
};