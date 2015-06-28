'use strict';

var request = require('superagent');

var RxFlux = require('rxflux');
var Constants = RxFlux.Constants;

var LoginStore = require('../stores/LoginStore');

RxFlux.createAction(Constants.AUTH_URL, function() {
    
//    var user = UserStore.first();

    request
        .get('/api/auth_url')
        .end(function(err, response) {
    
            if (err) console.error(err);
        
            LoginStore.insert({
                url: JSON.parse(response.text).data
            })
            console.log(JSON.parse(response.text).data);
        
        })
})
