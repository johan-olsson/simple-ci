'use strict';

var RxFlux = require('rxflux');
var React = require('react');


var LoginStore = require('../stores/LoginStore');


module.exports = React.createClass({

    componentWillMount: function() {
        
        var component = this;

        RxFlux.Dispatcher.emit(RxFlux.Constants.AUTH_URL);
        
        LoginStore.Stream.subscribe(function(change) {
            
            component.setState({ url: change.url })
        })
    },

    render: function() {
        
        return (
            <div>
                BUILDS
            </div>
        );
    }

})





