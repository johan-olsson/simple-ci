
var Github = require('octonode');

var express = require('express')
var router = express.Router();

var store = require('../util/store');
var send = require('../util/send');

router.patch('/api/repository/:user/:name', function (req, res) {
    
    var full_name = [req.params.user, req.params.name].join('/')

    store().repositories.update({
        full_name: full_name
    }, {
        $set: req.query.repo
    })
});

router.get('/api/repository/:user/:name', function (req, res) {
    
    var full_name = [req.params.user, req.params.name].join('/')

    Github.client(req.session.token)
        .repo(full_name).info(function(status, repository) {
        
            /*
             * Add branches to the repository.
             */
            Github.client(req.session.token)
                .repo(full_name).branches(function (err, branches) {
                    repository.branches = branches;
                
                    /*
                     * Save to database.
                     */
                    store().repositories.update({
                        full_name: full_name
                    }, {
                        $set: repository
                    })
                
                })
            
             send.data(repository, res);
        })
});

module.exports = router;

