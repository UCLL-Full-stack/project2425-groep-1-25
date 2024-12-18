import { Event } from '../model/event';
import { EventInput } from '../types';
import database from './database';

const addEvent = async (event: Event): Promise<Event> => {
    try {
        const result = await database.event.create({
            data: {
                name: event.getName(),
                date: event.getDate(),
                price: event.getPrice(),
                minParticipants: event.getMinParticipants(),
                maxParticipants: event.getMaxParticipants(),
                location: {
                    connect: {
                        id: event.getLocation().getId(),
                    },
                },
                category: {
                    connect: {
                        id: event.getCategory().getId(),
                    },
                },
                dateCreated: event.getDateCreated(),
                lastEdit: event.getLastEdit(),
            },
            include: {
                location: true,
                category: true,
            },
        });
        return Event.from(result);
    } catch (error) {
        console.log(error);
        throw new Error('Database error, see server logs for more detail');
    }
};

const getEventById = async (id: number): Promise<Event | null> => {
    try {
        const result = await database.event.findUnique({
            where: { id: id },
            include: { location: true, category: true },
        });
        return result ? Event.from(result) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error, see server logs for more detail');
    }
};

const deleteEventById = async (id: number) => {
    try {
        await database.event.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.log(error);
        throw new Error('Database error, see server logs for more detail');
    }
};

const editEvent = async (id: number, changes: EventInput) => {
    try {
        await database.event.update({
            where: {
                id: id,
            },
            data: {
                name: changes.name,
                date: changes.date,
                price: changes.price,
                minParticipants: changes.minParticipants,
                maxParticipants: changes.maxParticipants,
                location: {
                    connect: {
                        id: changes.location.id,
                    },
                },
                category: {
                    connect: {
                        id: changes.category.id,
                    },
                },
                lastEdit: new Date(),
            },
            include: {
                location: true,
                category: true,
            },
        });
    } catch (error) {
        console.log(error);
        throw new Error('Database error, see server logs for more detail');
    }
};

const getEvents = async (): Promise<Event[]> => {
    try {
        const eventPrisma = await database.event.findMany({
            include: { location: true, category: true },
        });
        return eventPrisma.map((event) => Event.from(event));
    } catch (error) {
        console.log(error);
        throw new Error('Database Error, see server log for more detail');
    }
};

const joinEvent = async (eventId: number, profileId: number) => {
    const profileJoinedEvent = await database.profileEvent.findFirst({
        where: {
            eventId: eventId,
            profileId: profileId,
        },
    });

    if (profileJoinedEvent) {
        throw new Error('User already joined this event');
    }

    const totalParticipants = await getEventParticipants(eventId);
    const event = await database.event.findUnique({
        where: { id: eventId },
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (totalParticipants >= event.maxParticipants) {
        throw new Error('Event is full');
    }
    try {
        await database.profileEvent.create({
            data: {
                eventId,
                profileId,
            },
        });
    } catch (error) {
        console.log(error);
        throw new Error('Database Error, see server log for more detail');
    }
};

const getEventParticipants = async (eventId: number): Promise<number> => {
    try {
        const participants = await database.profileEvent.count({
            where: {
                eventId: eventId,
            },
        });
        return participants;
    } catch (error) {
        console.log(error);
        throw new Error('Database Error, see server log for more detail');
    }
};

const getEventsByProfile = async (profileId: number): Promise<Event[]> => {
    try {
        const eventsPrisma = await database.profileEvent.findMany({
            where: {
                profileId: profileId,
            },
            include: {
                event: { include: { location: true, category: true } },
            },
        });
        return eventsPrisma.map((eventPrisma) => Event.from(eventPrisma.event));
    } catch (error) {
        console.log(error);
        throw new Error('Database Error, see server log for more detail');
    }
};

export default {
    addEvent,
    getEventById,
    deleteEventById,
    editEvent,
    getEvents,
    joinEvent,
    getEventParticipants,
    getEventsByProfile,
};
