var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: String, required: true},
    cart: {type: Object, required: true},
    fullName: {type: String, required: true},
    mobileNumber: {type: String, required: true},
    pincode: {type: String, required: true},
    flatNo: {type: String, required: true},
    street : {type: String, required: true},
    landmark: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    paymentId: {type: String}
});

module.exports = mongoose.model('Order', schema);
