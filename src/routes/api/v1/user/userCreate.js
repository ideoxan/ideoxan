/* ---------------------------------------------------------------------------------------------- */
/*                                              SPEC                                              */
/* ---------------------------------------------------------------------------------------------- */
// USER
// > CREATE
// Creates a new User Account with the proper parameters
// This accepts 3 parameters specified in the body of the document.
/**
 * @param {String} req.body.displayName - The display name of the user (non-unique). Can be changed
 * @param {String} req.body.email - A valid email used to authenticate an account (unique)
 * @param {String} req.body.password - A password (min: 6, max: 254 chars)
 */
// If the request is a valid one (valid email, valid password, valid displayName), then the server
// redirects to the login page for authentication. If not, a 422 ERR_BADENT (HTTP: Unprocessable
// Entity) is returned. This is often due to the fact that the user already exists within the DB or
// at least one of the fields is invalid

/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const dbUtil = require('../../../../utils/dbUtil')              // Database Util Module
const Users = require('../../../../models/Users')               // Schema: Users
/* -------------------------------------------- Auth -------------------------------------------- */
const bcrypt = require('bcryptjs')                              // User password hashing/comparison
const { validationResult } = require('express-validator') // Validates sign up/in information

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {
    const validationErr = validationResult(req)
    if (!validationErr.isEmpty() || await dbUtil.users.getUserByEmail(req.body.email) || await dbUtil.users.getUserByDisplayName(req.body.displayName)) {
        res.status(422)
        if (req.accepts('html')) {
            req.flash('error', 'Invalid Email, Username, or Password')
            res.redirect('/signup')
        } else {
            renderErrorPage(req, res, 422, 'ERR_BADENT', 'Unprocessable Entity')
        }
    } else {
        await Users.create({
            displayName: req.body.displayName.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: await bcrypt.hash(req.body.password, Number.parseInt(process.env.PWD_HASH))
        })
        res.redirect('/login')
    }
}