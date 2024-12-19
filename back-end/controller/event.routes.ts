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
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         category:
 *           $ref: '#/components/schemas/Category'
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
 *     Location:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the location
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
 *     security:
 *       - bearerAuth: JWT
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
 *     security:
 *       - bearerAuth: JWT
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
 *       - bearerAuth: JWT
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
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     security:
 *       - bearerAuth: JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: The updated event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
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
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     security:
 *       - bearerAuth: JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted event
 */
eventRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { userName: string; role: string } };
        const { role } = request.auth;
        const id = Number(req.params.id);
        await eventService.deleteEvent(id, role as Role);
        res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /events/{id}/join:
 *   post:
 *     summary: Join an event
 *     security:
 *       - bearerAuth: JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of the participant
 *     responses:
 *       200:
 *         description: Successfully joined the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 */
eventRouter.post('/:id/join', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName } = req.body;
        const eventId = Number(req.params.id);
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
/**
 * @swagger
 * /events/{id}/participants:
 *   get:
 *     summary: Get the number of participants for an event
 *     security:
 *       - security: JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The number of participants
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 */
eventRouter.get('/:id/participants', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = Number(req.params.id);
        const participantCount = await eventService.getEventParticipants(eventId);
        res.status(200).json(participantCount);
    } catch (error) {
        next(error);
    }
});

eventRouter.get('/:userName/joined', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await eventService.getEventsOfParticipant(req.params.userName);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export { eventRouter };
