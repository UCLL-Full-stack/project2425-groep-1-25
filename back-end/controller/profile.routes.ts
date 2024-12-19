import express, { NextFunction, Request, Response } from 'express';
import { ProfileInput } from '../types';
import profileService from '../service/profile.service';
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the profile
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         age:
 *           type: integer
 *           description: The age of the user
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         events:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Event'
 *           description: A list of events associated with the profile
 *     ProfileInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the profile
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         age:
 *           type: integer
 *           description: The age of the user
 *         category:
 *           $ref: '#/components/schemas/CategoryInput'
 *         location:
 *           $ref: '#/components/schemas/LocationInput'
 */
const profileRouter = express.Router();

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new Profile
 *     security:
 *       - bearerAuth: JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileInput'
 *     responses:
 *       200:
 *         description: The newly created profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 */
profileRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: string } };
        const { username } = request.auth;
        const profile = <ProfileInput>req.body;
        console.log(profile);
        const result = await profileService.completeProfile(username, profile);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// profileRouter.get('/:id/events', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const request = req as Request & { auth: { username: string; role: string } };

//         const id = Number(req.params.id);
//         const result = await profileService.getEventsByProfile(id);
//         res.status(200).json(result);
//     } catch (error) {
//         next(error);
//     }
// });

export default profileRouter;
