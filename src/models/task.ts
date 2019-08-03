import mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskTitle: { type: String, required: true },
    taskContent: { type: String, required: true },
    expTime: { type: Date, required: false },
    points: { type: Number, required: true },
    totalCompletes: { type: Number, required: false, default: 0 }
});

taskSchema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('task', taskSchema);
