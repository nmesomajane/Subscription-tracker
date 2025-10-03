import { Router } from "express";
import { getUsers} from "../controllers/user.controller.js";
import { getUser } from "../controllers/user.controller.js";
import authorised from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.use(authorised);

userRouter.get('/:id', authorised, getUser);

userRouter.post('/', (req, res) => res.send({ body: { title: 'create user' } }));

userRouter.put('/:id', (req, res) => res.send({ body: { title: 'update user' } }));

userRouter.delete('/:id', (req, res) => res.send({ body: { title: 'delete user' } }));



export default userRouter;