import { Router } from 'express';
import { getAllUsers, getUser, createUser } from '../controllers/user.controller.js';
const userRouter = Router();
 import authorize from '../middlewares/auth.middleware.js';
//  static parameter to get all users (GET/users)
// Dynamic parameter to get a user by ID (GET/users/:id) // GET/users/123

userRouter.get('/', getAllUsers);
userRouter.get('/:id', authorize, getUser);
userRouter.post('/', createUser);
userRouter.put('/:id', (req, res) => res.send({ body: { title : 'Update a User '}}));
userRouter.delete('/:id', (req, res) => res.send({ body: { title : 'Delete a User '}}));

export default userRouter;