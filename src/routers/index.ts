import { Router } from 'express';
import { userRouter } from './user-router';

const router = Router()
    .use('/users', userRouter);

export { router };
