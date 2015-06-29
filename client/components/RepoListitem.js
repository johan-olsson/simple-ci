
var React = require('react');

var RxFlux = require('rxflux');

var Navigation = require('react-router').Navigation;

var RepoStore = require('../stores/RepoStore');


module.exports = React.createClass({
    mixins: [Navigation],
    
    configure: function() {
    
        this.transitionTo('/job/' + this.props.model.full_name);
        console.log(this.props.model)
    },

    render: function() {

        return (
            <li onClick={this.configure}>
                <div>{this.props.model.full_name}</div>
                <a>{this.props.model.url}</a>
            </li>
        );
    }

})





