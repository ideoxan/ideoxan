/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
const express = require('express')                              // Express HTTP/S Server
const { isNotAuth, isAuth } = require('../../utils/auth')

/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATIONS                                        */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
const router = express.Router()

/* ---------------------------------------------------------------------------------------------- */
/*                                             ROUTES                                             */
/* ---------------------------------------------------------------------------------------------- */
router.route('/')
    .get(require('./index'))

router.route('/index')
    .get(require('./index'))

router.route('/catalogue')
    .get(require('./catalogue'))

router.route('/about')
    .get(require('./about'))

router.route('/tos')
    .get(require('./tos'))

router.route('/privacy')
    .get(require('./privacy'))

router.route('/editor/:course/:chapter/:lesson')
    .get(require('./editor'))

router.route('/login')
    .get(isNotAuth, require('./login'))

router.route('/signup')
    .get(isNotAuth, require('./signup'))

router.route('^/@:requestedUser')
    .get(require('./user'))

router.route('/app/:section')
    .get(isAuth, require('./dashboard'))

/* ---------------------------------------------------------------------------------------------- */
/*                                             EXPORTS                                            */
/* ---------------------------------------------------------------------------------------------- */
module.exports = router