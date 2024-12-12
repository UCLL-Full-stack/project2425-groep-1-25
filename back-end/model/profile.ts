import { Category } from './category';
import { Location } from './location';
import { Event } from './event';
import {
    Profile as profilePrisma,
    Location as locationPrisma,
    Category as categoryPrisma,
} from '@prisma/client';

export class Profile {
    private id?: number;
    private firstName: string;
    private lastName: string;
    private age: number;
    private location: Location;
    private category: Category;
    private events: Event[];

    constructor(profile: {
        id?: number;
        firstName: string;
        lastName: string;
        age: number;
        location: Location;
        category: Category;
        events?: Event[];
    }) {
        this.validate(profile);
        this.id = profile.id;
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.age = profile.age;
        this.location = profile.location;
        this.category = profile.category;
        this.events = profile.events || [];
    }

    validate(profile: {
        firstName: string;
        lastName: string;
        age: number;
        location: Location;
        category: Category;
    }) {
        if (!profile.firstName) throw new Error('First name is required.');
        if (!profile.lastName) throw new Error('Last name is required.');
        if (!profile.age) throw new Error('Age is required.');
        if (!profile.location) throw new Error('Location is required.');
        if (!profile.category) throw new Error('Category is required.');
    }

    getId(): number {
        if (!this.id) throw new Error('Profile has not been saved yet.');
        return this.id;
    }

    getAge(): number {
        return this.age;
    }

    getLastName(): string {
        return this.lastName;
    }
    getFirstName(): string {
        return this.firstName;
    }
    getLocation(): Location {
        return this.location;
    }
    getCategory(): Category {
        return this.category;
    }
    getEvents(): Event[] {
        return this.events;
    }
    addEvent(event: Event) {
        this.events.push(event);
    }

    static from = ({
        id,
        firstName,
        lastName,
        age,
        location,
        category,
    }: profilePrisma & {
        location: locationPrisma;
        category: categoryPrisma;
    }) => {
        return new Profile({
            id,
            firstName,
            lastName,
            age,
            location: Location.from(location),
            category: Category.from(category),
        });
    };
}
