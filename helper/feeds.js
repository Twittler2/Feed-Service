const express = require('express');

const router = express.Router();
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'] });
client.connect(function(err, result) {
  console.log('cassandra connected');
});

const getFeedByUserId = 'SELECT * FROM feedservice.feed WHERE userid = ? ALLOW FILTERING';

router.get('/:user_id', function(req, res) {
  client.execute(getFeedByUserId, [req.params.user_id], function(err, result) {
    if (err) {
      res.status(404).send({msg: err});
    } else {
      result = result.rows[0];
      let respond = {user_id: result.userid};
      let tweets = result.tweets;
      if (tweets.length > 20) {
        respond.tweets = tweets.slice(res.tweets.length - 20);
      } else {
        respond.tweets = tweets.slice();
      }
      res.status(200).send(respond);
    }
  });
});

module.exports = router;
