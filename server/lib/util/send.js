
module.exports = {
    success: function(res) {
        res.send(JSON.stringify({
            status: 'success'
        }));
    },
    data: function(data, res) {
        res.send(JSON.stringify({
            status: 'success',
            data: data
        }));
    },
    error: function(err, res) {
        console.error(err);
        if (typeof res !== 'undefined')
            res.send(JSON.stringify({
                error: err
            }));
    }
}

