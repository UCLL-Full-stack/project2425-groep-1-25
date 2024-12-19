import { Category } from '../../model/category';
import { Location } from '../../model/location';
import { Profile } from '../../model/profile';
import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import userService from '../../service/user.service';
import bcrypt from 'bcrypt';

let mockUserDbGetUserByUserName: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;
let mockUserDbCreateUser: jest.Mock;
let mockUserDbGetProfileByUserId: jest.Mock;

beforeEach(() => {
    mockUserDbGetUserByUserName = jest.fn();
    mockUserDbGetUserByEmail = jest.fn();
    mockUserDbCreateUser = jest.fn();
    mockUserDbGetProfileByUserId = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});
let hashedPassword: string;
let testUser: User;
const testLocation = new Location({
    id: 1,
    street: 'Teststraat',
    number: 1,
    city: 'Brussel',
    country: 'Belgium',
});
const testCategory = new Category({ id: 1, name: 'Concert', description: 'Concert of artist' });

const testProfile = new Profile({
    id: 1,
    firstName: 'Jefke',
    lastName: 'Testje',
    age: 1,
    category: testCategory,
    location: testLocation,
});
beforeAll(async () => {
    hashedPassword = await bcrypt.hash('password', 12);
    testUser = new User({
        id: 1,
        userName: 'Jef',
        email: 'jef@gmail.com',
        role: 'Admin',
        password: hashedPassword,
        profile: testProfile,
    });
});

test('Given a valid userName, when getting user by userName, then user is returned.', async () => {
    userDb.getUserByUsername = mockUserDbGetUserByUserName.mockReturnValue(testUser);

    const result = await userService.getUserByUserName({ userName: 'Jef' });

    expect(mockUserDbGetUserByUserName).toHaveBeenCalledTimes(1);
    expect(result).toBe(testUser);
});

test('Given a userName that is not in the db, when getting user by userName, then error is thrown.', () => {
    userDb.getUserByUsername = mockUserDbGetUserByUserName.mockReturnValue(null);

    expect(userService.getUserByUserName({ userName: 'Jefke' })).rejects.toThrow(
        'Error: No user with username: Jefke'
    );
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledTimes(1);
});

test('Given a user with an already existing userName, when creating new user, then error is thrown', async () => {
    userDb.getUserByUsername = mockUserDbGetUserByUserName.mockReturnValue(testUser);
    await expect(
        userService.createUser({
            userName: 'Jef',
            email: 'test@gmail.com',
            role: 'Admin',
            password: 'passwd',
        })
    ).rejects.toThrow('Error: User with username Jef already exists.');
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledWith('Jef');
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledTimes(1);
});

test('Given a user with an already existing email, when creating new user, then error is thrown', async () => {
    userDb.getUserByUsername = mockUserDbGetUserByUserName.mockReturnValue(null);
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockReturnValue(testUser);
    await expect(
        userService.createUser({
            userName: 'TestUser',
            email: 'jef@gmail.com',
            role: 'Admin',
            password: 'passwd',
        })
    ).rejects.toThrow('Error: User with email jef@gmail.com already exists.');
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledWith('jef@gmail.com');
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
});

test('given a completely new user, when creating user, then new user is returned.', async () => {
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockReturnValue(null);
    userDb.getUserByUsername = mockUserDbGetUserByUserName.mockReturnValue(null);
    userDb.createUser = mockUserDbCreateUser.mockReturnValue(
        new User({
            id: 1,
            userName: 'testUser',
            email: 'test@gmail.com',
            role: 'Admin',
            password: hashedPassword,
            profile: undefined,
        })
    );
    const result = await userService.createUser({
        userName: 'testUser',
        email: 'test@gmail.com',
        password: 'password',
        role: 'Admin',
    });
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledWith('test@gmail.com');
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledWith('testUser');
    expect(mockUserDbCreateUser).toHaveBeenCalledTimes(1);

    expect(result.getUserName()).toBe('testUser');
    expect(result.getEmail()).toBe('test@gmail.com');
    expect(await bcrypt.compare('password', result.getPassword())).toBeTruthy;
});

test('given a valid authenticationInput of a user, when authenticating user, then authenticationResponse is returned', async () => {
    userDb.getUserByUsername = mockUserDbGetUserByUserName.mockReturnValue(testUser);
    const result = await userService.authenicate({
        userName: 'Jef',
        password: 'password',
        role: 'Admin',
    });

    expect(result.userName).toBe('Jef'), expect(result.role).toBe('Admin');
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledWith('Jef');
});

test('given invalid password, when authenticating, then error is thrown', async () => {
    userDb.getUserByUsername = mockUserDbGetUserByUserName.mockReturnValue(testUser);

    await expect(
        userService.authenicate({ userName: 'Jef', password: 'FoutPassword', role: 'Admin' })
    ).rejects.toThrow('Error: Incorrect password.');

    expect(mockUserDbGetUserByUserName).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledWith('Jef');
});

test('given a valid userName, when getting profileIdByUserName, then profileId is returned', async () => {
    userDb.getProfileByUserId = mockUserDbGetProfileByUserId.mockResolvedValue(testProfile);
    userDb.getUserByUsername = mockUserDbGetUserByUserName.mockResolvedValue(testUser);

    const result = await userService.getProfileIdByUserName('Jefke');

    expect(result).toBe(1);
    expect(mockUserDbGetProfileByUserId).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetProfileByUserId).toHaveBeenCalledWith(1);
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledWith('Jefke');
});
