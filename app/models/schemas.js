var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var productSchema = new Schema({
		name: String,
		description: String,
		image: String,
		price: String		

});

var Product = mongoose.model('Product', productSchema);


var orderSchema = new Schema({
		products: [productSchema],
		submitDate: { type: Date, default: Date.now},
		status: String
});

var Order = mongoose.model('Order', orderSchema);

var userSchema = new Schema({
	name: String, 
	password: { type: String, required: true, select: false },
	email: { type: String, required: true},
	address: String,
	city: String,
	country: String,
	role: String,
	orders: [orderSchema]
});

userSchema.pre('save', function(next) {
	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
userSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

var User = mongoose.model('User', userSchema);

module.exports = {
	Order: Order,
	User: User,
	Product: Product
};