import { Review } from "../../model/review"; 



describe('Review Model', () => {
  const validReviewData = {
    id: 1,
    title: 'Great Article',
    content: 'This article was very informative.',
    rating: 5,
    userId: 10,
    articleId: 20,
  };

  test('TestCreateReviewInstanceValidData', () => {
    const review = new Review(validReviewData);

    expect(review.getId()).toBe(1);
    expect(review.getTitle()).toBe('Great Article');
    expect(review.getContent()).toBe('This article was very informative.');
    expect(review.getRating()).toBe(5);
    expect(review.getUserid()).toBe(10);
    expect(review.getArticleId()).toBe(20);
  });

  test('TestThrowErrorForMissingTitleOrContent', () => {
    expect(() => new Review({ ...validReviewData, title: '' })).toThrow('Title and content are required');
    expect(() => new Review({ ...validReviewData, content: '' })).toThrow('Title and content are required');
  });

  test('TestThrowErrorForOutOfBoundsRating', () => {
    expect(() => new Review({ ...validReviewData, rating: -1 })).toThrow('Rating must be between 0 and 5');
    expect(() => new Review({ ...validReviewData, rating: 6 })).toThrow('Rating must be between 0 and 5');
  });

  test('TestValidateReviewInstancesAsEqual', () => {
    const review1 = new Review(validReviewData);
    const review2 = new Review(validReviewData);

    expect(review1.equals(review2)).toBe(true);
  });

  test('TestValidateReviewInstancesAsNotEqual', () => {
    const review1 = new Review(validReviewData);
    const review2 = new Review({ ...validReviewData, id: 2 });

    expect(review1.equals(review2)).toBe(false);
  });
});
