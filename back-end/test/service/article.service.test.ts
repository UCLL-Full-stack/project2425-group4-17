import { Article } from '../../model/article';
import { Paper } from '../../model/paper';
import { User } from '../../model/user';
import { Review } from '../../model/review';
import { ArticleLikes } from '../../model/articlelikes';

let mockUser: User;
let mockPaper: Paper;

beforeEach(() => {
    mockUser = new User({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        username: "johnny",
        password: "securepassword",
        role: "author",
        reviews: [],
        articles: [],
        articleLikes: []
    });

    mockPaper = new Paper({
        id: 1,
        date: new Date(),
        namePaper: "Science Today",
        namePublisher: "Knowledge Publishers",
        articles: []
    });
});

test('given valid article data, when article is created, then the article should be created with those values', () => {
    // Given
    const articleData = {
        id: 1,
        title: "Understanding TypeScript",
        summary: "An in-depth article about TypeScript and its features.",
        picture: "https://example.com/image.jpg",
        publishedAt: new Date(),
        articleType: "Educational",
        user: mockUser,
        paper: mockPaper,
        reviews: [],
        articleLikes: []
    };

    // When
    const article = new Article(articleData);

    // Then
    expect(article.getTitle()).toBe(articleData.title);
    expect(article.getSummary()).toBe(articleData.summary);
    expect(article.getPicture()).toBe(articleData.picture);
    expect(article.getPublishedAt()).toEqual(articleData.publishedAt);
    expect(article.getArticleType()).toBe(articleData.articleType);
    expect(article.getUser()).toEqual(mockUser);
    expect(article.getPaper()).toEqual(mockPaper);
});

test('given an article with missing title, when article is created, then an error is thrown', () => {
    // Given
    const articleData = {
        id: 1,
        title: "",
        summary: "An in-depth article about TypeScript and its features.",
        picture: "https://example.com/image.jpg",
        publishedAt: new Date(),
        articleType: "Educational",
        user: mockUser,
        paper: mockPaper,
        reviews: [],
        articleLikes: []
    };

    // When
    const createArticle = () => new Article(articleData);

    // Then
    expect(createArticle).toThrowError('Title and summary are required');
});

test('given an article with invalid published date, when article is created, then an error is thrown', () => {
    // Given
    const articleData = {
        id: 1,
        title: "Understanding TypeScript",
        summary: "An in-depth article about TypeScript and its features.",
        picture: "https://example.com/image.jpg",
        publishedAt: NaN as any, // Invalid date
        articleType: "Educational",
        user: mockUser,
        paper: mockPaper,
        reviews: [],
        articleLikes: []
    };

    // When
    const createArticle = () => new Article(articleData);

    // Then
    expect(createArticle).toThrowError('Published date is invalid');
});

test('given an article, when comparing with the same article, then equals should return true', () => {
    // Given
    const articleData = {
        id: 1,
        title: "Understanding TypeScript",
        summary: "An in-depth article about TypeScript and its features.",
        picture: "https://example.com/image.jpg",
        publishedAt: new Date(),
        articleType: "Educational",
        user: mockUser,
        paper: mockPaper,
        reviews: [],
        articleLikes: []
    };

    const article1 = new Article(articleData);
    const article2 = new Article(articleData); 

    // When
    const areEqual = article1.equals(article2);

    // Then
    expect(areEqual).toBe(true);
});