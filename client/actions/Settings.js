'use strict';

var request = require('superagent');

var RxFlux = require('rxflux');
var Constants = RxFlux.Constants;


RxFlux.createAction(Constants.REPO_CONFIGURE, function(repo) {

    delete repo._id;
    
    request
        .patch('/api/repository/' + repo.id)
        .query({ repo: repo })
        .end(function(err, response) {
    
            console.log(JSON.parse(response.text))
        })
})

