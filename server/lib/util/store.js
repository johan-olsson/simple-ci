
var MongoClient = require('mongodb').MongoClient;

var send = require('./send');
var Constants = require('../../Constants');

var store = {}

MongoClient.connect(Constants.DATABASE, function (err, db) {
    if (err) return send.error(err);

    store = {
        db: db,
        repositories: db.collection('repositories'),
        builds: db.collection('builds'),
        output: db.collection('output')
    }
})

module.exports = function() {
    return store;
}
