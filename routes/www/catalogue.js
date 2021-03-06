/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Utilities ----------------------------------------- */
const render                    = require(serverConfig.paths.utilities + '/render')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'catalogue'



/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.get = render('catalogue')