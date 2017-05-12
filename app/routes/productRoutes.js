var Product       = require('../models/product');

module.exports = function(app, express) {
	var apiRouter = express.Router();
	apiRouter.route('/products').post(function(req, res) {
		var product = new Product();
		product.name = req.body.name;
		product.description = req.body.description;
		product.image = req.body.image; // This is just a link for now
		product.price = req.body.price;

		product.save(function(err) {
			if (err) {
				return res.send(err);
			}

			// return a message
			res.json({ message: 'Product created!' });
		});
	})		
	.get(function(req, res) {
		Product.find(function(err, products) {
			if (err) res.send(err);

			// return the users
			res.json(products);
		});
	});

	return apiRouter;
}