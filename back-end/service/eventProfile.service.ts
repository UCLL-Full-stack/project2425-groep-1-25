import eventProfileDb from '../repository/eventProfile.db';

const findProfileEvent = async (profileId: number, eventId: number) => {
    return await eventProfileDb.findProfileEvent(profileId, eventId);
};

const getEventParticipants = async (eventId: number): Promise<number> => {
    return await eventProfileDb.getEventParticipants(eventId);
};

const getEventsByProfile = async (profileId: number) => {
    return await eventProfileDb.getEventsByProfile(profileId);
};
export default { findProfileEvent, getEventParticipants, getEventsByProfile };
