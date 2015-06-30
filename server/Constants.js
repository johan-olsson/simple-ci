
var Constants = {
    GITHUB_CLIENT: process.env.GITHUB_CLIENT,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    DATABASE: process.env.DATABASE || 'mongodb://127.0.0.1:27017/',
    PORT: process.env.PORT || 3000
}

for (var key in Constants)
    if (!Constants[key])
        throw new Error('"' + key + '" not found in process.env')   ;

module.exports = Constants;

