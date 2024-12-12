import { User } from '../model/user';
import userDb from '../repository/user.db';
import { AuthenticationInput, AuthenticationResponse, UserInput } from '../types';
import bcrypt from 'bcrypt';
import { generateJWTtoken } from '../util/jwt';

const getAllUsers = (): Promise<User[]> => userDb.getAllUsers();

const getUserByUserName = async ({ userName }: { userName: string }): Promise<User> => {
    const user = await userDb.getUserByUsername(userName);
    if (!user) throw new Error(`Error: No user with username: ${userName}`);
    return user;
};

const createUser = async ({ userName, email, role, password }: UserInput): Promise<User> => {
    try {
        const existing = await userDb.getUserByUsername(userName);
        if (existing) {
            throw new Error(`User with username ${userName} already exists.`);
        }
        const existingEmail = await userDb.getUserByEmail(email);
        if (existingEmail) {
            throw new Error(`User with email ${email} already exists.`);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ userName, email, role, password: hashedPassword });

        return await userDb.createUser(user);
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};

const authenicate = async ({
    userName,
    role,
    password,
}: AuthenticationInput): Promise<AuthenticationResponse> => {
    try {
        const user = await getUserByUserName({ userName });
        const isValidPassword = await bcrypt.compare(password.trim(), user.getPassword().trim());

        if (!isValidPassword) throw new Error('Incorrect password.');

        return {
            token: generateJWTtoken({ username: userName, role: user.getRole() }),
            userName,
            role: user.getRole(),
        };
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};

const getProfileIdByUserName = async (userName: string): Promise<number> => {
    const user = await userDb.getUserByUsername(userName);

    if (!user) {
        throw new Error('User not found');
    }

    const profile = await userDb.getProfileByUserId(user.getId());

    if (!profile) {
        throw new Error('Profile not found');
    }

    return profile.id;
};

export default { getAllUsers, createUser, authenicate, getUserByUserName, getProfileIdByUserName };
