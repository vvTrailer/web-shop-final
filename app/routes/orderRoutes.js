var Order       = require('../models/order');

module.exports = function(app, express) {
	var apiRouter = express.Router();

	apiRouter.route('/orders').post(function(req, res) {
		//TODO: make order belong to user
		var order = new Order();
		order.products = req.body.products;
		order.status = "confirmed";

		order.save(function(err, obj) {
			if (err) {
				return res.send(err);
			}
			res.json({ message: 'Order created!', object: obj });
		});
	})
	.get(function(req, res){
		Order.find(function(err, orders) {
			if (err) {
				res.send(err);
			}
			res.json(orders);
		});
	});

	apiRouter.route('/orders/:id').delete(function(req, res){
		//TODO: check if admin
		Order.remove({_id: req.params.id}, function(err,removed) {
			if (err) {
				return res.send(err);
			} 
			if (removed.result.n < 1){
				return res.status(404).json({ message: 'No such order found!' });
			}
			res.json({ message: 'Order deleted!' })
		});
	}).get(function(req, res) {
		//TODO: check if admin or order owner
		Order.find({_id: req.params.id}, function(err, orders) {
			if (err) {
				res.send(err);
			}
			res.json(orders);
		});
	});
	return apiRouter;
}