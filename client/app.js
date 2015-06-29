
require('./Constants');
require('./actions/auth');
require('./actions/repo');

var RxFlux = require('rxflux');
var Constants = RxFlux.Constants;
var Dispatcher = RxFlux.Dispatcher;

var Router = require('react-router')
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler

var React = require('react');


var Login = require('./components/Login')
var Repos = require('./components/Repos')
var Jobs = require('./components/Jobs')
var Job = require('./components/Job')
var Nav = require('./components/Nav')



//Dispatcher.emit(Constants.REPO_BRANCHES, 'johan-olsson/RxFlux')
//Dispatcher.emit(Constants.REPO_BUILD, 'txodds/txodds-push-webclient')




var routes = (
    <Route>
        <Route name="job" path="job/:user/:name" handler={Job}/>
        <Route name="repositories" path="repositories" handler={Repos}/>
        <Route name="auth" path="auth" handler={Login}/>
        <DefaultRoute path="/" handler={Jobs}>
            <Route name="build" path="build/:user/:name" handler={Jobs}/>
        </DefaultRoute>
    </Route>
);


Router.run(routes, function(Handler) {
    
    var App = React.createClass({
        render: function() {
            return (
                <div className="app-container">
                    <Nav/>
                    <Handler/>
                </div>
            );
        }
    })
    
    React.render(<App/>, document.querySelector('#app'));
});


