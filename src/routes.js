import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';
import OrganizingController from './app/controllers/OrganizingController';

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
routes.put('/meetups/:id', MeetupController.update);
routes.post('/meetups', MeetupController.store);
routes.delete('/meetups/:id', MeetupController.destroy);

//Organizing
routes.get('/organizing', OrganizingController.index);

export default routes;
