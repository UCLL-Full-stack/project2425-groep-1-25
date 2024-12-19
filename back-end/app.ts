import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { eventRouter } from './controller/event.routes';
import { expressjwt } from 'express-jwt';
import userRouter from './controller/user.routes';
import { categoryRouter } from './controller/category.routes';
import profileRouter from './controller/profile.routes';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            connectSrc: ["'self'", 'https://api.ucll.be/'],
        },
    })
);
dotenv.config();
const port = process.env.APP_PORT || 3000;

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Eventer API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);

app.use(cors());
app.use(bodyParser.json());
app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users/signup', '/status'],
    })
);
app.use('/events', eventRouter);
app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/profiles', profileRouter);
app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'CoursesError') {
        res.status(400).json({ status: 'domain error', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});

export default app;
