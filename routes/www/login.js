/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Utilities ----------------------------------------- */
const render                    = require(serverConfig.paths.utilities + '/render')
const { isNotAuth }             = require(serverConfig.paths.middleware + '/authChecker')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'login'

/* ----------------------------------------- Middlewares ---------------------------------------- */
exports.handlers = []
exports.handlers.get = [
    isNotAuth,
]



/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.get = render('login')