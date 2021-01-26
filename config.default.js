const path = require('path')


module.exports = {
    name: 'Ideoxan',                                    // Name of the server/website
    logo: '',                                           // Resolved path of logo
    port: 3080,                                         // Port to run server on
    paths: {
        middleware: path.resolve('./app/middleware'),   // Middleware resolved path
        models: path.resolve('./app/models'),           // Models resolved path
        routes: path.resolve('./app/routes'),           // Routes resolved path
        static: path.resolve('./app/static'),           // Static files resolved path
        utilities: path.resolve('./app/utilities'),     // Utils resolved path
        views: path.resolve('./app/views')              // Views resolved path
    },
    mounts: {
        root: '/',                                      // Mount point of root
        static: '/static',                              // Mount point of static files
        api: '/api'                                     // Mount point of api endpoints
    },
    db: {
        uri: 'mongodb://localhost:27017/ix',            // DB URI
        options: {                                      // DB Options
            useNewUrlParser: true,                      // Required
            useUnifiedTopology: true                    // Required
        }
    },
    helmet: {
        options: {

        }
    },
    sessions: {
        options: {
            name: 'ix_sid',
            saveUninitialized: false,
            resave: false,
            cookie: {
                secure: 'auto',
                maxAge: 86400000,
                sameSite: 'lax'
            }
        }
    },
    viewEngine: 'ejs',                                  // The view engine used to compile templates
    staticLifetime: 1000*60*60*12,                      // Lifetime/maxage of static file cache
    trustProxy: 1                                       // Trust proxy forwarding (0 = no, 1 = yes)
}