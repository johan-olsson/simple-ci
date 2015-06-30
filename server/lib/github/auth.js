
var Github = require('octonode');

var express = require('express')
var router = express.Router();

var Constants = require('../../Constants');

var send = require('../util/send');

router.get('/auth', function (req, res) {

    if (req.query.code) {

        Github.auth.login(req.query.code, function (err, token) {

            req.session.token = token;
            req.session.save()
        });

        res.redirect(req.session.redirect || '/')

    } else {

        var auth_url = Github.auth.config({
            id: Constants.GITHUB_CLIENT,
            secret: Constants.GITHUB_SECRET
        })
        .login([
            'user',
            'repo',
            'gist'
        ]);

        req.session.redirect = req.query.url
        req.session.save();
        res.redirect(auth_url);

    }
});

module.exports = router;
