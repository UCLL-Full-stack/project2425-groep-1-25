import Event from '../model/event';
import database from './database';

const findProfileEvent = async (profileId: number, eventId: number) => {
    return await database.profileEvent.findFirst({
        where: {
            profileId,
            eventId,
        },
    });
};
const getEventParticipants = async (eventId: number): Promise<number> => {
    try {
        return await database.profileEvent.count({
            where: {
                eventId: eventId,
            },
        });
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

export default { findProfileEvent, getEventParticipants, getEventsByProfile };
