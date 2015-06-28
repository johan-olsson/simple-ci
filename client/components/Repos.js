

var RxFlux = require('rxflux');
var React = require('react');


var RepoStore = require('../stores/RepoStore');


module.exports = React.createClass({
    
    getInitialState: function() {
    
        return {
            repos: []
        }
    },

    componentWillMount: function() {
        
        var component = this;

        RxFlux.Dispatcher.emit(RxFlux.Constants.LIST_REPOS);
        
        RepoStore.Stream.subscribe(function(change) {

            component.setState({
                repos: RepoStore.find()
            });
        })
    },

    render: function() {
        
        var repos = this.state.repos.map(function(repo) {
            return <li>{repo.full_name}</li>;
        })

        return (
            <ul>
                {repos}
            </ul>
        );
    }

})





