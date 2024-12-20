import { User } from '../../model/user';
import userService from '../../service/user.service';
import userDB from '../../repository/user.db';
import bcrypt from 'bcrypt';
import { generateJWTToken } from '../../util/jwt';

const user1 = new User({
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
const user2 = new User({
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    password: 'securepassword',
    role: 'admin',
    reviews: [],
    articles: [],
    articleLikes: [],
});
const users = [user1, user2];

const userInput = {
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'user',
    password: 'securepassword',
};


afterEach(() => {
    jest.clearAllMocks();
});

test('should fetch all users', async () => {
    jest.spyOn(userDB, 'getAllUsers').mockResolvedValue(users);
    const result = await userService.getAllUsers();
    expect(result).toEqual(users);
    expect(userDB.getAllUsers).toHaveBeenCalledTimes(1);
});

test('should return a user when username exists', async () => {
    jest.spyOn(userDB, 'getUserByUsername').mockResolvedValue(user1);
    const result = await userService.getUserByUsername({ username: 'johndoe' });
    expect(result).toEqual(user1);
    expect(userDB.getUserByUsername).toHaveBeenCalledWith({ username: 'johndoe' });
});

test('should throw an error when username does not exist', async () => {
    jest.spyOn(userDB, 'getUserByUsername').mockResolvedValue(null);
    await expect(userService.getUserByUsername({ username: 'unknown' })).rejects.toThrow(
        'User with username: unknown does not exist.'
    );
});

test('should create a user when username is unique', async () => {
    jest.spyOn(userDB, 'getUserByUsername').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedpassword');
    
    const userInput = {
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'user',
        password: 'securepassword',
    };

    const createdUser = new User({
        ...userInput,
        id: 1, 
        password: 'hashedpassword', 
        reviews: [],
        articles: [],
        articleLikes: [],
    });

    jest.spyOn(userDB, 'createUser').mockResolvedValue(createdUser);

    const result = await userService.createUser(userInput);

    expect(result).toEqual(createdUser);

    expect(userDB.getUserByUsername).toHaveBeenCalledWith({ username: 'johndoe' });
    expect(bcrypt.hash).toHaveBeenCalledWith('securepassword', expect.any(Number));
    expect(userDB.createUser).toHaveBeenCalledWith(expect.objectContaining({
        ...userInput,
        password: 'hashedpassword',
    }));
});


test('should throw an error if username already exists', async () => {
    jest.spyOn(userDB, 'getUserByUsername').mockResolvedValue(user1);

    await expect(userService.createUser(userInput)).rejects.toThrow(
        'User with username \"johndoe\" already exists'
    );
});

test('should return a token when credentials are correct', async () => {
    jest.spyOn(userDB, 'getUserByUsername').mockResolvedValue(user1);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    jest.spyOn(require('../../util/jwt'), 'generateJWTToken').mockReturnValue('token');

    const result = await userService.authenticate({
        username: 'johndoe',
        password: 'securepassword',
    });
    expect(result).toEqual({"fullname": "John Doe", "role": "user", "token": "token", "username": "johndoe"});
    expect(userDB.getUserByUsername).toHaveBeenCalledWith({ username: 'johndoe' });
    expect(bcrypt.compare).toHaveBeenCalledWith('securepassword', user1.getPassword());
    expect(require('../../util/jwt').generateJWTToken).toHaveBeenCalledWith(expect.objectContaining({
        id: user1.getId(),
        username: user1.getUsername(),
        role: user1.getRole(),
    }));
});

test('should throw an error if password is incorrect', async () => {
    jest.spyOn(userDB, 'getUserByUsername').mockResolvedValue(user1);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);


    await expect(
        userService.authenticate({ username: 'johndoe', password: 'wrongpassword' })
    ).rejects.toThrow('Incorrect Password.');
});

test('should delete a user if authorized', async () => {
    jest.spyOn(userDB, 'deleteUser').mockImplementation(async () => undefined);

    const result = await userService.deleteUser(1, 'admin', 2);
    expect(result).toBe(undefined);
    expect(userDB.deleteUser).toHaveBeenCalledWith(1);
});

test('should throw an error if not authorized', async () => {
    await expect(userService.deleteUser(1, 'user', 2)).rejects.toThrow(
        'UnauthorizedError: Only admins can delete other users'
    );
});
