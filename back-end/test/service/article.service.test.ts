import { Article } from "../../model/article";
import articleService from "../../service/article.service";
import articleDB from "../../repository/article.db";
import userDB from "../../repository/user.db";
import paperDB from "../../repository/paper.db";
import { User } from "../../model/user";
import { Paper } from "../../model/paper";



const date = new Date();
const user = new User({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'securepassword',
    role: 'user',
    reviews: [],
    articles: [],
    articleLikes: [],
});
const paper = new Paper({id: 1,
    date: new Date("2024-01-01"),
    namePaper: "Science Daily",
    namePublisher: "Science Publishing Group",
    articles: []});
const articleData = { id: 1,
    title: "Sample Article",
    summary: "This is a summary of the article.",
    picture: "https://example.com/picture.jpg",
    publishedAt: new Date("2024-01-01"),
    articleType: "Research",
    user: user,
    paperId: 1,
    reviews: [
    ],
    articleLikes: [
    ]
};
const article = new Article({ ...articleData, id: 1 });
const article2 = new Article({
    id: 2,
    title: "Sample Article 2",
    summary: "This is a summary of the article.",
    picture: "https://example.com/picture.jpg",
    publishedAt: new Date("2024-01-01"),
    articleType: "Research",
    user: user,
    paperId: 1,
    reviews: [],
    articleLikes: []});
const articles = [article, article2];

afterEach(() => {
    jest.clearAllMocks();
});

test('should fetch all articles', async () => {
    
    jest.spyOn(articleDB, 'getAllArticles').mockResolvedValue(articles);

    const result = await articleService.getAllArticles();

    expect(result).toEqual(articles);
    expect(articleDB.getAllArticles).toHaveBeenCalledTimes(1);
});

test('should fetch articles by date', async () => {
    
    jest.spyOn(articleDB, 'getArticlesByDate').mockResolvedValue(articles);

    const result = await articleService.getArticlesByDate(date);

    expect(result).toEqual(articles);
    expect(articleDB.getArticlesByDate).toHaveBeenCalledWith(date);
});

test('should create an article when valid user and latest paper exist', async () => {
    jest.spyOn(userDB, 'getUserById').mockResolvedValue(user);
    jest.spyOn(paperDB, 'getPaperByLatestId').mockResolvedValue(paper);
    jest.spyOn(articleDB, 'addArticle').mockResolvedValue(article);

    const result = await articleService.createArticle({
            title: "Sample Article2",
    summary: "This is a summary of the article.",
    picture: "https://example.com/picture.jpg",
    publishedAt: new Date("2024-01-01"),
    articleType: "Research",
    user: user,
    paper: paper,
    reviews: [
    ],
    articleLikes: [
    ]
        }, 1);

    expect(result).toEqual(article);
    expect(userDB.getUserById).toHaveBeenCalledWith({ id: 1});
    expect(paperDB.getPaperByLatestId).toHaveBeenCalledTimes(1);
    expect(articleDB.addArticle).toHaveBeenCalledWith(expect.any(Article));
});

test('should throw an error when user does not exist', async () => {
    jest.spyOn(userDB, 'getUserById').mockResolvedValue(null);

    await expect(
        articleService.createArticle({
            title: "Sample Article3",
    summary: "This is a summary of the article.",
    picture: "https://example.com/picture.jpg",
    publishedAt: new Date("2024-01-01"),
    articleType: "Research",
    user: user,
    paper: paper,
    reviews: [
    ],
    articleLikes: [
    ]
        }, 1)
    ).rejects.toThrow('User not found');
});

test('should throw an error when latest paper does not exist', async () => {
    jest.spyOn(userDB, 'getUserById').mockResolvedValue(user);
    jest.spyOn(paperDB, 'getPaperByLatestId').mockResolvedValue(null);

    await expect(
        articleService.createArticle({
            title: "Sample Article4",
    summary: "This is a summary of the article.",
    picture: "https://example.com/picture.jpg",
    publishedAt: new Date("2024-01-01"),
    articleType: "Research",
    user: user,
    paper: paper,
    reviews: [
    ],
    articleLikes: [
    ]
        }, 1)
    ).rejects.toThrow('Latest paper not found');
});

test('should edit an article when authorized', async () => {
    jest.spyOn(articleDB, 'getArticleById').mockResolvedValue(article);
    jest.spyOn(articleDB, 'editArticle').mockResolvedValue(article);

    const result = await articleService.editArticle(1, { title: 'Updated Title' }, 1, 'user');

    expect(result).toEqual(article);
    expect(articleDB.editArticle).toHaveBeenCalledWith(1, { title: 'Updated Title' });
});

test('should delete an article when authorized', async () => {
    jest.spyOn(articleDB, 'getArticleById').mockResolvedValue(article);
    jest.spyOn(articleDB, 'deleteArticle').mockResolvedValue();

    await articleService.deleteArticle(1, 1, 'admin');

    expect(articleDB.deleteArticle).toHaveBeenCalledWith(1);
});

test('should fetch today\'s articles', async () => {
    jest.spyOn(articleDB, 'getArticlesOfToday').mockResolvedValue(articles);

    const result = await articleService.getArticlesOfToday();

    expect(result).toEqual(articles);
    expect(articleDB.getArticlesOfToday).toHaveBeenCalledTimes(1);
});
