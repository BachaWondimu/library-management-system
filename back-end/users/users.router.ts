import {Router, json} from 'express';
import { signin_handler, signup_handler } from './users.handler';
import inventoriesRouter from '../inventories/inventories.router';
import { validateUser } from './users.middleware';

const usersRouter = Router();

usersRouter.post("/signup", json(), signup_handler)
usersRouter.post("/signin", json(), signin_handler)

usersRouter.use("/inventories",validateUser, inventoriesRouter)

export default usersRouter;