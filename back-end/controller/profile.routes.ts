import express, { NextFunction, Request, Response } from 'express';
import { ProfileInput } from '../types';
import profileService from '../service/profile.service';

const profileRouter = express.Router();

profileRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: string } };
        const { username } = request.auth;
        const profile = <ProfileInput>req.body;

        const result = await profileService.completeProfile(username, profile);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

profileRouter.get('/:id/events', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: string } };
        const { username } = request.auth;

        const id = Number(req.params.id);
        const result = await profileService.getEventsByProfile(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

profileRouter.get('/events', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: string } };
        const { username } = request.auth;
        console.log(username);
        const result = await profileService.getEventsByUserName(username);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export default profileRouter;
