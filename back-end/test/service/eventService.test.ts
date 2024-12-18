import { Category } from '../../model/category';
import Event from '../../model/event';
import { Location } from '../../model/location';
import { Profile } from '../../model/profile';
import { User } from '../../model/user';
import eventDb from '../../repository/event.db';
import eventProfileDb from '../../repository/eventProfile.db';
import userDb from '../../repository/user.db';
import eventService from '../../service/event.service';

const locationInput = {
    id: 1,
    street: 'Teststraat',
    number: 1,
    city: 'Brussel',
    country: 'Belgium',
};

const categoryInput = { id: 1, name: 'Concert', description: 'Concert of artist' };

const eventInput = {
    name: 'Testevent',
    date: new Date(3000, 11, 2),
    price: 5,
    minParticipants: 5,
    maxParticipants: 10,
    location: locationInput,
    category: categoryInput,
};

const testLocation = new Location({
    id: 1,
    street: 'Teststraat',
    number: 1,
    city: 'Brussel',
    country: 'Belgium',
});

const testCategory = new Category({ id: 1, name: 'Concert', description: 'Concert of artist' });

const testEvent = new Event({
    id: 1,
    name: 'Testevent',
    date: new Date(3000, 11, 2),
    price: 5,
    minParticipants: 5,
    maxParticipants: 10,
    location: testLocation,
    category: testCategory,
});
const testProfile = new Profile({
    id: 1,
    firstName: 'Jefke',
    lastName: 'Testje',
    age: 1,
    category: testCategory,
    location: testLocation,
});
const testUser = new User({
    id: 1,
    userName: 'Jefke',
    email: 'Jefke@gmail.com',
    role: 'Admin',
    password: 'jefke',
    profile: testProfile,
});
//mocking
let addEventMock: jest.Mock;
let getEventsMock: jest.Mock;
let mockEventDbAddEvent: jest.Mock;
let mockEventDbGetEventById: jest.Mock;
let mockEventDbDeleteEventById: jest.Mock;
let mockEventDbEditEvent: jest.Mock;
let mockEventProfileDbGetEventParticipants: jest.Mock;
let mockEventProfileDbgetEventsByProfile: jest.Mock;
let mockEventDbJoinEvent: jest.Mock;
let mockEventProfileDbFindProfileEvent: jest.Mock;

let mockUserDbGetProfileByUserId: jest.Mock;
let mockUserDbGetUserByUserName: jest.Mock;

beforeEach(() => {
    addEventMock = jest.fn();
    getEventsMock = jest.fn();
    mockEventDbAddEvent = jest.fn();
    mockEventDbGetEventById = jest.fn();
    mockEventDbDeleteEventById = jest.fn();
    mockEventDbEditEvent = jest.fn();
    mockEventProfileDbFindProfileEvent = jest.fn();
    mockEventProfileDbgetEventsByProfile = jest.fn();
    mockEventProfileDbGetEventParticipants = jest.fn();
    mockEventDbJoinEvent = jest.fn();
    mockUserDbGetProfileByUserId = jest.fn();
    mockUserDbGetUserByUserName = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});
test('Given a valid event, when adding an event, then event is added', async () => {
    //given
    eventService.addEvent = addEventMock.mockResolvedValue(testEvent);
    eventDb.addEvent = mockEventDbAddEvent.mockResolvedValue(testEvent);
    //when
    await eventService.addEvent(eventInput);
    //then
    expect(addEventMock).toHaveBeenCalledTimes(1);
    expect(addEventMock).toHaveBeenCalledWith(eventInput);
});

test('Given a valid id, when getting an event by id, then an event is returned', async () => {
    //given
    eventDb.getEventById = mockEventDbGetEventById.mockResolvedValue(testEvent);
    //when
    const result = await eventService.getEventById(1);
    //then
    expect(mockEventDbGetEventById).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Event);
});
test('Given a invalid id, when getting an event by id, then an error is returned', () => {
    //given
    eventDb.getEventById = mockEventDbGetEventById.mockResolvedValue(null);
    //when
    expect(eventService.getEventById(100000)).rejects.toThrow(
        'Error: No event with id 100000 found.'
    );
    //then
    expect(mockEventDbGetEventById).toHaveBeenCalledTimes(1);
});

test('given the getEvents function, when getting events, then events are returned', async () => {
    //given
    eventService.getEvents = getEventsMock.mockResolvedValue([testEvent, testEvent]);
    //when
    const result = await eventService.getEvents();
    //then
    expect(Array.isArray(result)).toBe(true);
    result.forEach((event) => expect(event).toBeInstanceOf(Event));
});

test('given a normal user, when deleting an event, an error is thrown', () => {
    expect(eventService.deleteEvent(1, 'User')).rejects.toThrow(
        'Error: Only an administrator can delete events.'
    );
});

