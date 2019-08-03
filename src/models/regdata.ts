import mongoose = require('mongoose');

const regDataSchema = new mongoose.Schema(
    {
        email: { type: String, required: false },
        name: { type: String, required: false },
        address: { type: String, required: false },
        institute: { type: String, required: false },
        phone: { type: String, required: false }
    }
);

regDataSchema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('regdata', regDataSchema);
