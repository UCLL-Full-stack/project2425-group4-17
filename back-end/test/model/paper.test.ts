import { Paper } from '../../model/paper';
import { Article } from '../../model/article';
import { User } from '../../model/user';


describe('Paper Model', () => {
  const validPaperData = {
    id: 1,
    date: new Date('2023-12-19'),
    namePaper: 'Test News',
    namePublisher: 'Daily Test',
    articles: [
      new Article({
        id: 1,
        title: 'Test1',
        summary: 'testen.',
        picture: 'ai.jpg',
        publishedAt: new Date(),
        articleType: 'Technology',
        user:new User({
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
        reviews: [],
        articleLikes: [],
      }),
    ],
  };

  test('TestStaticFromMethodWithArticles', () => {
    const prismaData = {
      id: 1,
      date: new Date('2023-12-19'),
      namePaper: 'Test News',
      namePublisher: 'Daily Test',
    };

    const paper = Paper.from(prismaData);

    expect(paper.getId()).toBe(1);
    expect(paper.getDate()).toEqual(new Date('2023-12-19'));
    expect(paper.getNamrPaper()).toBe('Test News');
    expect(paper.getNamePublisher()).toBe('Daily Test');
    expect(paper.getArticles()).toEqual([]);
  });

  test('TestValidationThrowsOnInvalidDate', () => {
    expect(() => new Paper({ ...validPaperData, date: new Date('invalid-date') })).toThrow('Valid date is required');
  });

  test('TestEqualsWithDifferentArticles', () => {
    const paper1 = new Paper(validPaperData);
    const paper2 = new Paper({
      ...validPaperData,
      articles: [
        new Article({
          id: 2,
          title: 'Test 2',
          summary: 'andere Test',
          picture: 'diff.jpg',
          publishedAt: new Date(),
          articleType: 'Health',
          user:new User({
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
          reviews: [],
          articleLikes: [],
        }),
      ],
    });

    expect(paper1.equals(paper2)).toBe(true);
  });
});


