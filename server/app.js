'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer();
var request = require('request');
var progress = require('request-progress');
var zlib = require('zlib');
var tar = require('tar-fs');
var fs = require('fs');

var io = require('socket.io')(server);

var Docker = require('dockerode');
var Github = require('octonode');

var MongoClient = require('mongodb').MongoClient;
var Promise = require('promise');

var docker = new Docker({
    socketPath: '/var/run/docker.sock'
});


//
//docker.buildImage('test-repo/Dockerfile', {t: 'test-image'}, function (err, response){
//    console.log(arguments)
//});


var GITHUB_CLIENT = process.env.GITHUB_CLIENT;
var GITHUB_SECRET = process.env.GITHUB_SECRET;

var GithubToken = false;
var Store = {}

MongoClient.connect('mongodb://127.0.0.1:27017/', function(err, db) {

    if (err) console.log(err);

    Store.repositories = db.collection('user');

})


function GithubClient() {
    
    console.log(GithubToken)

    return new Promise(function(resolve, reject) {

        if (!GithubToken)
            return reject();

        resolve(Github.client(GithubToken));
    })
}


app.get('/api/commits', function(req, res){

    GithubClient()
        .then(function(client) {

            client.repo(req.query.name).commits(function(err, commits) {

                res.send(JSON.stringify({
                    status: 'success',
                    data: commits
                }));
            });
        })
        .catch(function() {
            res.send(JSON.stringify({
                status: 'error'
            }));
        })
});

app.get('/api/build', function(req, res) {
    
    GithubClient()
        .then(function(client) {

            client.repo(req.query.name).archive('tarball', function(err, url) {

                console.log(url)    

                progress(
                    request(url)
                )
                .on('progress', function (state) {
                    console.log('total size in bytes', state.total);
                    console.log('received size in bytes', state.received);
                    console.log('percent', state.percent);
                })
                .on('error', function (err) {
                    console.log(err) 
                })
                .pipe(zlib.createGunzip())
                .pipe(tar.extract('./build/'))
                .on('error', function (err) {
                    console.log(err)
                })
                .on('close', function (err) {
                    console.log(arguments)
                });
                
                res.send(JSON.stringify({
                    status: 'success'
                }));
            });
        })
        .catch(function() {
            res.send(JSON.stringify({
                status: 'error'
            }));
        })
});


app.post('/api/unwatch/:id', function(req, res){

    res.send(JSON.stringify({
        status: 'success'
    }));
});

app.post('/api/watch/:id', function(req, res){

    res.send(JSON.stringify({
        status: 'success'
    }));
});

app.post('/api/build/:id', function(req, res){

    res.send(JSON.stringify({
        status: 'success'
    }));
});

app.delete('/api/repository/:id', function(req, res){

    res.send(JSON.stringify({
        status: 'success'
    }));
});

app.get('/api/auth_url', function(req, res){

    var auth_url = Github.auth.config({
        id: GITHUB_CLIENT,
        secret: GITHUB_SECRET
    })
    .login([
        'user',
        'repo',
        'gist'
    ]);

    res.send(JSON.stringify({
        status: 'success',
        data: auth_url
    }));
});

app.patch('/api/repository/:id', function(req, res){

    Store.repositories.update({
        id: req.params.id

    }, { $set: req.query.repo })

});

app.get('/api/branches', function(req, res){
    
    GithubClient()
        .then(function(client) {

        client.repo(req.query.name).branches(function(err, branches) {
            
                res.send(JSON.stringify({
                    status: 'success',
                    data: branches
                }));
            })
        })


});


app.put('/api/repositories', function(req, res){

    GithubClient()
        .then(function(client) {
            client.me().repos(function(status, repositories) {

                repositories.forEach(function(repo) {

                    Store.repositories.update({
                        id: repo.id

                    }, { $set: repo }, { upsert: true }) 

                })

                res.send(JSON.stringify({
                    status: 'success',
                    data: repositories
                }));
            })
        })
        .catch(function() {
            res.send(JSON.stringify({
                status: 'error'
            }));
        })

});

app.get('/api/repositories', function(req, res){

    Store.repositories.find().toArray(function(err, repositories) {

        res.send(JSON.stringify({
            status: 'success',
            data: repositories
        }));
    })
});

app.use('/', express.static(__dirname + '/../dist/'));

app.get('/auth', function(req, res) {
    Github.auth.login(req.query.code, function(err, token) {
    
        GithubToken = token;
    });
    res.redirect('/')
});

app.listen(3000);



io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});





