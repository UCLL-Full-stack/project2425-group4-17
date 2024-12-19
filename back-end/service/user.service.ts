import { User } from '../model/user';
import userDB from '../repository/user.db';
import { UserInput } from '../types';
import { generateJWTToken } from '../util/jwt';
import { AuthenticationResponse } from '../types';
import bcrypt from 'bcrypt';
import { error } from 'console';

const getAllUsers = async (): Promise<User[]> => userDB.getAllUsers();

const getUserByUsername = async ({ username }: { username: string }): Promise<User> => {
    const user = await userDB.getUserByUsername({ username });
    if (!user) {
        throw new Error(`User with username: ${username} does not exist.`);
    }
    return user;
};

const getProfile = async ({ username }: { username: string }): Promise<User> => {
    const user = await userDB.getUserByUsername({ username });
    if (!user) {
        throw new Error(`User with username: ${username} does not exist.`);
    }
    return user;
};

const createUser = async ({username, firstName, lastName, email, role, password }: UserInput): Promise<User> => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }
    const existingUser = await userDB.getUserByUsername({ username });
    if (existingUser) {
        throw new Error(`User with username "${username}" already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        username,
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        role: role || 'guest',
        password: hashedPassword,
        reviews: [],
        articles: [],
        articleLikes: [],
    });
    return await userDB.createUser(newUser);
};

const updateUser = async (id: number, updates: Partial<{ firstName: string; lastName: string; username: string }>): Promise<User> => {
    if (updates.username) {
        const existingUser = await userDB.getUserByUsername({ username: updates.username });
        if (existingUser && existingUser.getId() !== id) {
            throw new Error(`Username "${updates.username}" is already taken by another user.`);
        }
    }

    return await userDB.updateUser(id, updates);
};

const authenticate = async ({ username, password }: UserInput): Promise<AuthenticationResponse> => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const user = await getUserByUsername({ username });

    const isValidPassword = await bcrypt.compare(password, user.getPassword());
    if (!isValidPassword) {
        throw new Error('Incorrect Password.');
    }

    return {
        token: generateJWTToken({ username, role: user.getRole(), id: user.getId() }),
        username,
        fullname: `${user.getFirstName()} ${user.getLastName()}`,
        role: user.getRole()
    };
};

const deleteUser = async (id: number, role: string, currentUserId: number): Promise<void> => {
    if (role !== 'admin' && id !== currentUserId) {
        throw new Error('UnauthorizedError: Only admins can delete other users');
    }

    try {
        await userDB.deleteUser(id);
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting user from the database.');
    }
};


export default { getAllUsers, getUserByUsername, getProfile, createUser, updateUser, authenticate, deleteUser };