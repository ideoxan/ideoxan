#!/bin/node

/**
 * Ideoxan Server Launcher Rev. 2020-10-24 (MAIN>>>PROD)
 * 
 * 
 *  $$$$$$$$\       $$\                                                  
 *  \__$$  _|       $$ |                                                 
 *     $$ |    $$$$$$$ |  $$$$$$\    $$$$$$\   $$\   $$\   $$$$$$\   /$$$$$$$\  
 *     $$ |   $$  __$$ | $$  __$$\  $$  __$$\  \$$\ $$  |  \____$$\  $$  __$$ \ 
 *     $$ |   $$ /  $$ | $$$$$$$$ | $$ /  $$ |  \$$$$  /  $$$$$$$ |  $$ |  $$ |
 *     $$ |   $$ |  $$ | $$   ____| $$ |  $$ |  $$  $$<  $$  __$$ |  $$ |  $$ |
 *  $$$$$$$$\ \$$$$$$$ | \$$$$$$$\  \$$$$$$  | $$  /\$$\ \$$$$$$$ |  $$ |  $$ |
 *  \_______|  \______/  \_______|  \_______/  \__/  \__| \_______|  \__|  \__|
 * 
 * 
 * Ideoxan is an open source and free to use website being developed. Its goal is to help students
 * and various other people learn programming. A majority of the courses and content provided on
 * the website is free to use and distribute. This makes it easy for educational environments to
 * teach and inform their students on how to become better software developers.
 * 
 * You can learn more and sign up today at https://ideoxan.com/
 * 
 * If you would like to contribute to this project, please read the Contributing Guidelines!
 * 
 * While this repository as a whole is licensed under the MIT License, keep in mind that this does
 * not mean that all content is under said license. Certain documents and media included or
 * referenced to may be licensed differently, restricted/copyrighted, or may not be licensed at all
 * 
 * This project is maintained and governed in accordance with the project's official Code of
 * Conduct,Agreement to its terms and conditions, along with Ideoxan's Official Terms of Service,
 * Ideoxan's Privacy Policy and the included license (MIT) is required to contribute to this
 * organization's project.
 * 
 * https://github.com/ideoxan
 * 
 * 
 */

// Node.js Runtime Versions 10.x and above supported
// JavaScript ECMA2016 specification is used.

// Start
console.log(`\n\n`)                                         // Spaces the server from previous entries
/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
const c                 = require('chalk')                      // Terminal coloring
const express           = require('express')                    // HTTP(S) server



/* ---------------------------------------------------------------------------------------------- */
/*                                  CONSTANTS AND INITIALIZATIONS                                 */
/* ---------------------------------------------------------------------------------------------- */

/* -------------------------------------- Environment Vars -------------------------------------- */
// Soon to be depreciated (being replaced by Ideoxan Server Configs)
// Loads global environment vars if in production, otherwise it loads a local .env file in the root
// directory
process.env.NODE_ENV != 'production'? require('dotenv').config():{}

/* ---------------------------------------- Server Config --------------------------------------- */
// New and bound to change
// Loads a local config.json from the root directory. If one does not exist, config.default.json is
// used instead.
try {
    global.cfg = require('./config.json')                       // Attempts to load config
} catch(error) {
    global.cfg = require('./config.default.json')               // Fallback to default
}
// Server Name and enabled indicator
console.log(c.bold.italic(cfg.server.name + ' Main Server'))

/* -------------------------------------- Server Constants -------------------------------------- */
const port  = process.env.PORT  || cfg.server.port || 3080      // Sets the server port
const ip    = cfg.server.ip     || 'localhost'                  // Sets the server IP address
console.log(`\tNetwork:`)                                       // Networking information
console.log(`\t\tIP: ${c.keyword('orange')(ip)}`)               // IP Address
console.log(`\t\tPort: ${c.keyword('orange')(port)}`)           // Port

const main  = express()                                         // Creates the Express HTTP Server

// Creates an empty object of valid express apps to be mounted
// Each one is indexed by their respective name and can be found under ./src/apps/
let apps    = {}

console.log(`\tPID: ${process.pid}`)                            // Process ID


/* ---------------------------------------------------------------------------------------------- */
/*                                              MAIN                                              */
/* ---------------------------------------------------------------------------------------------- */

/* --------------------------------------- Server Mounting -------------------------------------- */
// For each of the apps found within the server config, attempt to load them into the apps list
cfg.server.apps.forEach(app => {
    try {
        apps[app] = require('./src/apps/' + app )               // Attempt to load the app
        apps[app].mountFailed = false                           // If successful, it sets the mount status
    } catch (err) {
        apps[app] = {mountFailed: true, error: err}             // If unsuccessful, gives a failed mounting status               
    }
    
})

console.log(`\tLoaded Apps:`)                                   // Lists off loaded applications
for (const app in apps) {                                       // Loops through apps list
    if (apps[app].mountFailed) {                                // Checks to see if mounting failed
        // If mounting failed, inform the user 
        console.log(`\t\t${app}: ${c.bgRed(' ✖ FAILED TO MOUNT ')}\n\t\t\t${apps[app].error}`)
    } else {
        // Else, say all is good
        // TODO: use request module to "ping" server
        console.log(`\t\t${app}: ${c.bgGreen(' ✔ OK ')}`)
    }
}

/* ------------------------ Domain/URL Intercept And Redirect Middleware ------------------------ */
// TODO: Virtual Domains
// UNTIL: Using and mounting only the main (or first indexed) express application
main.use((req, res, next) => { return apps[cfg.server.apps[0]].app(req, res, next) })

/* --------------------------------------- Open The Server -------------------------------------- */
// Makes the main server listen on the designated port and address
main.listen(port, ()=> {
    // Callback function for when the server does run

    // Other helpful statistical data
    console.log(`\tStatus: ${c.greenBright('online')}`)         // Online, Idle, Paused, and Offline indicator

    // Helpful first-time dev message for non-production environments
    if (process.env.NODE_ENV != 'production')
        console.log(c.magentaBright.italic(`\t[DEV] Now you can visit the website in testing mode at http://${ip}:${port}/`))

    console.log(`\tLogs:`)                                      // Succeeded by logs (ie. DB/WWW/ERROR)
})


// End