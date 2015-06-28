'use strict';

var RxFlux = require('rxflux');
var Constants = RxFlux.Constants;

module.exports = RxFlux.createStore(Constants.LOGIN_STORE, {
    localStorage: false
})


