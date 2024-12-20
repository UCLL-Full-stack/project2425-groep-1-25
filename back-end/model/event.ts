import { Location } from './location';
import { Category } from './category';
import {
    Event as eventPrisma,
    Location as locationPrisma,
    Category as categoryPrisma,
} from '@prisma/client';

export class Event {
    private id?: number;
    private name: string;
    private date: Date;
    private price: number;
    private minParticipants: number;
    private maxParticipants: number;
    private location: Location;
    private category: Category;
    private lastEdit: Date;
    private dateCreated: Date;

    constructor(event: {
        id?: number;
        name: string;
        date: Date;
        price: number;
        minParticipants: number;
        maxParticipants: number;
        location: Location;
        category: Category;
    }) {
        this.validate(event);
        this.id = event.id;
        this.name = event.name;
        this.date = event.date;
        this.price = event.price;
        this.minParticipants = event.minParticipants;
        this.maxParticipants = event.maxParticipants;
        this.location = event.location;
        this.category = event.category;
        this.lastEdit = new Date();
        this.dateCreated = new Date();
    }

    validate(event: {
        name: string;
        date: Date;
        price: number;
        minParticipants: number;
        maxParticipants: number;
        location: Location;
        category: Category;
    }) {
        if (!event.name?.trim()) throw new Error('Name is required.');
        if (event.price < 0) throw new Error('Price must be positive.');
        if (event.minParticipants < 0) throw new Error('Minimum participants must be positive.');
        if (!event.maxParticipants) throw new Error('Maximum participants is required.');
        if (event.maxParticipants < 0) throw new Error('Maximum participants must be positive.');
        if (event.maxParticipants < event.minParticipants)
            throw new Error('Minimum participants must be greater than minimum participants.');
        //dates (lastEdit and dateCreated) are changed/added when instance is made or editted
    }

    getId(): number {
        return this.id ? this.id : -1;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }
    getDate(): Date {
        return this.date;
    }
    setDate(date: Date): void {
        this.date = date;
    }

    getPrice(): number {
        return this.price;
    }
    setPrice(price: number): void {
        this.price = price;
    }

    getMinParticipants(): number {
        return this.minParticipants;
    }

    setMinParticipants(min: number): void {
        this.minParticipants = min;
    }

    getMaxParticipants(): number {
        return this.maxParticipants;
    }

    setMaxParticipants(max: number): void {
        this.maxParticipants = max;
    }

    getLocation(): Location {
        return this.location;
    }

    setLocation(location: Location): void {
        this.location = location;
    }

    getCategory(): Category {
        return this.category;
    }

    setCategory(category: Category): void {
        this.category = category;
    }

    getLastEdit(): Date {
        return this.lastEdit;
    }

    setLastEdit(date: Date): void {
        this.lastEdit = date;
    }

    getDateCreated(): Date {
        return this.dateCreated;
    }
    setDateCreated(date: Date): void {
        this.dateCreated = date;
    }

    static from({
        id,
        name,
        date,
        price,
        minParticipants,
        maxParticipants,
        location,
        category,
    }: eventPrisma & { location: locationPrisma; category: categoryPrisma }) {
        return new Event({
            id,
            name,
            date,
            price,
            minParticipants,
            maxParticipants,
            location: Location.from(location),
            category: Category.from(category),
        });
    }
}

export default Event;
