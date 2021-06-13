/**
 *                               Ideoxan Web Server (4.0.0 alpha.1)
 * 
 * 
 *              $$$$$$$$\       $$\
 *              \__$$  _|       $$ |
 *                $$ |    $$$$$$$ |  $$$$$$\    $$$$$$\   $$\   $$\   $$$$$$\   /$$$$$$$\
 *               $$ |   $$  __$$ | $$  __$$\  $$  __$$\  \$$\ $$  |  \____$$\  $$  __$$ \
 *              $$ |   $$ /  $$ | $$$$$$$$ | $$ /  $$ |  \$$$$  /  $$$$$$$ |  $$ |  $$ |
 *             $$ |   $$ |  $$ | $$   ____| $$ |  $$ |  $$  $$<  $$  __$$ |  $$ |  $$ |
 *         $$$$$$$$\ \$$$$$$$ | \$$$$$$$\  \$$$$$$  | $$  /\$$\ \$$$$$$$ |  $$ |  $$ |
 *        \_______|  \______/  \_______|  \_______/  \__/  \__| \_______|  \__|  \__|
 * 
 *                   Ideoxan Is A Free To Use Online Tool To Learn Programming.
 *                                   https://github.com/ideoxan
 * 
 *
 *
 *            We Are Looking For Contributors! Https://github.com/ideoxan/contributing
 *        This Project Is Maintained And Governed In Accordance With The Project's Official
 *          Code Of Conduct. Agreement To Its Terms And Conditions, Along With Ideoxan's
 *       Official Terms Of Service, Ideoxan's Privacy Policy And The Included License (MIT)
 *                    Is Required To Contribute To This Organization's Project.
 * 
*/


/* ------------------------------------------- Config ------------------------------------------- */
// This attempts to load a server configuration
// If a custom one is not found, then the default is loaded
require('./loadServerConfig')()

/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
// Express HTTP Application
const express                   = require('express')
// Request/Response Compression
const compression               = require('compression')
// Express Security
const helmet                    = require('helmet')
// Express Sessions
const session                   = require('express-session')
// Flash Alerts/Messages
const flash                     = require('express-flash')
// Cookie parser
const cookieParser              = require('cookie-parser')
// Body parser
const bodyParser                = require('body-parser')
// CSURF Protection
const csurf                     = require('csurf')
// Rate limiter
const RateLimiter               = require('express-rate-limit')
// Rate limit MongoDB store
const RateLimiterStore          = require('rate-limit-mongo')

/* --------------------------------------- Authentication --------------------------------------- */
// Passport Master Authentication
const passport                  = require('passport')
// Passport Authentication Handler
const handleAuth                = require(serverConfig.paths.middleware + '/authHandler')

/* ------------------------------------------ Database ------------------------------------------ */
// MongoDB Client
const mongoose                  = require('mongoose')

/* ------------------------------------------ Utilities ----------------------------------------- */
// HTTP Error Codes
const HTTPError                 = require(serverConfig.paths.utilities + '/HTTPError')
// Terminal Styling
const c                         = require('chalk')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------ Environment Variables ----------------------------------- */
// When not in production, this loads local environment variables from the root directory. When in
// production, env vars are loaded globally and do not need dotenv to load them. Only secrets should
// be stored in .env files. Otherwise, use the server config to define configuration vars.
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

/* ------------------------------------------- Express ------------------------------------------ */
// This creates the HTTP application
const app = express()

// Sets engine used for server-side rendering
app.set('view engine', serverConfig.viewEngine)
// Sets views location
app.set('views', serverConfig.paths.views)

// Trust proxy is used when the server is behind reverse a reverse proxy (ex. nginx). This is used
// to allow requests via proxy forwarding.
//
// 0    = no, do not allow requests from a reverse proxy
// 1    = yes, allow requests from a reverse proxy and trust only the first hop
// ...n = yes, allow requests from a reverse proxy and trust "n" number of hops
//
// Most likely, you'll be using a reverse proxy, so I would keep this enabled if I were you.
app.set('trust proxy', serverConfig.trustProxy)

// Loads routes
const router = require(serverConfig.paths.routes + '/router')

// Cookie secret
serverConfig.sessions.options.secret = process.env.EXPRESS_SESSION_SECRET

/* ------------------------------------------ Database ------------------------------------------ */
// Logs DB requests to console.
mongoose.set('debug', (call, method) => {
    console.log(
        '[' + c.grey(new Date().toISOString()) + ']',
        c.bold('[DATABASE]'), method.toUpperCase(), 'web', '→', call
    )
})
// Connects to a MongoDB instance. Options and URI are set in server configuration options. If it
// fails to connect, it throws and exception and the server process terminates. Otherwise, it 
// grabs the connection and saves it.
/* const db = mongoose.createConnection(serverConfig.db.uri, serverConfig.db.options) */
mongoose.connect(serverConfig.db.uri, serverConfig.db.options)

