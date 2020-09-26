/* ---------------------------------------------------------------------------------------------- */
/*                                              SPEC                                              */
/* ---------------------------------------------------------------------------------------------- */
// USER
// > DEAUTH
// Removes authenticates from a user and provides invalidates an authenticated session
// If the request is a valid one, then the request session corresponding to the user is deleted,
// nullified, or invalidated. The user is then logged out of the session and redirected to the index
// page

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {
    req.logOut()
    if (req.session) req.session.destroy()
    if (req.accepts('html')) {
        res.redirect('/')
    }
}