
var Github = require('octonode');

var express = require('express')
var router = express.Router();

var store = require('../util/store');
var send = require('../util/send');

router.get('/api/repositories', function (req, res) {
    
    Github.client(req.session.token)
        .me().repos( function (err, repositories) {
            if (err) return send.error(err, res);
                
            repositories.forEach(function (repo) {

                store().repositories.update({
                    id: repo.id
                }, {
                    $set: repo
                }, {
                    upsert: true
                })
            })
            
            store().repositories.find().toArray(function(repositories) {
                send.data(repositories, res);
            })
        })  
});

module.exports = router;
