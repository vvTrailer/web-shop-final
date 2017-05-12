var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var productSchema = new Schema({
		name: String,
		description: String,
		image: String,
		price: String		

});

module.exports = mongoose.model('Product', productSchema);