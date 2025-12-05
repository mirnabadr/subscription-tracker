import { Router } from 'express';
import { sendReminders, testSendReminder } from '../controllers/workflow.controller.js';


const workflowRouter = Router();

workflowRouter.post('/subscription/reminder', sendReminders);
// Test endpoint to send emails immediately (bypasses workflow sleep)
workflowRouter.post('/subscription/reminder/test', testSendReminder);

export default workflowRouter;