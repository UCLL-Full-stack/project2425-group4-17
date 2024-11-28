import { User } from '../model/user';
import database from '../util/database';
import bcrypt from 'bcrypt';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByUsername = async ({ username }: { username: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username: user.getUsername(),
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                email: user.getEmail(),
                role: user.getRole(),
                password: user.getPassword(),
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error saving user to the database.');
    }
};

const updateUser = async (id: number, updates: Partial<{ firstName: string; lastName: string; username: string }>): Promise<User> => {
    try {
        const userPrisma = await database.user.update({
            where: { id },
            data: updates,
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating user in the database.');
    }
};

const deleteUser = async (id: number): Promise<void> => {
    try {
        await database.user.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. Unable to delete user.');
    }
};

export default {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser
};