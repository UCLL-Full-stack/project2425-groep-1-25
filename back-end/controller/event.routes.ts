/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the event
 *         name:
 *           type: string
 *           description: The name of the event
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the event
 *         price:
 *           type: number
 *           description: The price of the event
 *         minParticipants:
 *           type: integer
 *           description: The minimum number of participants for the event
 *         maxParticipants:
 *           type: integer
 *           description: The maximum number of participants for the event
 *         lastEdit:
 *           type: string
 *           format: date-time
 *           description: The date and time of the last edit of the event
 *         dateCreated:
 *           type: string
 *           format: date-time
 *           description: The date and time of the creation of the event
 *     EventInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the event
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the event
 *         price:
 *           type: number
 *           description: The price of the event
 *         minParticipants:
 *           type: integer
 *           description: The minimum number of participants for the event
 *         maxParticipants:
 *           type: integer
 *           description: The maximum number of participants for the event
 *         location:
 *           $ref: '#/components/schemas/LocationInput'
 *         category:
 *           $ref: '#/components/schemas/CategoryInput'
 *     LocationInput:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           description: The street of the location
 *         number:
 *           type: integer
 *           description: The number of the location
 *         city:
 *           type: string
 *           description: The city of the location
 *         country:
 *           type: string
 *           description: The country of the location
 *     CategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: The description of the category
 */

import express, { NextFunction, Request, Response } from 'express';
import eventService from '../service/event.service';
import { EventInput, Role } from '../types';
import Event from '../model/event';
import userService from '../service/user.service';

const eventRouter = express.Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
eventRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await eventService.getEvents();
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
eventRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const event = await eventService.getEventById(id);
        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: The created event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
eventRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = <EventInput>req.body;
        const result = await eventService.addEvent(event);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

eventRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { userName: string; role: string } };
        const { role } = request.auth;
        const id = Number(request.params.id);
        const changedEvent = <EventInput>request.body;
        const result = await eventService.editEvent(id, changedEvent, role as Role);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

eventRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { userName: string; role: string } };
        const { role } = request.auth;
        const id = Number(req.params.id);
        eventService.deleteEvent(id, role as Role);
    } catch (error) {
        next(error);
    }
});

eventRouter.post('/:id/join', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('in join events back end router');
        const { userName } = req.body;
        const eventId = Number(req.params.id);
        console.log('in join events back end router: ' + eventId);
        console.log('in join events back end router: ' + userName);

        if (!userName) {
            throw new Error('userName is required');
        }

        const profileId = await userService.getProfileIdByUserName(userName);

        await eventService.joinEvent(eventId, profileId);
        res.status(200).json({ message: 'Successfully joined the event' });
    } catch (error) {
        next(error);
    }
});

eventRouter.get('/:id/participants', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = Number(req.params.id);
        const participantCount = await eventService.getEventParticipants(eventId);
        res.status(200).json({ eventId, participantCount });
    } catch (error) {
        next(error);
    }
});




export { eventRouter };
