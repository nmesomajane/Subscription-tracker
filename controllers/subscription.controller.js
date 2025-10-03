import { workflowClient } from "../config/upstash.js";

export const  createSubscription = async (req, res, next) => {
    try{
      const subscription = await Subscription.create({
        ...req.body, user: req.user._id
      });

      // Trigger the workflow to send a reminder email

      const {workflowRunId}=await workflowClient.trigger ({
        url:`${SERVER_URL}/api/v1/workflow/subscription/reminder`,
        body:{subscriptionId:subscription._id},
        headers:{'Content-Type':'application/json'},
        retries:0
      });

      res.status(201).json({ success: true, data: subscription, workflowRunId });
    } catch (error) {
        next(error);
    }
} 


export const getUserSubscriptions = async (req, res, next) => {
    try{
        //check if the user is the same as the one in the token
      if(req.user.id !== req.params.id){
        const error = new Error('Not authorized to view these subscriptions');
        error.statusCode = 403;
        throw error;
      }
      const subscriptions = await subscriptions.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try{
      const subscriptions = await subscriptions.find();
      res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }   
}


