
require('./Constants');
require('./actions/auth');
require('./actions/repo');

var RxFlux = require('rxflux');
var Constants = RxFlux.Constants;
var Dispatcher = RxFlux.Dispatcher;


var Login = require('./components/Login')
var Repos = require('./components/Repos')


Dispatcher.emit(Constants.REPO_BRANCHES, 'johan-olsson/RxFlux')
Dispatcher.emit(Constants.REPO_BUILD, 'txodds/txodds-push-webclient')


var React = require('react');


var App = React.createClass({

    render: function() {
    
        return (
            <div>THIS IS THE DIV <Login/><Repos/></div>
        );
    }
})



React.render(<App />, document.querySelector('#app'));


