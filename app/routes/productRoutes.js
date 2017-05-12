var Product       = require('../models/product');

module.exports = function(app, express) {
	var apiRouter = express.Router();

	apiRouter.route('/products').post(function(req, res) {
		//TODO: check if admin
		var product = new Product();
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
		Product.find(function(err, products) {
			if (err) {
				res.send(err);
			}
			res.json(products);
		});
	});

	apiRouter.route('/products/:id').delete(function(req, res){
		//TODO: check if admin
		Product.remove({_id: req.params.id}, function(err,removed) {
			if (err) {
				return res.send(err);
			} 
			if (removed.result.n < 1){
				return res.status(404).json({ message: 'No such product found!' });
			}
			res.json({ message: 'Product deleted!' })
		});
	}).get(function(req, res) {
		Product.find({_id: req.params.id}, function(err, products) {
			if (err) {
				res.send(err);
			}
			res.json(products);
		});
	});

	return apiRouter;
}