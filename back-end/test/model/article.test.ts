import { Article } from '../../model/article';
import { Paper } from '../../model/paper';
import { User } from '../../model/user';

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

test('given: valid article details, when: creating an article, then: article should be created successfully', () => {
    //given
    const article = new Article({
        id: 1,
        title: "Understanding TypeScript",
        summary: "An in-depth article about TypeScript and its features.",
        picture: "https://example.com/image.jpg",
        publishedAt: new Date(),
        articleType: "Educational",
        user: user,
        paper: paper,
        reviews: [],
        articleLikes: []
    });

    //when

    //then
    expect(article.getTitle()).toEqual("Understanding TypeScript");
    expect(article.getSummary()).toEqual("An in-depth article about TypeScript and its features.");
    expect(article.getUser()).toEqual(user);
});

test('given: missing title, when: creating an article, then: an error should be thrown', () => {
    //when

    //then

    //given
    expect(() => {
        new Article({
            id: 2,
            title: "",
            summary: "Some summary",
            picture: "https://example.com/image2.jpg",
            publishedAt: new Date(),
            articleType: "Tech",
            user: user,
            paper: paper,
            reviews: [],
            articleLikes: []
        });
    }).toThrowError('Title and summary are required');
});

test('given: an existing article, when: checking for equality with another article, then: equality should be determined correctly', () => {
    const article1 = new Article({
        id: 1,
        title: "Understanding TypeScript",
        summary: "An in-depth article about TypeScript and its features.",
        picture: "https://example.com/image.jpg",
        publishedAt: new Date(),
        articleType: "Educational",
        user: user,
        paper: paper,
        reviews: [],
        articleLikes: []
    });

    const article2 = new Article({
        id: 1,
        title: "Understanding TypeScript",
        summary: "An in-depth article about TypeScript and its features.",
        picture: "https://example.com/image.jpg",
        publishedAt: new Date(),
        articleType: "Educational",
        user: user,
        paper: paper,
        reviews: [],
        articleLikes: []
    });

    expect(article1.equals(article2)).toBe(true);
});