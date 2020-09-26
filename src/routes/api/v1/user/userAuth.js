/* ---------------------------------------------------------------------------------------------- */
/*                                              SPEC                                              */
/* ---------------------------------------------------------------------------------------------- */
// > AUTH
// Authenticates a user and provides a fully authenticated session
// This accepts 2 parameters specified in the body of the document
/**
 * @param {String} req.body.email - A valid email used to authenticate an account (unique)
 * @param {String} req.body.password - A password (min: 6, max: 254 chars)
 */
// If the request is a valid one (valid email, valid password) and correct (email and password
// correspond in the database), then the server redirects to the index page. If not, the server
// redirects to the login page. This is often due to the fact that the user is banned, one of the
// fields is invalid, or the user does not exist
//
// See passport.js for more information

/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* -------------------------------------------- Auth -------------------------------------------- */
const passport = require('passport')                            // User sessions, sign ups, sign ons

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
})