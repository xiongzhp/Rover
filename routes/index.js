var express = require('express');
var router = express.Router();
var wit = require('node-wit');
var ACCESS_TOKEN = require('../config/witai');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'J.A.R.V.I.S.' });
});

router.post('/api/v1/intent', function(req, res) {
	var query = req.body.query;

	wit.captureTextIntent(ACCESS_TOKEN, query, function (err, response) {
		console.log('Response from Wit:');
		if (err) {
			console.log('Error: ', err);
			return;
		}

		if (response['outcomes'].length == 0) {
			console.log('Invalid Wit.ai response');
			return;
		}

		var result = response['outcomes'][0];

		res.send(result);
	});
});

module.exports = router;
