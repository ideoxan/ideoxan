//

/**
 * 
 * Ideoxan Main Server
 * 
*/

// Start
/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */

/* ------------------------------------------- Express ------------------------------------------ */
const express           = require('express')                    // HTTP(S) Server
const compression       = require('compression')                // Response Compression
const helmet            = require('helmet')                     // Fixes possible Express exploits
const session           = require('express-session')            // Sessions
const flash             = require('express-flash')              // Session Alert Messaging
const cookieParser      = require('cookie-parser')              // Parses cookies and their data
const morgan            = require('morgan')                     // Logging

/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const mongoose          = require('mongoose')                   // MongoDB driver

/* -------------------------------------------- Auth -------------------------------------------- */
const passport          = require('passport')                   // User sessions, sign ups, sign ons
const passportInit      = require('../utils/passport')          // Local passport Config

/* ---------------------------------------- Localization ---------------------------------------- */
const { I18n }          = require('i18n')                       // Localization

/* ------------------------------------------- General ------------------------------------------ */
const c                 = require('chalk')                      // Terminal coloring
const path              = require('path')                       // Path resolution

/* -------------------------------------------- Utils ------------------------------------------- */
const { HTTPErrorPage } = require('../utils/HTTPErrors')        // HTTP Error Utils



/* ---------------------------------------------------------------------------------------------- */
/*                                  CONSTANTS AND INITIALIZATIONS                                 */
/* ---------------------------------------------------------------------------------------------- */

/* -------------------------------------- Environment Vars -------------------------------------- */
// If not launched from the IX Server Launcher, this loads them
// Soon to be depreciated (being replaced by Ideoxan Server Configs)
// Loads global environment vars if in production, otherwise it loads a local .env file in the root
// directory
process.env.NODE_ENV != 'production'? require('dotenv').config():{}


/* ---------------------------------------- Server Config --------------------------------------- */
// If not launched from the IX Server Launcher, this loads the config
// New and bound to change
// Loads a local config.json from the root directory. If one does not exist, config.default.json is
// used instead.
if (typeof cfg === 'undefined') {                               // If not loaded already, load it.
    try {
        cfg = require('../../config.json')                      // Attempts to load config
    } catch (error) {
        cfg = require('../../config.default.json')              // Fallback to default
    }
}

/* --------------------------------------- Authentication --------------------------------------- */
// Uses passport for authentication.
// See the passport module and the local passport helper file for more information
passportInit(passport)                                          // Loads and uses passport config

/* ------------------------------------- MongoDB (Database) ------------------------------------- */
// Connects to the local or internet database (I suggest local btw) using valid mongo uri 
// Uses Mongoose drivers for Mongo DB because native ones are awful :^)
mongoose.connect(cfg.server.mongo || "mongodb://localhost:27017/ix", {
    useNewUrlParser: true,                                      // Required for functionality
    useUnifiedTopology: true                                    // Required for functionality
})

// Logs any and all calls to the mongodb database. This can be anything from simple look up queries
// to writing new profile information. THE INFORMATION ITSELF IS NOT LOGGED, ONLY THE ACCESS
mongoose.set('debug', (coll, method) => {                       // Sets debug logging
    console.log([
        '\t\t[', c.grey(new Date().toISOString()), ']',
        c.bold('[DATABASE]'),
        method.toUpperCase(),
        'web', '→', coll
    ].join(' '))
})

/* -------------------------------------------- I18n -------------------------------------------- */
// Internationalization and localization initialization
// > Why a JSON object of I18n objects? 
// Well because there are different areas in which I18n applies. For example, the locales files for
// the website (www) are not going to be in the same area as the localization files for the editor
// and the curriculum. They are being split up for ease. Now translation for the website can be
// accessed via i18n.www rather than complex instances of the i18n object, or even worse, instances
// that are separate variables
// 
// No longer works on ideoxan-web-2 (a.k.a. tailwindcss rewrite)
/* const i18n = {
    "www": new I18n({                                           // Creates i18n object for the website
        "locales": cfg.server.locales.availableLangs,
        "defaultLocale": cfg.server.locales.default,
        "directory": path.join(__dirname, '../../', cfg.content.www.paths.locales),
        "cookie": cfg.server.locales.cookieLangName,
        "queryParameter": cfg.server.locales.paramName,
        "objectNotation": true,
        "autoReload": true,
        "updateFiles": false,
    })
} */

