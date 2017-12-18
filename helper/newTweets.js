const express = require('express');
const router = express.Router();
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'] });
client.connect((err, result) => {
  console.log('cassandra connected');
});

const editFeedByUserId = 'UPDATE feedservice.feed SET tweets = tweets + [?] WHERE userid = ?';

router.get('/:user_Id', function (req, res) {
  client.execute(editFeedByUserId, tweetid, userid, function (err, result) {
    if (err) {
      res.status(404).send({ msg: err });
    } else {
    }
  });
});

module.exports = router;
