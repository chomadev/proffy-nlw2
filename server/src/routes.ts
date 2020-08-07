import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsControlles';

const routes = express.Router();

const classController = new ClassesController();

routes.get('/classes', classController.index);
routes.post('/classes', classController.create);

const connectionsController = new ConnectionsController();
routes.get('/connections', connectionsController.index)
routes.post('/connections', connectionsController.create)

export default routes;