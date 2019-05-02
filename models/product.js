var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    productname: {type: String, required:true},
    category: {type: String, required:true},
    description: {type: String, required:true},
    price: {type: Number, required:true}
});

module.exports = mongoose.model('Product', schema);
