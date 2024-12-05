import eventDb from '../repository/event.db';
import { Event } from '../model/event';
import { EventInput } from '../types';
import locationService from './location.service';
import categoryService from './category.service';

const addEvent = async ({
    name,
    date,
    price,
    minParticipants,
    maxParticipants,
    location: LocationInput,
    category: CategoryInput,
}: EventInput): Promise<Event> => {
    try {
        const location = await locationService.addLocation(LocationInput);
        const category = await categoryService.addCategory(CategoryInput);

        const event = new Event({
            name,
            date,
            price,
            minParticipants,
            maxParticipants,
            location,
            category,
        });

        return await eventDb.addEvent(event);
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};

const getEventById = async (id: number): Promise<Event> => {
    const result = await eventDb.getEventById(id);
    if (!result) {
        throw new Error(`Error: No event with id ${id} found.`);
    }
    return result;
};

const getEvents = (): Promise<Event[]> => eventDb.getEvents();

export default {
    addEvent,
    getEventById,
    getEvents,
};
