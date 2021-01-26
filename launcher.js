#!/bin/node

/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
// Express HTTP Application
const app                       = require('./app/app.js')

/* ------------------------------------------ Utilities ----------------------------------------- */
// Terminal Styling
const c                         = require('chalk')
// Server configuration loading
const loadServerConfig          = require('./app/utilities/loadServerConfig')



/* ---------------------------------------------------------------------------------------------- */
/*                                              INIT                                              */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Config ------------------------------------------- */
// This attempts to load a server configuration
// If a custom one is not found, then the default is loaded
loadServerConfig()

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