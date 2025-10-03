import './config/env.js'; // Load environment variables
import express from 'express';

const app = express();
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';           
import authRouter from './routes/auth.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';
import workflowRouter from './routes/workflow.route.js';

app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/workflows', workflowRouter);
app.use (errorMiddleware)
app.use (express.urlencoded({ extended: false }));
app.use(cookieParser());



app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(PORT, async () => {

    await connectToDatabase();
    console.log(`Server is running on port ${PORT}`);

   
  

});

export default app; 

