import mongoose = require('mongoose');

const ticketsData = new mongoose.Schema(
    {
        totalTicketsSold: { type: Number, required: false, default: 0 },
        cashbackPerTicket: { type: Number, required: false, default: 0 }
    }
);

ticketsData.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('ticketsData', ticketsData);
