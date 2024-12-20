import { User } from '../../model/user';
import { User as UserPrisma } from '@prisma/client';

describe('User Model', () => {
  const validUserData = {
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
  };

  test('TestCreateUserInstanceValidData', () => {
    const user = new User(validUserData);

    expect(user.getId()).toBe(1);
    expect(user.getFirstName()).toBe('bram');
    expect(user.getLastName()).toBe('roden');
    expect(user.getEmail()).toBe('bram@example.com');
    expect(user.getUsername()).toBe('bramroden');
    expect(user.getPassword()).toBe('passwoord');
    expect(user.getRole()).toBe('user');
    expect(user.getReviews()).toEqual([]);
    expect(user.getArticles()).toEqual([]);
    expect(user.getArticleLikes()).toEqual([]);
  });

  test('TestThrowErrorInvalidEmail', () => {
    const invalidEmailData = { ...validUserData, email: 'invalid-email' };

    expect(() => new User(invalidEmailData)).toThrow('Invalid email address');
  });

  test('TestThrowErrorShortPassword', () => {
    const shortPasswordData = { ...validUserData, password: '123' };

    expect(() => new User(shortPasswordData)).toThrow('Password must be at least 6 characters long');
  });

  test('TestValidateSameUserInstances', () => {
    const user1 = new User(validUserData);
    const user2 = new User(validUserData);

    expect(user1.equals(user2)).toBe(true);
  });

  test('TestValidateUsersInstancesNotEqual', () => {
    const user1 = new User(validUserData);
    const user2 = new User({ ...validUserData, id: 2 });

    expect(user1.equals(user2)).toBe(false);
  });

});
