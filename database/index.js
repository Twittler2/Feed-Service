const express = require('express');
// const faker = require('faker');
const uniqid = require('uniqid');
const cassandra = require('cassandra-driver');

// const elastic = require('./elasticsearch');

const router = express.Router();

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'] });

client.connect((err, result) => {
  console.log('cassandra connected');
});

let number = 1;

// const createIndex = () => {
//   elastic
//     .indexExists()
//     .then((exists) => {
//       if (exists) {
//         return elastic.deleteIndex().then(() => console.log('deleted index'));
//       }
//     })
//     .then(() => elastic.initIndex())
//     .then(() => elastic.initMapping())
//     .catch(err => console.log('error', err));
// };

// createIndex();

const createFeed = (ct, queries) => {
  const tweets = [];
  let adCount = 0;
  for (let j = 0; j < 10; j++) {
    const tweet = {
      tweet_id: uniqid(),
      isad: Math.random() < 0.3,
    };
    if (tweet.isad) {
      adCount += 1;
    }
    tweets.push(tweet);
  }
  const query = 'INSERT INTO feedservice.test (user_id, ad_count, tweets) VALUES (?, ?, ?)';
  queries.push({ query, params: [number, adCount, tweets] });
  // elastic.addDocument([number, adCount, tweets]);
  number += 1;
};

const createData = (client, counter = 0) => {
  const queries = [];
  for (let i  = 0; i < 50; i++) {
    createFeed(i, queries);
  }
  client.batch(queries, { prepare: true })
    .then(() => {
      counter += 50;
      if (counter < 10000) {
        if (counter % 1000 === 0) {
          console.log(counter);
        }
        createData(client, counter);
      }
    })
    .catch(error => console.log('error occur', error));
};

// createData(client);

router.get('/createData', (req, res) => {});

module.exports = router;
