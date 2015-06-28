'use strict';

var request = require('superagent');

var RxFlux = require('rxflux');
var Constants = RxFlux.Constants;

var RepoStore = require('../stores/RepoStore');

RxFlux.createAction(Constants.LIST_REPOS, function() {

    request
        .get('/api/repositories')
        .end(function(err, response) {
    
            if (err) console.error(err);
        
            RepoStore.delete();
            JSON.parse(response.text).data.forEach(function(repo) {
                RepoStore.insert(repo);
            });
        
        })
})

RxFlux.createAction(Constants.REPO_BRANCHES, function(name) {

    request
        .get('/api/branches')
        .query({ name: name })
        .end(function(err, response) {
    
            console.log(JSON.parse(response.text))
        })
})

RxFlux.createAction(Constants.REPO_VIEW, function(name) {
    
    request
        .get('/api/commits')
        .query({ name: name })
        .end(function(err, response) {
    
            console.log(JSON.parse(response.text))
        })
})

RxFlux.createAction(Constants.REPO_BUILD, function(name) {
    
    request
        .get('/api/build')
        .query({ name: name })
        .end(function(err, response) {
    
            console.log(JSON.parse(response.text))
        })
})

RxFlux.createAction(Constants.REPO_BUILD, function(name, commit) {

    console.log(name, commit)
    
    request
        .get('/api/build')
        .query({ name: name })
        .query({ commit: commit })
        .end(function(err, response) {
    
            console.log(JSON.parse(response.text))
        })
})
