/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
// Express HTTP Application
const express                   = require('express')

/* ------------------------------------------ Utilities ----------------------------------------- */
// File pattern matching
const glob                      = require( 'glob' )

/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Router ------------------------------------------- */
// Creates the router
const router = express.Router()



/* ---------------------------------------------------------------------------------------------- */
/*                                             ROUTES                                             */
/* ---------------------------------------------------------------------------------------------- */
/* ---------------------------------------- WWW (General) --------------------------------------- */
// These pages power the core of the Ideoxan website. They are used in almost every aspect. These
// include the homepage (/ or /index), the catalogue (/catalogue), the about page (/about), and
// more. A majority of these pages are dynamic.
loadRoutes('www', serverConfig.mounts.root)

/* --------------------------------------------- API -------------------------------------------- */
// These endpoints power the backend of the website. They are a public facing interface that allows
// for user registrations, authentication, and more
loadRoutes('api', serverConfig.mounts.api)

/* ---------------------------------------------------------------------------------------------- */
/*                                             METHODS                                            */
/* ---------------------------------------------------------------------------------------------- */
function loadRoutes(localPath, mountPath) {
    localPath = `${serverConfig.paths.routes}/${localPath}/*.js`
    glob.sync(localPath).forEach(file => { // Filters files
        let controller = require(file)
        for (let method of Object.keys(controller)) {
            if (method !== 'handlers' && method !== 'route') {
                let middleware = (controller.handlers || null)? controller.handlers[method] : []

                router[method](mountPath + controller.route, middleware || [], controller[method])
            }
        }
    })
} 


/* ---------------------------------------------------------------------------------------------- */
/*                                             EXPORTS                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Router ------------------------------------------- */
module.exports = router