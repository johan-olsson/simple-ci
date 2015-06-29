

var RxFlux = require('rxflux');
var React = require('react');

var RepoStore = require('../stores/RepoStore');


var RepoListitem = require('./RepoListitem');


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
    
    configure: function() {
    
        
    },

    render: function() {
        
        var repos = this.state.repos.map(function(repo) {
            return <RepoListitem key={repo.id} model={repo} />
        })

        return (
            <ul className="repository-list padded-container">
                {repos}
            </ul>
        );
    }

})





