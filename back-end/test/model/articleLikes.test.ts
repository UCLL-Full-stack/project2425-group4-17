import { ArticleLikes } from "../../model/articlelikes";

describe('ArticleLikes Model', () => {
  const validArticleLikesData = {
    id: 1,
    userId: 10,
    articleId: 20,
    date: new Date('2023-12-19'),
  };

  test('TestCreateArticleLikesInstanceValidData', () => {
    const articleLikes = new ArticleLikes(validArticleLikesData);

    expect(articleLikes.getId()).toBe(1);
    expect(articleLikes.getUser()).toBe(10);
    expect(articleLikes.getArticle()).toBe(20);
    expect(articleLikes.getDate()).toEqual(new Date('2023-12-19'));
  });
});