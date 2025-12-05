import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

const REMINDERS = [7, 5, 2, 1]

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if(!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');
    const now = dayjs();

    if(reminderDate.isAfter(now)) {
      // Future date: sleep until reminder date, then send
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
      // After sleep, send the reminder
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    } else if (reminderDate.isSame(now, 'day') || reminderDate.isBefore(now)) {
      // Today or past date: send immediately
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  })
}

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    })
  })
}

// Test endpoint to send emails immediately (for testing purposes)
export const testSendReminder = async (req, res, next) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'subscriptionId is required'
      });
    }

    const sub = await Subscription.findById(subscriptionId).populate('user', 'name email');

    if (!sub) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (!sub.user || !sub.user.email) {
      return res.status(400).json({
        success: false,
        message: 'User or email not found for this subscription'
      });
    }

    // Send all reminder types immediately
    const results = [];
    for (const daysBefore of REMINDERS) {
      const label = `${daysBefore} days before reminder`;
      try {
        await sendReminderEmail({
          to: sub.user.email,
          type: label,
          subscription: sub
        });
        results.push({ label, status: 'sent', email: sub.user.email });
        console.log(`✅ Test email sent: ${label} to ${sub.user.email}`);
      } catch (error) {
        results.push({ label, status: 'failed', error: error.message });
        console.error(`❌ Failed to send test email ${label}:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Test emails sent',
      results,
      subscription: {
        id: sub._id,
        name: sub.name,
        userEmail: sub.user.email,
        renewalDate: sub.renewalDate
      }
    });
  } catch (error) {
    next(error);
  }
};