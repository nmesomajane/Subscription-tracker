import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'SUBSCRIPTION_NAME_REQUIRED'], trim: true,minLenght: 2,maxLenght: 100 }, 
    price: { type: Number, required: [true, 'SUBSCRIPTION_AMOUNT_REQUIRED'], min: [0, 'SUBSCRIPTION_AMOUNT_MIN'] }, // e.g., 9.99
    currency: { type: String, required: [true, 'CURRENCY_REQUIRED'], 
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'], default: 'USD',
   },   

    frequency: { type: String, enum: ['monthly', 'yearly'], required: [true, 'BILLING_CYCLE_REQUIRED'] },
    category: { type: String, enum: ['entertainment', 'productivity', 'education', 'health', 'other'], default: 'other' },
    startDate: { type: Date, required: [true, 'START_DATE_REQUIRED'] },

    renewalDate: { type: Date, required: [true, 'NEXT_BILLING_DATE_REQUIRED'],  validate: {
        validator: function(value) {
            return value > this.startDate;
        },
        message: 'NEXT_BILLING_DATE_MUST_BE_AFTER_START_DATE'
    } },
    status: { type: String, enum: ['active', 'paused', 'canceled'], default: 'active' },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true ,index: true},
}, { timestamps: true });


subscriptionSchema.pre('save', function(next) {
    if (this.isModified('startDate') || this.isModified('frequency')) {
        const start = new Date(this.startDate);
        if (this.frequency === 'monthly') {
            this.renewalDate = new Date(start.setMonth(start.getMonth() + 1));
        }
        else if (this.frequency === 'yearly') {
            this.renewalDate = new Date(start.setFullYear(start.getFullYear() + 1));
        }
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
