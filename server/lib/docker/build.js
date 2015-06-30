
var docker = require('./socket');
var tar = require('tar-fs');
var fs = require('fs');

var express = require('express')
var router = express.Router();

var io = require('../util/socket');
var store = require('../util/store');

var send = require('../util/send');

router.get('/api/build/:user/:name', function (req, res) {
    
    var full_name = [req.params.user, req.params.name].join('/');

    var buildDir = fs.readdirSync('build').filter(function (item) {

        return item.match(new RegExp(full_name.replace('/', '-') + '-[0-9a-f]{7,40}'));
    })
    
    if (!buildDir.length)
        return send.error('No repository found, clone the repository.', res);
    
    store().builds.find().count(function(err, count) {
        store().builds.insert({
            id: count + 1,
            name: full_name

        }, function(err, build) {

            build = build.ops[0];

            docker.buildImage(tar.pack('./build/' + buildDir[0]), {
                t: full_name
            }, function (err, stream) {
                if (err) return console.log(err);

                stream
                    .on('data', function (data) {

                        var streamItem = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(data)));
                        streamItem.id = build.id;

                        store().output.insert(streamItem);

                        io.emit('builds', streamItem);
                    })
                    .on('end', function () {
                    
                        io.emit('builds', {
                            id: build.id,
                            status: 'done'
                        });
                    });
            });
        });
    });

    send.success(res)
});

module.exports = router;
