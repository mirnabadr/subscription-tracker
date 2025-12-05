import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getSubscriptions } from '../controllers/subscription.controller.js';
const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({ body: { title : ' Get all Subscription details'}}));
subscriptionRouter.get('/:id', (req, res) => res.send({ body: { title : ' Get a Subscription details'}}));
subscriptionRouter.post('/', authorize, createSubscription); // create a new subscription
subscriptionRouter.put('/:id', (req, res) => res.send({ body: { title : ' Update a Subscription '}}));
subscriptionRouter.delete('/:id', (req, res) => res.send({ body: { title : ' Delete a Subscription '}}));
subscriptionRouter.get('/user/:id', authorize, getSubscriptions); // get all subscriptions for a user

subscriptionRouter.put('/user/:id', (req, res) => res.send({ body: { title : ' Cancel a Subscription for a user'}}));
subscriptionRouter.get('/upcoming-renewals/:id', (req, res) => res.send({ body: { title : ' Get upcoming Renewals for a user'}}));

export default subscriptionRouter;