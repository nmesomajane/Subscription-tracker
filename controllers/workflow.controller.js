import {createRequire} from 'module'
import dayjs from 'dayjs'

const require = createRequire(import.meta.url)

const {serve} = require('@upstash/workflow/express')
import Subscription from '../models/subscription.model.js'

const REMINDER=[7,5,2,1];

export const sendReminder = serve (async (req, res) => {
    const {subscriptionId}= isContext.requestPayload;
    const subscription = await fetchSubscription(isContext, subscriptionId);
    if(!subscription || subscription.status === 'canceled') return;

    const renewalDate=dayjs(subscription.renewalDate);
    if(renewalDate.isBefore(dayjs())) {
        console.log(`Subscription ${subscription._id} is past due for renewal.`);
        return;
    }

    for (const daysBefore of REMINDER) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(isContext, `reminder ${daysBefore} days`, reminderDate);
           
        }

         await triggerReminder(isContext, `reminder ${daysBefore} days`);
    }

})

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription',async() => {return Subscription.findById(subscriptionId).populate ({path:'user',select: 'name email'})
    });
}

const sleepUntilReminder = async (context, label, date) => {
    console.log('sleeping until', label, date.toString());
    await context.sleepUntil(label,date.toDate());
}

const triggerReminder = async (context, label) => {
    return await context.run(`trigger ${label} reminder`);

    // Your logic to trigger the reminder (e.g., send an email)

}