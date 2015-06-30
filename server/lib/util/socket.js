
module.exports = {   
    io: false,
    socket: false,
    emit: function(name, data) {
        this.io.emit(name, data);
    },
    setup: function(server) {
        this.io = require('socket.io')(server);
        this.io.on('connection', function (socket) {
            this.socket = socket;
        }.bind(this));
    }
}