/* -------------------------------------- Server Constants -------------------------------------- */
const app = express()                                           // Creates the Express HTTP Server



/* ---------------------------------------------------------------------------------------------- */
/*                                     EXPRESS APP MIDDLEWARE                                     */
/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------- Static Files ---------------------------------------- */
// Serves generic static files (ie. IX logo, site css, etc.)
app.use(cfg.server.mountPoints.static, express.static(cfg.content.www.paths.static, {
    maxAge: (process.env.NODE_ENV == 'production')? 1000*60*60*12 : 0
}))

// Serves editor static files (ie. editor css, editor js, etc.)
app.use(cfg.server.mountPoints.editorStatic, express.static(cfg.content.editor.paths.static, {
    maxAge: (process.env.NODE_ENV == 'production')? 1000*60*60*12 : 0
}))

// Serves curriculum static files (temp fix)
// TODO: Move curriculum static files to somewhere else (where? yeah idk)
app.use(cfg.server.mountPoints.static, express.static('static', {                   
    maxAge: (process.env.NODE_ENV == 'production')? 1000*60*60*12 : 0
}))

/* ------------------------------------ Logging HTTP Requests ----------------------------------- */
// Logs only major HTTP requests to the website (ie. to certain directories or domains)
// What is included in the log:
//      - Timestamp
//      - HTTP Method (GET, POST, PUT, etc)
//      - Response Code (200, 400, 404, 500)
//      - Response ms
//      - Resolved IP Address (shows up usually as ::ffff:127.0.0.1 on localhost)
//      - Destination
// THE INFORMATION WITHIN THE REQUEST IS NOT LOGGED, ONLY THE ACCESS
app.use(morgan((tokens, req, res) => {
    return [
        '\t\t[', c.grey(tokens['date'](req, res, 'iso')), ']',
        c.bold('[SERVER]'),
        tokens['method'](req, res),
        '(', coloredResponse(tokens['status'](req, res)), '|', tokens['response-time'](req, res), 'ms)',
        tokens['remote-addr'](req, res), '→', tokens['url'](req, res)
    ].join(' ')
}))

/* ------------------------------ View Engine And Website Rendering ----------------------------- */
// EJS is used to render webpages (using the .ejs file format). All data is held server side, rendered
// and then sent back in the request. ALl other files are typically static and are not handled by
// the view engine.
app.set('view engine', cfg.server.viewEngine)                   // Renders EJS files
app.set('views', [                                              // Sets directories for EJS files
    cfg.content.www.paths.views,                                // Main website view directory
    cfg.content.editor.paths.views                              // Editor view directory
])

/* -------------------------------------- URL/JSON Parsing -------------------------------------- */
app.use(express.urlencoded({ extended: true }))                 // Encoded URLS
app.use(express.json())                                         // JSON for github delivery

/* -------------------------------------------- Proxy ------------------------------------------- */
// If this app is being run behind a reverse proxy (like NGINX), this setting is required for it to
// work properly. Without it, issues can arise over the server ignoring or even rejecting requests.
// The proxy itself, may do the same as well. This makes the server trust reverse proxies in
// production mode 
if (process.env.NODE_ENV == 'production') app.set('trust proxy', 1)

/* --------------------------------------- Authentication --------------------------------------- */
// Uses the express session module 
cfg.server.sessions.secret = process.env.EXPRESS_SESSION_SECRET // Injects session secret in config
app.use(session(cfg.server.sessions))

// Uses passport for authentication.
// See the passport module and the local passport helper file for more information
app.use(passport.initialize())                                  // Init passport
app.use(passport.session())                                     // Init sessions

// Cookie Parsing
app.use(cookieParser(process.env.EXPRESS_SESSION_SECRET))       // Parses cookies using the secret

