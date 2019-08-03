import mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: false },
        regData: { type: mongoose.Schema.Types.ObjectId, ref: 'regdata' },
        fbUserId: { type: String, required: true },
        fbToken: { type: String, require: false },
        totalPoints: { type: Number, require: true, default: 0 }, // Overall Points 
        totalPostsShared: { type: Number, require: true, default: 0 },
        ticketsBooked: { type: Number, require: true, default: 0 },  // Tickets Booked by ref code
        refCode: { type: String, required: false },
        registerDate: { type: Date, required: true },
        postShared: [{
            postid: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
            shares: { type: Number, default: 0 }
        }],
        tasksCompleted: [{
            taskid: { type: mongoose.Schema.Types.ObjectId, ref: 'task' },
            completedOn: { type: Date, required: false }
        }]
    }
);

userSchema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('user', userSchema);
