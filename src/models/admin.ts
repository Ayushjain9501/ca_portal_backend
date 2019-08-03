import mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: false },
        userId: { type: String, required: true },
        password: { type: String, required: true },
        lastTokenGenerate: { type: Date, required: false },
        lastTokenCheck: { type: Date, required: false }
    }
);

adminSchema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('admin', adminSchema);
