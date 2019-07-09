import mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    fbId: { type: String, required: false },
    fbURL: { type: String, required: false },
    imageURL: { type: String, required: false },
    content: { type: String, required: false },
    expTime: { type: Date, required: true },
    maxShare: { type: Number, required: false, default: 10 }
});

postSchema.set('toJSON', { getters: true, virtuals: true });
postSchema.set('toObject', { getters: true });
export = mongoose.model('post', postSchema);