/* ----------------------------------- Helmet Express Security ---------------------------------- */
// Uses express-helmet to prevent/mitigate express-related exploits and security issues
app.use(helmet({
    contentSecurityPolicy: false
}))

/* ---------------------------- Internationalization And Localization --------------------------- */
// TODO: replace with vdomain/path regex matching for certain paths (ie. www vs. editor)
/* app.use(i18n.www.init) */                                          // Initializes i18n website

// TODO: abstract to helper i18n.js
// Middleware for handling language selection/switching
/* app.use(function (req, res, next) {
    // Sets language query and cookie names based on config file
    const langQuery     = req.query[cfg.server.locales.paramName]       || null
    const langCookie    = req.cookies[cfg.server.locales.cookieName]    || null
    if (langQuery) {                                            // Validates query
        // If the language isn't available ignore it, move on.
        if (!cfg.server.locales.availableLangs.includes(langQuery)) return next()

        // If it is available, set the locale and cookie to the language
        res.setLocale(langQuery)
        res.cookie(cfg.server.locales.cookieName, langQuery)
    } else {
        // If the cookie isn't valid, set it to a default config language (default: en)
        if (!langCookie) res.cookie(cfg.server.locales.cookieName, cfg.server.locales.default)

        // Sets the locale
        res.setLocale(req.cookies[cfg.server.locales.cookieName] || cfg.server.locales.default)
    }

    return next()
}) */

/* -------------------------------------------- Other ------------------------------------------- */
app.use(compression())                                          // Compresses responses
app.use(flash())                                                // Session alert messaging



/* ---------------------------------------------------------------------------------------------- */
/*                                        APPLICATION MAIN                                        */
/* ---------------------------------------------------------------------------------------------- */

/* -------------------------------- Master Route Handler Handoff -------------------------------- */
// Hands off all eligible requests to the master route handler.
// See routes.js under ../routes
app.use(require('../routes/routes'))                            // This is the master route handler

/* --------------------------------------- Github Webhook --------------------------------------- */
// TODO: Fix githook
/* app.post('/githook', async (req, res) => {
    // TODO: Listen for only production branch when NODE_ENV is set to "production"
    if (req.header('X-Hub-Signature') !== 'sha1=' + process.env.GITHUB_WEBHOOK_SIG) return res.status(404).end()

    res.status(200).end()
    exec('git submodule update --remote --init --recursive', (err, out, outerr) => {
        if (out.toString().length < 1) {
            console.log(`Courses Submodules already up to date`)
        } else {
            console.log(`Updated Courses Submodules from GitHub ${(outerr) ? 'Error' + outerr : ''}`)
        }
        exec('git pull', (err, out, outerr) => {
            if (out.toString().startsWith('Already up to date')) {
                console.log(`Server already up to date`)
            } else {
                console.log(`Updated Server from GitHub ${(outerr) ? 'Error' + outerr : ''}`)
            }
        })
    })

}) */

/* --------------------------------------------- 404 -------------------------------------------- */
app.use(async (req, res) => {                                   // If there are no more routes to follow then
    let responseError = new HTTPErrorPage(req, res, '404')
    return await responseError.renderPage()
})

/* --------------------------------------------- 5xx -------------------------------------------- */
app.use(async (err, req, res) => {                              // If there is a server side error thrown then
    console.error(err.stack)                                    // Log the error and send the response
    let responseError = new HTTPErrorPage(req, res, '500')
    return await responseError.renderPage()
})



/* ---------------------------------------------------------------------------------------------- */
/*                                             METHODS                                            */
/* ---------------------------------------------------------------------------------------------- */

function coloredResponse(statusCode) {                          // Color codes response statuses in console
    if (typeof statusCode == 'undefined') return c.grey.bold('INCOMP')
    else if (statusCode.toString().startsWith('5')) return c.redBright.bold(statusCode)
    else if (statusCode.toString().startsWith('4')) return c.yellow.bold(statusCode)
    else return c.green.bold(statusCode)
}



/* ---------------------------------------------------------------------------------------------- */
/*                                             EXPORTS                                            */
/* ---------------------------------------------------------------------------------------------- */
// Exports the application to be mounted on the server
exports.app = app



// End