#!/bin/node

/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
const app                       = require('./app/app.js')           // HTTP Server

/* ------------------------------------------ Utilities ----------------------------------------- */
const c                         = require('chalk')                  // Terminal Styling



/* ---------------------------------------------------------------------------------------------- */
/*                                              INIT                                              */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Config ------------------------------------------- */
// This attempts to load a server configuration
// If a custom one is not found, then the default is loaded
try {
    global.serverConfig = require('./config.js')
} catch (err) {
    global.serverConfig = require('./config.default.js')
}

/* ---------------------------------------- Process Stats --------------------------------------- */
console.log(
    c.bold.italic(serverConfig.name, 'Server (' + require('./package.json').version + ')'), '\n'+
    c.underline('IP: ') + c.magentaBright('localhost'), '\n'+
    c.underline('Port: ') + c.magentaBright(process.env.PORT || serverConfig.port), '\n'+
    c.underline('PID: ') + c.magentaBright(process.pid),
)



/* ---------------------------------------------------------------------------------------------- */
/*                                              MAIN                                              */
/* ---------------------------------------------------------------------------------------------- */
/* --------------------------------------- Express Server --------------------------------------- */
// This initializes the main server that will run the express app.
app.listen(process.env.PORT || serverConfig.port, () => {
    console.log(
        c.underline('Status: ') + c.bgGreen.bold.whiteBright('  ONLINE ✔  '), '\n'+
        c.underline('Logs: '), '\n'+
        c.blueBright.italic(
            '[DEV] You can now visit the development build of the website at https://localhost:' +
            serverConfig.port )
    )
})