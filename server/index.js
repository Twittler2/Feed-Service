const express = require('express');
const bodyParser = require('body-parser');
const Path = require('path');
const feeds = require('../helper/feeds');
const newTweets = require('../helper/newTweets');
const createData = require('../database/index');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/feeds', feeds);
app.use('/newtweets', newTweets);
app.use('/createData', createData);

// data.createData(data.client);

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

module.exports = app;
