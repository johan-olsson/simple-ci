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

RxFlux.createAction(Constants.REPO_FETCH, function(full_name) {

    request
        .get('/api/repository/' + full_name)
        .end(function(err, response) {
    
            JSON.parse(response.text).data.forEach(function(repo) {
                RepoStore.upsert({id: repo.id}, repo);
            });
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


RxFlux.createAction(Constants.REPO_CLONE, function(name) {
    
    request
        .get('/api/clone')
        .query({ name: name })
        .end(function(err, response) {
    
            console.log(JSON.parse(response.text))
        })
})






