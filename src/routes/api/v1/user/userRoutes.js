/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
const express = require('express')                              // Express HTTP/S Server
/* -------------------------------------------- Auth -------------------------------------------- */
const auth = require('../../../../utils/auth')                  // Auth module
const { body } = require('express-validator') // Validates sign up/in information
/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATIONS                                        */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
const router = express.Router()

/* ---------------------------------------------------------------------------------------------- */
/*                                             ROUTES                                             */
/* ---------------------------------------------------------------------------------------------- */
router.route('/auth')
    .post(auth.isNotAuth, require('./userAuth'))

router.route('/deauth')
    .get(auth.isAuth, require('./userDeauth'))

router.route('/create')
    .post(body('email').isEmail(), body('password').isLength({ min: 6, max: 254 }), body('displayName').isAlphanumeric().isLength({ min: 3, max: 32 }), auth.isNotAuth, require('./userCreate'))

router.route('/update')
    .post(body('oldemail').isEmail(), body('email').isEmail(), body('oldpassword').isLength({ min: 6, max: 254 }), body('password').isLength({ min: 6, max: 254 }),body('displayName').isAlphanumeric().isLength({ min: 3, max: 32 }), auth.isAuth, require('./userUpdate'))

router.route('/delete')
    .post(auth.isAuth, require('./userDelete'))

/* ---------------------------------------------------------------------------------------------- */
/*                                             EXPORTS                                            */
/* ---------------------------------------------------------------------------------------------- */
module.exports = router