const elasticsearch = require('elasticsearch');

const elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info',
});

const indexName = 'feed';

const deleteIndex = () => elasticClient.indices.delete({
  index: indexName,
});

const indexExists = () => elasticClient.indices.exists({
  index: indexName,
});

const initIndex = () => elasticClient.indices.create({
  index: indexName,
});

const initMapping = () => {
  const doc = 'document';
  return elasticClient.indices.putMapping({
    index: indexName,
    type: doc,
    body: {
      properties: {
        user_id: { type: 'integer' },
        ad_count: { type: 'integer' },
        tweets: {
          type: 'nested',
          properties: {
            tweet_id: { type: 'text' },
            isad: { type: 'boolean' },
          },
        },
      },
    },
  });
};

const addDocument = document => elasticClient.index({
  index: indexName,
  type: 'document',
  body: {
    user_id: document[0],
    ad_count: document[1],
    tweets: document[2],
  },
});

module.exports = {
  deleteIndex,
  indexExists,
  initIndex,
  initMapping,
  addDocument,
};
