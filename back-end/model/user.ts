import { profile } from 'console';
import { Profile } from './profile';
import {
    User as userPrisma,
    Profile as profilePrisma,
    Category as categoryPrisma,
    Location as locationPrisma,
} from '@prisma/client';

export class User {
    private id?: number;
    private userName: string;
    private password: string;
    private profile: Profile;

    constructor(user: { id?: number; userName: string; password: string; profile: Profile }) {
        this.validate(user);
        this.userName = user.userName;
        this.password = user.password;
        this.profile = user.profile;
    }

    validate(user: { userName: string; password: string; profile: Profile }) {
        if (!user.userName) throw new Error('Username is required.');
        if (!user.password) throw new Error('Password is required.');
        // Profile is validated with creation of profile
    }

    getUserName(): string {
        return this.userName;
    }

    getPassword(): string {
        return this.password;
    }

    getProfile(): Profile {
        return this.profile;
    }

    static from = ({
        id,
        userName,
        password,
        profile,
    }: userPrisma & {
        profile: profilePrisma & { location: locationPrisma; category: categoryPrisma };
    }) => {
        return new User({
            id,
            userName,
            password,
            profile: Profile.from(profile),
        });
    };
}
