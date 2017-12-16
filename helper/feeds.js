const express = require('express');

const router = express.Router();
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'] });
client.connect((err, result) => {
  console.log('cassandra connected');
});

const getFeedByUserId = 'SELECT * FROM feedservice.feed WHERE user_id = ? ALLOW FILTERING';

router.get('/:user_id', (req, res) => {
  const userId = +req.params.user_id;
  client.execute(getFeedByUserId, [userId], { prepare: true }, (err, result) => {
    if (err) {
      res.status(404).send({ msg: err });
    } else {
      result = result.rows[0];
      const respond = { user_id: result.user_id };
      const tweets = result.tweets;
      if (tweets.length > 5) {
        respond.tweets = tweets.slice(tweets.length - 5);
      } else {
        respond.tweets = tweets.slice();
      }
      res.status(200).send(respond);
    }
  });
});

module.exports = router;
