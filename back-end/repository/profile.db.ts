import { Event } from '../model/event';
import { Profile } from '../model/profile';
import database from './database';
import eventDb from './event.db';

const addProfile = async (id: number, profile: Profile): Promise<Profile> => {
    try {
        const result = await database.profile.create({
            data: {
                firstName: profile.getFirstName(),
                lastName: profile.getLastName(),
                age: profile.getAge(),
                location: {
                    connect: {
                        id: profile.getLocation().getId(),
                    },
                },
                category: {
                    connect: {
                        id: profile.getCategory().getId(),
                    },
                },
                user: {
                    connect: {
                        id,
                    },
                },
            },
            include: {
                location: true,
                category: true,
            },
        });
        return Profile.from(result);
    } catch (error) {
        console.log(error);
        throw new Error('Database error, see server logs for more detail');
    }
};

const getEventsByProfile = async (id: number): Promise<Event[]> => {
    try {
        const result = await database.profile.findUnique({
            where: { id: id },
            include: { events: true },
        });

        if (!result) {
            return [];
        }

        const events = await Promise.all(result.events.map(async (event) => {
            return await eventDb.getEventById(event.eventId);
        }));

        return events.filter(event => event !== null) as Event[];
    } catch (error) {
        console.log(error);
        throw new Error('Database error, see server logs for more detail');
    }
}

const getEventsByUserName = async (userName: string): Promise<Event[]> => {
    try {
        // Find the user by userName
        const user = await database.user.findUnique({
            where: { userName },
        });

        if (!user) {
            return [];
        }

        // Find the profile by userId
        const result = await database.profile.findUnique({
            where: { userId: user.id },
            include: { events: true },
        });

        if (!result) {
            return [];
        }


        const events = await Promise.all(result.events.map(async (event) => {
            return await eventDb.getEventById(event.eventId);
        }));

        return events.filter(event => event !== null) as Event[];
    } catch (error) {
        console.log(error);
        throw new Error('Database error, see server logs for more detail');
    }
}

export default { addProfile, getEventsByProfile, getEventsByUserName };
