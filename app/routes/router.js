/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
// Express HTTP Application
const express                   = require('express')

/* ------------------------------------------ Utilities ----------------------------------------- */
// Filesystem I/O
const fs                        = require('fs')
// File pattern matching
const glob                      = require( 'glob' )


/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Router ------------------------------------------- */
// Creates the router
const router = express.Router()

// Loads all routes
const routes = {'api': [], 'www': []} // Sets list of possible routes
for (let folder of Object.keys(routes)) { // Iterates through routes
    glob.sync(`${serverConfig.paths.routes}/${folder}/*.js`).forEach(route => { // Filters files
        routes[folder].push(require(route)) // Adds route to routes list
    })
}


/* ---------------------------------------------------------------------------------------------- */
/*                                             ROUTES                                             */
/* ---------------------------------------------------------------------------------------------- */
/* ---------------------------------------- WWW (General) --------------------------------------- */
// These pages power the core of the Ideoxan website. They are used in almost every aspect. These
// include the homepage (/ or /index), the catalogue (/catalogue), the about page (/about), and
// more. A majority of these pages are dynamic.
router.use(serverConfig.mounts.root, (req, res, next) => {
    for (let route of routes['www']) {
        route(req, res, next)
    }
})

/* --------------------------------------------- API -------------------------------------------- */
// These endpoints power the backend of the website. They are a public facing interface that allows
// for user registrations, authentication, and more
router.use(serverConfig.mounts.api, (req, res, next) => {
    for (let route of routes['api']) {
        route(req, res, next)
    }
})


/* ---------------------------------------------------------------------------------------------- */
/*                                             EXPORTS                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Router ------------------------------------------- */
module.exports = router