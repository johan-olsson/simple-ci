var ReactTools = require('react-tools');
var Coffee = require('coffee-script');

module.exports = {
    process: function(src) {
        return ReactTools.transform(src, {
            harmony: true
        });
    }
};
