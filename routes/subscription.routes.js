import { Router } from "express";
import authorised from "../middleware/auth.middleware.js";
import { createSubscription, getAllSubscriptions } from "../controllers/subscription.controller.js";
import { getUserSubscriptions } from "../controllers/subscription.controller.js";



const subscriptionRouter = Router();

subscriptionRouter.get('/', authorised, getAllSubscriptions);

subscriptionRouter.get('/:id', (req, res) => res.send({ body: { title: 'get subscription by id' } }));

subscriptionRouter.post('/', authorised, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({ body: { title: 'update subscription by id' } }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ body: { title: 'delete subscription by id' } }));

subscriptionRouter.get('/user/:id', authorised, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ body: { title: 'cancel subscription by id' } }));

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ body: { title: 'get all upcoming renewals' } }));


export default subscriptionRouter;