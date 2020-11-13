/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
const express = require('express')                              // Express HTTP/S Server
/* ------------------------------------------- General ------------------------------------------ */
const path = require('path')                                    // Path resolution

/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATIONS                                        */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
const masterRouter = express.Router()

/* ---------------------------------------------------------------------------------------------- */
/*                                             ROUTES                                             */
/* ---------------------------------------------------------------------------------------------- */
/* ----------------------------------------- Main Pages ----------------------------------------- */
// The main pages are pages that are typically not too dynamic and are part of the main front face
// of the website (stuff like the homepage, catalogue, etc.)
masterRouter.use('/', require('./general/generalRoutes'))
/* --------------------------------------------- API -------------------------------------------- */
// API pages are pages that deal with the internal API used to control essential features of the site
// This can range from authentication to data management to data reporting.
// These paths typically start with /api/v<VERSION_NUMBER>/~
masterRouter.use('/api/', require('./api/apiRoutes'))
/* ------------------------------------------- Special ------------------------------------------ */
masterRouter.route('/ads.txt').get((req, res) => res.sendFile(path.join(__dirname, '../../ads.txt')))
/* ---------------------------------------------------------------------------------------------- */
/*                                             EXPORTS                                            */
/* ---------------------------------------------------------------------------------------------- */
module.exports = masterRouter