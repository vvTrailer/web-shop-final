var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var orderSchema = new Schema({
		products: [],
		submitDate: { type: Date, default: Date.now},
		status: String
});

module.exports = mongoose.model('Order', orderSchema);