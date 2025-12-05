import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(arcjetMiddleware);
 
// middleware to parse the body of the request
// api/v1/auth/signup

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);
// root route
// / means the root of the website to the home page 
app.get('/', (req, res) => {
    res.send('Welcome to the SubDub Subscription API !');
});
app.use(errorMiddleware);

// Only start server if not in Vercel serverless environment
// Vercel will use the api/index.js handler instead
if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
    app.listen(PORT, async () => {
        console.log(`subscription tracker is running on http://localhost:${PORT}`);
        await connectDB();
    });
}

// export the app
export default app;