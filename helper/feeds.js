const express = require('express');
const cassandra = require('cassandra-driver');
const redis = require('redis');

const router = express.Router();

const redisClient = redis.createClient();
redisClient.on('connect', () => {
  console.log('redis connected');
});

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'] });
client.connect((err, result) => {
  console.log('cassandra connected');
});

const getFeedByUserId = 'SELECT * FROM feedservice.feed WHERE user_id = ? ALLOW FILTERING';

router.get('/:user_id', (req, res) => {
  const userId = +req.params.user_id;

  redisClient.get(userId, (error, redisResult) => {
    if (redisResult) {
      res.status(200).send(JSON.parse(redisResult));
    } else {
      client.execute(getFeedByUserId, [userId], { prepare: true })
        .then((result) => {
          result = result.rows[0];
          const respond = { user_id: result.user_id };
          const tweets = result.tweets;
          if (tweets.length > 5) {
            respond.tweets = tweets.slice(tweets.length - 5);
          } else {
            respond.tweets = tweets.slice();
          }
          redisClient.setex(userId, 60, JSON.stringify(respond));
          res.status(200).send(respond);
        })
        .catch(err => console.log('error occured', err));
    }
  });
});

module.exports = router;
