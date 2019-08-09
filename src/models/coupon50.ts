import mongoose = require('mongoose');
var name = 'coupon50';
const coupon50Schema = new mongoose.Schema(
    {
        coupon_code: { type: String, required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, default: null },
        redeem_date: { type: Date, default: null },

    }
);

coupon50Schema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('coupon50', coupon50Schema,name);
