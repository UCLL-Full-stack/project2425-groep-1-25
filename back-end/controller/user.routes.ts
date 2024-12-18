/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID
 *         userName:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         profile:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The profile ID
 *             firstName:
 *               type: string
 *               description: The first name of the user
 *             lastName:
 *               type: string
 *               description: The last name of the user
 *             age:
 *               type: integer
 *               description: The age of the user
 *             location:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The location ID
 *                 street:
 *                   type: string
 *                   description: The street of the location
 *                 number:
 *                   type: integer
 *                   description: The number of the location
 *                 city:
 *                   type: string
 *                   description: The city of the location
 *                 country:
 *                   type: string
 *                   description: The country of the location
 *             category:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The category ID
 *                 name:
 *                   type: string
 *                   description: The name of the category
 *                 description:
 *                   type: string
 *                   description: The description of the category
 *             events:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *     UserInput:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *     AuthenticationInput:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: The username of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *     AuthenticationResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: The JWT token
 *     CategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: The description of the category
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The category ID
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: The description of the category
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The event ID
 *         name:
 *           type: string
 *           description: The name of the event
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the event
 *         price:
 *           type: number
 *           description: The price of the event
 *         minParticipants:
 *           type: integer
 *           description: The minimum number of participants
 *         maxParticipants:
 *           type: integer
 *           description: The maximum number of participants
 *         location:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The location ID
 *             street:
 *               type: string
 *               description: The street of the location
 *             number:
 *               type: integer
 *               description: The number of the location
 *             city:
 *               type: string
 *               description: The city of the location
 *             country:
 *               type: string
 *               description: The country of the location
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The category ID
 *             name:
 *               type: string
 *               description: The name of the category
 *             description:
 *               type: string
 *               description: The description of the category
 */

import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userService from '../service/user.service';
import { AuthenticationInput, UserInput } from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Account made, login in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 */

userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        await userService.createUser(userInput);
        const response = await userService.authenicate(userInput);
        res.status(200).json({ message: 'Account made, login in', ...response });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticationInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 */

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, role, password } = <AuthenticationInput>req.body;
        const authenicated = await userService.authenicate({
            userName,
            role,
            password,
        });
        res.status(200).json({ message: 'Login successful', ...authenicated });
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /users/addCategory:
 *   post:
 *     summary: Add a category to a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 */
userRouter.post('/addCategory', async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
        next(error);
    }
});

export default userRouter;
