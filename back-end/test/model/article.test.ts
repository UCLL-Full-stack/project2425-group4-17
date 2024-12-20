import { Article } from '../../model/article';
import { User } from '../../model/user';
import { Review } from "../../model/review"; 
import { ArticleLikes } from "../../model/articlelikes";

describe('Article Model', () => {
  const validArticleData = {
    id: 1,
    title: 'Test1',
    summary: 'testen.',
    picture: 'ai.jpg',
    publishedAt: new Date('2023-12-18'),
    articleType: 'Technology',
    user: new User({
      id: 1,
      firstName: 'bram',
      lastName: 'roden',
      email: 'bram@example.com',
      username: 'bramroden',
      password: 'passwoord',
      role: 'user',
      reviews: [],
      articles: [],
      articleLikes: [],
    }),
    paperId: 1,
    reviews: [
      new Review({
        id: 1,
        title: 'Great Article',
        content: 'Loved it!',
        rating: 5,
        userId: 1,
        articleId: 1,
      }),
    ],
    articleLikes: [
      new ArticleLikes({
        id: 1,
        userId: 1,
        articleId: 1,
        date: new Date('2023-12-19'),
      }),
    ],
  };

  test('TestCreateArticleInstanceValidData', () => {
    const article = new Article(validArticleData);

    expect(article.getId()).toBe(1);
    expect(article.getTitle()).toBe('Test1');
    expect(article.getSummary()).toBe('testen.');
    expect(article.getPicture()).toBe('ai.jpg');
    expect(article.getPublishedAt()).toEqual(new Date('2023-12-18'));
    expect(article.getArticleType()).toBe('Technology');
    expect(article.getUser().getId()).toBe(1);
    expect(article.getPaperId()).toBe(1);
    expect(article.getReviews().length).toBe(1);
    expect(article.getReviews()[0].getTitle()).toBe('Great Article');
    expect(article.getArticleLikes().length).toBe(1);
    expect(article.getArticleLikes()[0].getUser()).toBe(1);
  });

  test('TestThrowErrorForInvalidData', () => {
    expect(() =>
      new Article({ ...validArticleData, title: '' })
    ).toThrow('Title and summary are required');
    expect(() =>
      new Article({ ...validArticleData, summary: '' })
    ).toThrow('Title and summary are required');
    expect(() =>
      new Article({ ...validArticleData, picture: '' })
    ).toThrow('Picture is required');
    expect(() =>
      new Article({ ...validArticleData, publishedAt: new Date('invalid-date') })
    ).toThrow('Published date is invalid');
  });

  test('TestEqualsForIdenticalArticles', () => {
    const article1 = new Article(validArticleData);
    const article2 = new Article(validArticleData);

    expect(article1.equals(article2)).toBe(true);
  });

  test('TestEqualsForDifferentArticles', () => {
    const article1 = new Article(validArticleData);
    const article2 = new Article({ ...validArticleData, id: 2 });

    expect(article1.equals(article2)).toBe(false);
  });
  
});
