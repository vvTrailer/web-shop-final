var models = require('../models/schemas');
var jwt = require('jsonwebtoken');
var configSecret = {};
var express = require('express');
var acl = require('express-acl');
var app = express();

try {
	configSecret = require('../../config-secret'); // use it for later
} catch (ex) {
	console.log(ex.message);
	configSecret["secret"] = process.env.SECRET;
	configSecret["database"] = process.env.DATABASE;
}

// super secret for creating tokens
var superSecret = configSecret.secret;

let configObject = {
	baseUrl: 'api',
	defaultRole: 'anonymous'
};

let responseObject = {
	status: 'Access Denied',
	message: 'You are not authorized to access this resource'
};

acl.config(configObject, responseObject);
module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {      
				if (err)
					return res.json({ success: false, message: 'Failed to authenticate token.' });    
				else
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;    
			});
		};
		next(); // make sure we go to the next routes and don't stop here
	});

	apiRouter.use(acl.authorize);


	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {
		console.log(req.body.email);

		// find the user
		models.User.findOne({
			email: req.body.email
		}).select('role email password name address city country').exec(function(err, user) {

			if (err) throw err;

			// no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
				} else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign({
						role: user.role,
						email: user.email
					}, superSecret, {
						expiresIn: 4000

					});

					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token,
						user: user
					});
				}

			}

		});
	});

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({
			message: 'hooray! welcome to our api!'
		});
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')
		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			var user = new models.User(); // create a new instance of the User model
			user.name = req.body.name; // set the users name (comes from the request)
			user.password = req.body.password; // set the users password (comes from the request)
			user.email = req.body.email;
			user.address = req.body.address;
			user.city = req.body.city;
			user.country = req.body.country;
			user.role = req.body.role;

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({
							success: false,
							message: 'A user with that username already exists. '
						});
					else
						return res.send(err);
				}

				var token = jwt.sign({
					name: user.name,
					email: user.email
				}, superSecret, {
				  expiresIn: 4000
				});

				//dont send back password
				user.password = '';
				// return a message
				res.json({ message: 'User created!', token: token, user: user, success: true });
			});

		})
		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {
			models.User.find(function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')
		// get the user with that id
		.get(function(req, res) {
			models.User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})
		// update the user with this id
		.put(function(req, res) {
			models.User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.email) user.username = req.body.email;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({
						message: 'User updated!'
					});
				});

			});
		})
		// delete the user with this id
		.delete(function(req, res) {
			models.User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({
					message: 'Successfully deleted'
				});
			});
		});

	apiRouter.route('/users/:user_id/orders')
		.post(function(req, res) {
			var order = new models.Order();
			order.status = "confirmed";
			models.User.findById(req.params.user_id, function(err, user) {

				if (err)
					return res.send(err);

				order.save(function(err, obj) {
					if (err) {
						return res.send(err);
					}
					user.orders.push(order);
					user.save(function(err, res) {
						if (err)
							return res.send(err);
					});
					res.json({
						message: 'Order created!',
						object: obj
					});
				});

			});
		})
		.get(function(req, res) {
			models.User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user.orders);
			});
		});

	apiRouter.route('/orders')
		.get(function(req, res) {
			models.Order.find(function(err, orders) {
				if (err) res.send(err);

				// return the users
				res.json(orders);
			});
		});

	apiRouter.route('/users/:user_id/orders/:order_id')
		.get(function(req, res) {
			models.Order.findById(req.params.order_id, function(err, order, user) {
				if (err) res.send(err);

				// return that user
				res.json(order);
			});

		})


		.delete(function(req, res) {


			models.User.update({
					"_id": req.params.user_id
				}, {
					"$pull": {
						"orders": {
							"_id": req.params.order_id
						}
					}
				},
				function(err, numAffected) {
					if (err) {
						console.log(err);
					} else {
						res.status(200).send();
					}
				}
			);

			models.Order.remove({
				_id: req.params.order_id
			}, function(err) {
				if (err) res.send(err);

				res.json({
					message: 'Successfully deleted'
				});
			});

		});


	apiRouter.route('/orders/:order_id/products')
		.post(function(req, res) {
			var product = new models.Product();
			product.name = req.body.name;
			product.description = req.body.description;
			product.image = req.body.image;
			product.price = req.body.price;
			models.Order.findById(req.params.order_id, function(err, order) {

				if (err)
					return res.send(err);

				order.save(function(err, obj) {
					if (err) {
						return res.send(err);
					}
					order.products.push(product);
					order.save(function(err, res) {
						if (err)
							return res.send(err);
					});
					res.json({
						message: 'Product created!',
						object: obj
					});
				});

			});
		})
		.get(function(req, res) {
			models.Order.findById(req.params.order_id, function(err, order) {
				if (err) res.send(err);

				// return that user
				res.json(order.products);
			});
		});

	apiRouter.route('/products').post(function(req, res) {
		//TODO: check if admin
		var product = new models.Product();
		product.name = req.body.name;
		product.description = req.body.description;
		product.image = req.body.image; // This is just a link for now
		product.price = req.body.price;

		product.save(function(err, obj) {
			if (err) {
				return res.send(err);
			}
			res.json({ message: 'Product created!', object: obj });
		});
	})		
	.get(function(req, res) {
		models.Product.find(function(err, products) {
			if (err) {
				res.send(err);
			}
			res.json(products);
		});
	});

	return apiRouter;
};