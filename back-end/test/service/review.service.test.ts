import { Review } from '../../model/review';
import reviewService from '../../service/review.service';
import reviewDB from '../../repository/review.db';
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
const reviewData = {
    id: 1,
    title: "Excellent Read",
    content: "The article provides detailed insights into the topic.",
    rating: 4,
    userId: 1,
    articleId: 1
};
const review = new Review({ ...reviewData, id: 1 });
const review2 = new Review({
    id: 2,
    title: "Excellent",
    content: "The article provides detailed insights into the topic.",
    rating: 4,
    userId: 1,
    articleId: 1
});

const reviews = [review, review2];
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


afterEach(() => {
    jest.clearAllMocks();
});

test('should fetch all reviews', async () => {
    
    jest.spyOn(reviewDB, 'getAllReviews').mockResolvedValue(reviews);

    const result = await reviewService.getAllReviews();

    expect(result).toEqual(reviews);
    expect(reviewDB.getAllReviews).toHaveBeenCalledTimes(1);
});

test('should create a review when valid user and article exist', async () => {
    

    jest.spyOn(userDB, 'getUserById').mockResolvedValue(user);
    jest.spyOn(articleDB, 'getArticleById').mockResolvedValue(article);
    jest.spyOn(reviewDB, 'addReview').mockResolvedValue(review);

    const result = await reviewService.createReview(reviewData, 1, 1);

    expect(result).toEqual(review);
    expect(userDB.getUserById).toHaveBeenCalledWith({ id: 1 });
    expect(articleDB.getArticleById).toHaveBeenCalledWith(1);
    expect(reviewDB.addReview).toHaveBeenCalledWith(expect.any(Review));
});

test('should throw an error when user does not exist', async () => {
    jest.spyOn(userDB, 'getUserById').mockResolvedValue(null);

    await expect(
        reviewService.createReview(reviewData, 1, 1)
    ).rejects.toThrow('User not found');
});

test('should throw an error when article does not exist', async () => {
    jest.spyOn(userDB, 'getUserById').mockResolvedValue(user);
    jest.spyOn(articleDB, 'getArticleById').mockResolvedValue(null);

    await expect(
        reviewService.createReview(reviewData, 1, 1)
    ).rejects.toThrow('Article not found');
});

test('should edit a review when authorized', async () => {
    jest.spyOn(reviewDB, 'getReviewById').mockResolvedValue(review);
    jest.spyOn(reviewDB, 'editReview').mockResolvedValue(review);

    const result = await reviewService.editReview(1, { content: 'Updated Content' }, 1, 'user');

    expect(result).toEqual(review);
    expect(reviewDB.editReview).toHaveBeenCalledWith(1, { content: 'Updated Content' });
});

test('should delete a review when authorized', async () => {
    jest.spyOn(reviewDB, 'getReviewById').mockResolvedValue(review);
    jest.spyOn(reviewDB, 'deleteReview').mockResolvedValue();

    await reviewService.deleteReview(1, 1, 'admin');

    expect(reviewDB.deleteReview).toHaveBeenCalledWith(1);
});

