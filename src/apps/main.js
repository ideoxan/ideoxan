/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
const express = require('express')                              // Express HTTP/S Server
const compression = require('compression')                      // Req/Res compression
const helmet = require('helmet')                                // Express Security Fix
const session = require('express-session')                      // Sessions
const flash = require('express-flash')                          // Session Alert Messaging
const cookieParser = require('cookie-parser')                   // Parses cookies and their data
const morgan = require('morgan')                                // Logging
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const mongoose = require('mongoose')                            // MongoDB driver
/* -------------------------------------------- Auth -------------------------------------------- */
const passport = require('passport')                            // User sessions, sign ups, sign ons
const passportInit = require('../utils/passport')               // Local passport Config
/* ------------------------------------------- General ------------------------------------------ */
const fs = require('fs')                                        // File System interface
const dotenv = require('dotenv')                                // .env file config
const c = require('chalk')                                      // Terminal coloring
const exec = require('child_process').exec                      // Process execution
/* -------------------------------------------- Utils ------------------------------------------- */
const {renderErrorPage} = require('../utils/pages')             // Page rendering utilities

/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATIONS                                        */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Env Vars ------------------------------------------ */
if (process.env.NODE_ENV != 'production') dotenv.config()       // Load local .env config if not prod
/* ---------------------------------------- Global Config --------------------------------------- */
typeof cfg === 'undefined'?cfg=require('../../cfg.json'):{}     // Fix for tests and direct launches
/* -------------------------------------------- Auth -------------------------------------------- */
passportInit(passport)                                          // Loads and uses local passport config
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
// Connects to the local or internet database (I suggest local btw) using valid mongo uri 
// Uses Mongoose drivers for Mongo DB because native ones are awful :^)
mongoose.connect(cfg.server.mongo || "mongodb://localhost:27017/ix", {
    useNewUrlParser: true,                                      // Required
    useUnifiedTopology: true                                    // Required
})

mongoose.set('debug', (coll, method) => {                       // Logging (DB)
    console.log([
        '[', c.grey(new Date().toISOString()), ']',
        c.bold('[DATABASE]'),
        method.toUpperCase(),
        'web', '→', coll
    ].join(' '))
})
/* ------------------------------------------- Express ------------------------------------------ */
const app = express()                                           // Creates express HTTP server

// Serves static files
app.use(cfg.server.mountPoints.static, express.static(cfg.content.www.paths.static, {
    maxAge: (process.env.NODE_ENV == 'production')? 1000*60*60*12 : 0
}))
// Serves editor static files
app.use(cfg.server.mountPoints.editorStatic, express.static(cfg.content.editor.paths.static, {
    maxAge: (process.env.NODE_ENV == 'production')? 1000*60*60*12 : 0
}))
// Serves curriculum static files (temp fix)
app.use(cfg.server.mountPoints.static, express.static('static', {                   
    maxAge: (process.env.NODE_ENV == 'production')? 1000*60*60*12 : 0
}))

app.use(morgan((tokens, req, res) => {                          // Logging
    return [
        '[', c.grey(tokens['date'](req, res, 'iso')), ']',
        c.bold('[SERVER]'),
        tokens['method'](req, res),
        '(', coloredResponse(tokens['status'](req, res)), '|', tokens['response-time'](req, res), 'ms)',
        tokens['remote-addr'](req, res), '→', tokens['url'](req, res)
    ].join(' ')
}))

app.set('view engine', cfg.server.viewEngine)                   // Renders EJS files
app.set('views', [                                              // Sets directories for EJS files
    cfg.content.www.paths.views,
    cfg.content.editor.paths.views
])

app.use(express.urlencoded({ extended: true }))                 // Encoded URLS
app.use(express.json())                                         // JSON for github delivery

if (process.env.NODE_ENV == 'production') app.set('trust proxy', 1)

cfg.server.sessions.secret = process.env.EXPRESS_SESSION_SECRET
app.use(session(cfg.server.sessions))

app.use(passport.initialize())                                  // Init passport
app.use(passport.session())                                     // Init sessions

app.use(cookieParser(process.env.EXPRESS_SESSION_SECRET))       // Parses cookies using the env SS
app.use(helmet({
    contentSecurityPolicy: false
}))                                                             // Express security
app.use(compression())                                          // GZIP res
app.use(flash())                                                // Session alert messaging

/* ---------------------------------------------------------------------------------------------- */
/*                                             SERVER                                             */
/* ---------------------------------------------------------------------------------------------- */
app.use(require('../routes/routes'))                            // This is the master route handler

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
    renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
})

/* --------------------------------------------- 5xx -------------------------------------------- */
app.use(async (err, req, res) => {                              // If there is a server side error thrown then
    console.error(err.stack)                                    // Log the error and send the response
    renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
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
exports.app = app                                               // Exports the application to be mounted on the server
