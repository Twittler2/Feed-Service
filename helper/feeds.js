const express = require('express');
const router = express.Router();
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result) {
  console.log('cassandra connected');
});

const getFeedByUserId = 'SELECT * FROM feedService.feed WHERE user_id = ?';

router.get('/:user_Id', function(req, res) {
  client.execute(getFeedByUserId, [req.params.user_id], function(err, result) {
    if (err) {
      res.status(404).send({msg: err});
    } else {

    }
  });
});
