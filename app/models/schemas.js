const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const productSchema = new Schema({
		name: String,
		description: String,
		image: String,
		price: String		

});

const Product = mongoose.model('Product', productSchema);


const orderSchema = new Schema({
		products: [productSchema],
		submitDate: { type: Date, default: Date.now},
		status: String
});

const Order = mongoose.model('Order', orderSchema);

const userSchema = new Schema({
	name: String, 
	password: { type: String, required: true, select: false },
	email: { type: String, required: true},
	address: String,
	city: String,
	country: String,
	role: String,
	orders: [orderSchema]
});

var User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
	const user = this;

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
	const user = this;

	return bcrypt.compareSync(password, user.password);
};

module.exports = {
	Order: Order,
	User: User,
	Product: Product
};