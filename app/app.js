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
require('./utilities/loadServerConfig')()

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

/* ------------------------------------------ Database ------------------------------------------ */
// MongoDB Client
const mongoose                  = require('mongoose')       

/* ------------------------------------------ Utilities ----------------------------------------- */
// Page renderer
const render                    = require(serverConfig.paths.utilities + '/render')
// HTTP Error Codes
const HTTPError                 = require(serverConfig.paths.utilities + '/HTTPError')

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
// 0 = no, do not allow requests from a reverse proxy
// 1 = yes, allow requests from a reverse proxy
//
// Most likely, you'll be using a reverse proxy, so I would keep this enabled if I were you.
app.set('trust proxy', serverConfig.trustProxy)

// Loads routes
const router = require(serverConfig.paths.routes + '/router')

/* ------------------------------------------ Database ------------------------------------------ */
// Logs DB requests to console.
mongoose.set('debug', (call, method) => {
    console.log(
        '[', c.grey(new Date().toISOString()), ']',
        c.bold('[DATABASE]'), method.toUpperCase(), 'web', '→', coll
    )
})
// Connects to a MongoDB instance. Options and URI are set in server configuration options. If it
// fails to connect, it throws and exception and the server process terminates. Otherwise, it 
// grabs the connection and saves it.
const db = mongoose.createConnection(serverConfig.db.uri, serverConfig.db.options)

/* --------------------------------------- Authentication --------------------------------------- */
//TODO: add passport authentication



/* ---------------------------------------------------------------------------------------------- */
/*                                           MIDDLEWARE                                           */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Security ------------------------------------------ */
app.use(helmet(serverConfig.helmet.options))

/* ----------------------------------------- Compression ---------------------------------------- */
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

/* --------------------------------------- Request Logging -------------------------------------- */
// Only logs major (excludes static resources) requests to the console. Timestamp, scope, HTTP Code,
// HTTP Method, resource location, and response time are printed on one line upon request. Stopped/
// incomplete HTTP requests are listed with an "INCOMPLETE" HTTP Code.
app.use(require(serverConfig.paths.middleware + '/requestLogger.js'))



/* ---------------------------------------------------------------------------------------------- */
/*                                             ROUTES                                             */
/* ---------------------------------------------------------------------------------------------- */
/* ----------------------------------------- Main Router ---------------------------------------- */
app.use(router)

/* ------------------------------------------- Errors ------------------------------------------- */
app.use(render('error', {http_code: HTTPError.constants.HTTP_ERROR_CODES['404']}))

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