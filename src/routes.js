import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Abaixo estão as rotas que precisam passar pelo middleware de autenticação.
routes.use(authMiddleware);
routes.put('/users', UserController.update);

//Files
routes.post('/files', upload.single('file'), FileController.store);

//Meetups
routes.get('/meetups', MeetupController.index);
export default routes;
