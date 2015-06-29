

var RxFlux = require('rxflux');
var Constants = RxFlux.Constants;
var Dispatcher = RxFlux.Dispatcher;

var React = require('react');

var RepoStore = require('../stores/RepoStore');

module.exports = React.createClass({
    
    getInitialState: function() {
    
        return {
            repo: {}
        }
    },

    componentWillMount: function() {
        
        var component = this;
        var full_name = [this.props.params.user, this.props.params.name].join('/');
        
        Dispatcher.emit(Constants.REPO_FETCH, full_name);
        
        RepoStore.Stream
            .filter(function(repo) {

                return repo.full_name == full_name
            })
            .forEach(function(repo) {

                component.setState({
                    repo: repo
                })
            })
        
    },
    
    build: function() {
    
        Dispatcher.emit(Constants.REPO_CLONE, this.state.repo.full_name)
    },

    render: function() {

        return (
            <div className="app-container padded-container">
                <h2>{this.state.repo.full_name}</h2>
                
                    <button onClick={this.build}>Build</button>
                
            </div>
        );
    }

})





