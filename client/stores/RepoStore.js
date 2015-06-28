'use strict';

var RxFlux = require('rxflux');
var Constants = RxFlux.Constants;

module.exports = RxFlux.createStore(Constants.REPO_STORE, {
    localStorage: false
})


