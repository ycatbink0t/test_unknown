import { Router } from 'express';
import { userController } from '../controllers/user-controller';
import { body } from 'express-validator';

const userRouter = Router()
    .get('/generate', userController.generate)
    .get('/', userController.get)
    .put('/:userId', userController.put)
    .delete('/:userId', userController.delete)
    .post('/login',
        [body('email').isEmail(), body('password')],
        userController.login)

export { userRouter };
