import { Profile } from '../model/profile';
import { User } from '../model/user';
import database from './database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => {
            return User.from(userPrisma);
        });
    } catch (error) {
        console.log(error);
        throw new Error('Database Error, see server log for more information');
    }
};

const getUserByUsername = async (username: string): Promise<User | null> => {
    const userPrisma = await database.user.findUnique({
        where: {
            userName: username,
        },
    });
    return userPrisma ? User.from(userPrisma) : null;
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    const userPrisma = await database.user.findUnique({
        where: {
            email: email,
        },
    });
    return userPrisma ? User.from(userPrisma) : null;
};

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                userName: user.getUserName(),
                email: user.getEmail(),
                role: user.getRole(),
                password: user.getPassword(),
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error, see server logs for more detail');
    }
};

const getProfileByUserId = async (userId: number) => {
    const profile = await database.profile.findUnique({
        where: {
            userId: userId,
        },
        include: {
            location: true,
            category: true,
        },
    });

    return profile ? Profile.from(profile) : null;
};

export default { getAllUsers, getUserByUsername, getUserByEmail, createUser, getProfileByUserId };
