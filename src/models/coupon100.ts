import mongoose = require('mongoose');
var name = 'coupon100';
const coupon100Schema = new mongoose.Schema(
    {
        coupon_code: { type: String, required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, default: null },
        redeem_date: { type: Date, default: null },

    }
);

coupon100Schema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('coupon100', coupon100Schema,name);