test('given a admin, when deleting an event, an error is thrown', async () => {
    //given
    eventDb.deleteEventById = mockEventDbDeleteEventById;

    //when
    await eventService.deleteEvent(1, 'Admin');

    expect(mockEventDbDeleteEventById).toHaveBeenCalledTimes(1);
    expect(mockEventDbDeleteEventById).toHaveBeenCalledWith(1);
});

test('given valid eventInput and right role, when editting an event, then event is changed', async () => {
    //given
    eventDb.editEvent = mockEventDbEditEvent;
    const eventInput = {
        id: 1,
        name: 'test',
        date: new Date(),
        price: 5,
        minParticipants: 5,
        maxParticipants: 10,
        location: locationInput,
        category: categoryInput,
    };
    //when
    await eventService.editEvent(1, eventInput, 'Mod');

    expect(mockEventDbEditEvent).toHaveBeenCalledTimes(1);
    expect(mockEventDbEditEvent).toHaveBeenCalledWith(1, eventInput);
});
test('given valid eventInput and false role, when editting an event, then event is changed', async () => {
    //given
    eventDb.editEvent = mockEventDbEditEvent;
    const eventInput = {
        id: 1,
        name: 'test',
        date: new Date(),
        price: 5,
        minParticipants: 5,
        maxParticipants: 10,
        location: locationInput,
        category: categoryInput,
    };
    //when
    await expect(eventService.editEvent(1, eventInput, 'User')).rejects.toThrow(
        'Error: Only an administrator or event moderator can edit events.'
    );

    expect(mockEventDbEditEvent).toHaveBeenCalledTimes(0);
});

test('Given a valid user- and eventid, when joining an event, then user is added to the event participants (profile/event)', async () => {
    //given
    eventDb.joinEvent = mockEventDbJoinEvent;
    eventDb.getEventById = mockEventDbGetEventById.mockResolvedValue(testEvent);
    eventProfileDb.findProfileEvent = mockEventProfileDbFindProfileEvent.mockResolvedValue(null);
    eventProfileDb.getEventParticipants =
        mockEventProfileDbGetEventParticipants.mockResolvedValue(0);

    //when
    await eventService.joinEvent(1, 1);

    //then
    expect(mockEventProfileDbGetEventParticipants).toHaveBeenCalledTimes(1);
    expect(mockEventProfileDbGetEventParticipants).toHaveBeenCalledWith(1);
    expect(mockEventProfileDbFindProfileEvent).toHaveBeenCalledTimes(1);
    expect(mockEventProfileDbFindProfileEvent).toHaveBeenCalledWith(1, 1);
    expect(mockEventDbJoinEvent).toHaveBeenCalledTimes(1);
    expect(mockEventDbJoinEvent).toHaveBeenCalledWith(1, 1);
    expect(mockEventDbGetEventById).toHaveBeenCalledWith(1);
});

test('Given a valid user- and eventid, but with the max amount of participants, when joining event, then error is thrown', async () => {
    //given
    eventDb.joinEvent = mockEventDbJoinEvent;
    eventDb.getEventById = mockEventDbGetEventById.mockResolvedValue(testEvent);
    eventProfileDb.findProfileEvent = mockEventProfileDbFindProfileEvent.mockResolvedValue(null);
    eventProfileDb.getEventParticipants =
        mockEventProfileDbGetEventParticipants.mockResolvedValue(10);

    //when
    expect(eventService.joinEvent(1, 1)).rejects.toThrow('Event is full');
});

test('Given a valid eventid, when getting amount of participants, then amount is returned', async () => {
    eventProfileDb.getEventParticipants =
        mockEventProfileDbGetEventParticipants.mockResolvedValue(5);
    eventDb.getEventById = mockEventDbGetEventById.mockResolvedValue(testEvent);
    //when
    const result = await eventService.getEventParticipants(1);

    //then
    expect(mockEventProfileDbGetEventParticipants).toHaveBeenCalledTimes(1);
    expect(mockEventProfileDbGetEventParticipants).toHaveBeenCalledWith(1);
    expect(result).toBe(5);
});

test('Given a participant with a joined event, when getting events of that participant, then event is returned', async () => {
    //given
    eventProfileDb.getEventsByProfile =
        mockEventProfileDbgetEventsByProfile.mockResolvedValue(testEvent);
    userDb.getProfileByUserId = mockUserDbGetProfileByUserId.mockResolvedValue(testProfile);
    userDb.getUserByUsername = mockUserDbGetUserByUserName.mockResolvedValue(testUser);
    //when
    const result = await eventService.getEventsOfParticipant('Jefke');

    //then
    expect(mockEventProfileDbgetEventsByProfile).toHaveBeenCalledTimes(1);
    expect(mockEventProfileDbgetEventsByProfile).toHaveBeenCalledWith(1);
    expect(mockUserDbGetProfileByUserId).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetProfileByUserId).toHaveBeenCalledWith(1);
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUserName).toHaveBeenCalledWith('Jefke');
    expect(result).toBe(testEvent);
});
