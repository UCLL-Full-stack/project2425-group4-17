import { ArticleLikes } from '../../model/articlelikes';
import articleLikesService from '../../service/articlelikes.service';
import articleLikesDB from '../../repository/articlelikes.db';
import userDB from '../../repository/user.db';
import articleDB from '../../repository/article.db';
import { User } from '../../model/user';
import { Article } from '../../model/article';


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
const article = new Article({
    id: 1,
    title: "Sample Article 2",
    summary: "This is a summary of the article.",
    picture: "https://example.com/picture.jpg",
    publishedAt: new Date("2024-01-01"),
    articleType: "Research",
    user: user,
    paperId: 1,
    reviews: [],
    articleLikes: []});
const articleLike = new ArticleLikes({ userId: 1, articleId: 1, date: new Date() });

afterEach(() => {
    jest.clearAllMocks();
});

test('should create an article like when user and article exist', async () => {
   

    jest.spyOn(userDB, 'getUserById').mockResolvedValue(user);
    jest.spyOn(articleDB, 'getArticleById').mockResolvedValue(article);
    jest.spyOn(articleLikesDB, 'addArticleLike').mockResolvedValue(articleLike);

    const result = await articleLikesService.createArticleLike({ userId: 1, articleId: 1 });

    expect(result).toEqual(articleLike);
    expect(userDB.getUserById).toHaveBeenCalledWith({ id: 1 });
    expect(articleDB.getArticleById).toHaveBeenCalledWith(1);
    expect(articleLikesDB.addArticleLike).toHaveBeenCalledWith(expect.any(ArticleLikes));
});

test('should throw an error when user does not exist', async () => {
    jest.spyOn(userDB, 'getUserById').mockResolvedValue(null);

    await expect(
        articleLikesService.createArticleLike({ userId: 1, articleId: 1 })
    ).rejects.toThrow('User not found');
});

test('should throw an error when article does not exist', async () => {
    jest.spyOn(userDB, 'getUserById').mockResolvedValue(user);
    jest.spyOn(articleDB, 'getArticleById').mockResolvedValue(null);

    await expect(
        articleLikesService.createArticleLike({ userId: 1, articleId: 1 })
    ).rejects.toThrow('Article not found');
});