/* --------------------------------------- Authentication --------------------------------------- */
// The server uses Passport.js (for Node.js) as the authentication library. All large functions (ex.
// signing up, logging in, logging out, 3rd Party Authentication flows) are handled through calls to
// passport and helper/middleware functions.
// 
// The authentication handler (seen below) needs passport to be passed to it. It registers all
// available authentication flows. The first one used is the local authentication provider and then
// all other 3rd party flows are then used. It also includes serialization/de-serialization functions
// that are needed to authenticate sessions.
handleAuth(passport)



/* ---------------------------------------------------------------------------------------------- */
/*                                           MIDDLEWARE                                           */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Security ------------------------------------------ */
// Helmet middleware modifies certain headers in the HTTP Request/Response to improve security
app.use(helmet(serverConfig.helmet.options))

/* ----------------------------------------- Compression ---------------------------------------- */
// Attempts to shrink the file size of all responses
app.use(compression())

/* ---------------------------------------- Static Files ---------------------------------------- */
// Static files are all constant and unchanging files (ex. scripts, stylesheets, libraries, images,
// etc.). These files are served without any major backend routing logic. Files are mapped to their
// mount point exactly how they appear in the physical file system Default mounting location is
// /static/* and the default storage location is ./static/
app.use(serverConfig.mounts.static, express.static(serverConfig.paths.static, {
    // Maximum age (cache) set during production only
    maxAge: (process.env.NODE_ENV == 'production')? serverConfig.staticLifetime : 0
}))

/* ---------------------------------------- Cookie Parser --------------------------------------- */
// This parses the cookies included in all requests
app.use(cookieParser(serverConfig.sessions.options.secret))

/* ----------------------------------------- Body Parser ---------------------------------------- */
// This parses the body content of all requests. It sanitizes the bodies of requests.
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

/* ------------------------------------------ Sessions ------------------------------------------ */
// Express Sessions are cookies that store the sign on session of a user in their browser. Their UID
// (or User ID, which is a random and unique UUIDv4 string) is stored and their cookie value is
// stored in the server memory
// TODO: Use mongodb as a store for cookies
app.use(session(serverConfig.sessions.options))

/* ------------------------------------ Flash Alerts/Messages ----------------------------------- */
app.use(flash())

/* --------------------------------------- Authentication --------------------------------------- */
// Passport is being used as the authentication library for the server. Passport allows for multiple
// strategies (as defined in the auth handler). It needs to be initialized upon each request to add
// itself into the request object. When using sessions, it needs to be added as a session cookie for
// sessions to be kept between each request. If needed, this can be disabled under certain API
// endpoints (but most likely will not be needed since the APIs are only used internally)
app.use(passport.initialize())
app.use(passport.session())

/* ------------------------ Cross Site Request Forgery (CSRF) Protections ----------------------- */
// Since the authentication handler leverages cookies for authentication, the server is susceptible
// to Cross Site Request Forgery (CSRF) attacks. A cookie could be used to create a malicious
// request on behalf of a previous/currently authenticated user. The CSURF module prevents this by
// creating a session-specific token upon every request and confirming the token belongs to the
// user.
app.use(csurf({cookie: true}))

/* --------------------------------------- Request Logging -------------------------------------- */
// Only logs major (excludes static resources) requests to the console. Timestamp, scope, HTTP Code,
// HTTP Method, resource location, and response time are printed on one line upon request. Stopped/
// incomplete HTTP requests are listed with an "INCOMPLETE" HTTP Code.
app.use(require(serverConfig.paths.middleware + '/requestLogger.js'))

/* ---------------------------------------- Rate Limiter ---------------------------------------- */
// In order to prevent denial of service attacks (DoS), a rate limiter is used to throttle/block
// requests sent to the server.
app.use(new RateLimiter({
    max: serverConfig.rateLimit.maxConnections,
    windowMs: serverConfig.rateLimit.time,
    store: new RateLimiterStore({
        uri: serverConfig.db.uri,
        expireTimeMs: serverConfig.rateLimit.time,
        connectionOptions: serverConfig.db.options
    }),
    handler: (req, res) => {
        let serverError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES['429'])
        return serverError.render()
    }
}))



/* ---------------------------------------------------------------------------------------------- */
/*                                             ROUTES                                             */
/* ---------------------------------------------------------------------------------------------- */
/* ----------------------------------------- Main Router ---------------------------------------- */
// See router for details
app.use(router)

/* ------------------------------------------- Errors ------------------------------------------- */
// See https://expressjs.com/en/guide/error-handling.html for details

// CSRF Errors
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    let serverError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES['403'])
    serverError.render()
}) 

// HTTP Error Code 404 (Not Found) Middleware
app.use((req, res, next) => {
    let serverError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES['404'])
    return serverError.render()
})

// HTTP Error Code 500 (Internal Server Error) Middleware
app.use((err, req, res, next) => {
    let serverError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES['500'])
    serverError.render()
    console.log(err.stack)
})


/* ---------------------------------------------------------------------------------------------- */
/*                                             EXPORTS                                            */
/* ---------------------------------------------------------------------------------------------- */
/* --------------------------------------------- App -------------------------------------------- */
module.exports = app