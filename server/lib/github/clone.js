
var request = require('request');
var progress = require('request-progress');
var Github = require('octonode');
var tar = require('tar-fs');
var zlib = require('zlib');

var express = require('express')
var router = express.Router();

var send = require('../util/send');
var io = require('../util/socket');

router.get('/api/clone/:user/:name', function (req, res, next) {

    var full_name = [req.params.user, req.params.name].join('/');

    Github.client(req.session.token)
        .repo(full_name).archive('tarball', function (err, url) {

            progress(request(url))
                .on('progress', function (state) {
                    state.full_name = full_name;
                    io.emit('download', state);
                })
                .on('error', function (err) {
                    io.emit('download', {
                        full_name: full_name,
                        status: 'error'
                    });
                    send.error(err, res);
                })
                .on('close', function (err) {
                    io.emit('download', {
                        full_name: full_name,
                        status: 'done'
                    });
                    if (err) send.error(err, res);
                    send.success(res);
                })
                .on('end', function (err) {
                    io.emit('download', {
                        full_name: full_name,
                        status: 'done'
                    });
                    if (err) send.error(err, res);
                    send.success(res);
                })
                .pipe(zlib.createGunzip())
                .pipe(tar.extract('/build/'))

        });
});

module.exports = router;
