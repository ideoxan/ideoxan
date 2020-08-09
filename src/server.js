module.exports = () => {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                            REQUIRES                                            */
    /* ---------------------------------------------------------------------------------------------- */
    /* ------------------------------------------- Express ------------------------------------------ */
    const express = require('express')                              // Express HTTP/S Server
    const compression = require('compression')                      // Req/Res compression
    const helmet = require('helmet')                                // Express Security Fix
    const session = require('express-session')                      // Sessions
    const flash = require('express-flash')                          // Session Alert Messaging
    const cookieParser = require('cookie-parser')                   // Parses cookies and their data
    const morgan = require('morgan')                                // Logging
    /* ------------------------------------- MongoDB (Database) ------------------------------------- */
    const mongoose = require('mongoose')                            // MongoDB driver
    const dbUtil = require('./dbUtil')                              // Database Util Module
    const Users = require('./models/Users')                         // Schema: Users
    const EditorSave = require('./models/EditorSave')               // Schema: Editor Saves
    /* -------------------------------------------- Auth -------------------------------------------- */
    const bcrypt = require('bcryptjs')                              // User password hashing/comparison
    const passport = require('passport')                            // User sessions, sign ups, sign ons
    const passportInit = require('./passport')                      // Local passport Config
    const auth = require('./auth')                                  // Auth module
    const { body, validationResult } = require('express-validator')   // Validates sign up/in information
    /* ------------------------------------------- General ------------------------------------------ */
    const fs = require('fs')                                        // File System interface
    const dotenv = require('dotenv')                                // .env file config
    const c = require('chalk')                                      // Terminal coloring
    const exec = require('child_process').exec                      // Process execution

    /* ---------------------------------------------------------------------------------------------- */
    /*                                         INITIALIZATIONS                                        */
    /* ---------------------------------------------------------------------------------------------- */
    /* ------------------------------------------ Env Vars ------------------------------------------ */
    if (process.env.NODE_ENV != 'production') dotenv.config()       // Load local .env config if not prod
    /* -------------------------------------------- Auth -------------------------------------------- */
    passportInit(passport)                                          // Loads and uses local passport config
    /* ------------------------------------------- Express ------------------------------------------ */
    const app = express()                                           // Creates express HTTP server
    app.listen(process.env.PORT || 3080)                            // Listens on environment set port
    console.log('Ideoxan Server Online')

    app.use('/static', express.static('static'))                    // Serves static files
    app.set('view engine', 'ejs')                                   // Renders EJS files
    app.use(express.urlencoded({ extended: true }))                 //Encoded URLS
    app.use(express.json())                                         // JSON for github delivery

    if (process.env.NODE_ENV == 'production') app.set('trust proxy', 1)
    app.use(session({                                               // Sessions
        secret: process.env.EXPRESS_SESSION_SECRET,                 // Use environment set secret
        saveUninitialized: false,                                   // Do not save uninitialized sessions
        resave: false,                                              // Do not write local sessions if not needed
        cookie: {                                                   // Cookie settings
            secure: 'auto',                                         // Sets secure attribute automatically based on HTTP settings
            maxAge: 86400000,                                       // Max age to 1 day
            sameSite: 'lax',                                        // Lax same-site policy   
        },
        name: 'ixsid'
    }))
    app.use(passport.initialize())                                  // Init passport
    app.use(passport.session())                                     // Init sessions

    app.use(cookieParser(process.env.EXPRESS_SESSION_SECRET))       // Parses cookies using the env SS
    app.use(helmet({
        contentSecurityPolicy: false
    }))                                                             // Express security
    app.use(compression())                                          // Gzips res
    app.use(flash())                                                // Session alert messaging

    app.use(morgan((tokens, req, res) => {                          // Logging
        return [
            '[', c.grey(tokens['date'](req, res, 'iso')), ']',
            c.bold('[SERVER]'),
            tokens['method'](req, res),
            '(', coloredResponse(tokens['status'](req, res)), '|', tokens['response-time'](req, res), 'ms)',
            tokens['remote-addr'](req, res), '→', tokens['url'](req, res)
        ].join(' ')
    }))
    /* ------------------------------------- MongoDB (Database) ------------------------------------- */
    // Connects to the local or internet database (I suggest local btw) using valid mongo uri 
    // Uses Mongoose drivers for Mongo DB because native ones are awful :^)
    mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ix", {
        useNewUrlParser: true,                                      // Required
        useUnifiedTopology: true                                    // Required
    })
    mongoose.set('debug', (coll, method) => {  // Logging (DB)
        console.log([
            '[', c.grey(new Date().toISOString()), ']',
            c.bold('[DATABASE]'),
            method.toUpperCase(),
            'web', '→', coll
        ].join(' '))
    })

    /* ---------------------------------------------------------------------------------------------- */
    /*                                            CONSTANTS                                           */
    /* ---------------------------------------------------------------------------------------------- */
    // Most stuff is .env anyways...

    /* ---------------------------------------------------------------------------------------------- */
    /*                                             SERVER                                             */
    /* ---------------------------------------------------------------------------------------------- */
    /* ----------------------------------------- Main Pages ----------------------------------------- */
    // The main pages are pages that are typically not too dynamic and are part of the main front face
    // of the website (stuff like the homepage, catalogue, etc.)
    app.get('/', async (req, res) => {
        renderCustomPage(req, res, 'index')                         // Renders homepage
    })

    app.get('/index', async (req, res) => {
        renderPage(req, res)                                        // Renders homepage
    })

    app.get('/catalogue', async (req, res) => {
        renderPage(req, res)                                        // Renders catalogue (YES JVAKUT ITS SPELLED THIS WAY)
    })

    app.get('/pricing', async (req, res) => {
        renderPage(req, res)                                        // Renders pricing page
    })

    app.get('/about', async (req, res) => {
        renderPage(req, res)                                        // Renders about page
    })

    app.get('/tos', async (req, res) => {
        renderPage(req, res)                                        // Renders TOS page
    })

    app.get('/privacy', async (req, res) => {
        renderPage(req, res)                                        // Renders Privacy Policy page
    })

    /* ------------------------------------------ Accounts ------------------------------------------ */
    // The account pages are dynamic based on account status. These tend to be authorization pages (ie.
    // login, sign up, account management, profiles, etc.)
    app.get('/login', auth.isNotAuth, async (req, res) => {        // Checks if not auth
        res.render('login', { auth: false })                        // Renders login page (auth forced off)
    })

    app.get('/signup', auth.isNotAuth, async (req, res) => {       // Checks if not auth
        res.render('signup', { auth: false })                       // Renders signup page (auth forced off)
    })

    app.get('/user/:requestedUser', async (req, res) => {           // Renders User Page
        let user = await dbUtil.users.getUserByDisplayName(req.params.requestedUser)
        if (user) {
            let completed = []
            let inProgress = []
            let availableCourses = await getAvailableCourses()
            for (let i = 0; i < availableCourses.length; i++) {
                let editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, availableCourses[i].name.toLowerCase().replace(/ /g, '-').replace(/[().]/g, ''))
                if (editorSave) {
                    let totalLessons = 0;
                    let completedLessons = 0;
                    for (let j = 0; j < editorSave.data.length; j++) {
                        for (let k = 0; k < editorSave.data[j].length; k++) {
                            if (editorSave.data[j][k].completed) completedLessons++
                            totalLessons++
                        }
                    }

                    if (completedLessons == totalLessons) {
                        completed.push({ name: availableCourses[i].name, percent: 100, path: availableCourses[i].path, lastActive: editorSave.lastActive.toString() })
                    } else {
                        inProgress.push({ name: availableCourses[i].name, percent: Math.round((completedLessons / totalLessons) * 100), path: availableCourses[i].path, lastActive: editorSave.lastActive, started: editorSave.started.toString() })
                    }
                }
            }
            renderCustomPage(req, res, 'user', { reqUserDisplayName: user.displayName, reqUserRoles: user.roles, reqUserCreated: user.created, completed: completed, inProgress: inProgress })
        } else {
            renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
        }
    })

    app.get('/settings', auth.isAuth, async (req, res) => {
        try {
            let user = await dbUtil.users.getUserByUserID(req.session.passport.user) || null
            if (user) {
                renderCustomPage(req, res, 'usersettings', { email: user.email, roles: user.roles, created: user.created })
            } else {
                renderCustomPage(req, res, 'usersettings')
            }
        } catch (err) {
            console.log(err.stack)
            renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
        }
    })

    /* --------------------------------------------- API -------------------------------------------- */
    // API pages are pages that deal with the internal API used to control essential features of the site
    // This can range from authentication to data management to data reporting.
    // These paths typically start with /api/v<VERSION_NUMBER>/~

    // SPEC: V1 API
    // UPDATED: 2020 07 02

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
    app.post('/api/v1/user/create', [
        body('email').isEmail(),
        body('password').isLength({ min: 6, max: 254 }),
        body('displayName').isAlphanumeric().isLength({ min: 3, max: 254 })
    ], auth.isNotAuth, async (req, res) => {
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
    })

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
    app.post('/api/v1/user/auth', auth.isNotAuth, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
    }))

    // > DEAUTH
    // Removes authenticates from a user and provides invalidates an authenticated session
    // If the request is a valid one, then the request session corresponding to the user is deleted,
    // nullified, or invalidated. The user is then logged out of the session and redirected to the index
    // page
    app.get('/api/v1/user/deauth', auth.isAuth, async (req, res) => {
        req.logOut()
        if (req.session) req.session.destroy()
        if (req.accepts('html')) {
            res.redirect('/')
        }
    })

    // > UPDATE
    // Updates a specified user's information (email, password, display name, etc.)
    app.post('/api/v1/user/update', [
        body('oldemail').isEmail(),
        body('email').isEmail(),
        body('oldpassword').isLength({ min: 6, max: 254 }),
        body('password').isLength({ min: 6, max: 254 }),
        body('displayName').isAlphanumeric().isLength({ min: 3, max: 254 })
    ], auth.isAuth, async (req, res) => {
        try {
            let user = await dbUtil.users.getUserByUserID(req.session.passport.user) || null
            let updatedProperties = req.body || null
            let updatedPropertiesLength = Object.keys(updatedProperties).length || -1

            if (user && updatedProperties && updatedPropertiesLength > 0) {
                if (updatedProperties.displayName) {
                    if (await dbUtil.users.getUserByDisplayName(updatedProperties.displayName)) {
                        req.flash('error', 'Username already taken')
                        return res.status(422).redirect('/settings')
                    }
                    user.displayName = updatedProperties.displayName
                    user.markModified('displayName')
                }
                if (updatedProperties.password && updatedProperties.oldpassword) {
                    if (await bcrypt.compare(updateddProperties.oldpassword, user.password)) {
                        user.password = await bcrypt.hash(req.body.password, Number.parseInt(process.env.PWD_HASH))
                        user.markModified('password')
                    } else {
                        req.flash('error', 'Password is incorrect')
                        return res.status(422).redirect('/settings')
                    }
                }
                if (updatedProperties.email && updatedProperties.oldemail) {
                    if (user.email == updatedProperties.oldemail && !await dbUtil.users.getUserByEmail(updatedProperties.email)) {
                        user.email = updatedProperties.email
                        user.markModified('email')
                    } else {
                        req.flash('error', 'Email is incorrect')
                        return res.status(422).redirect('/settings')
                    }
                }
                await user.save()
                req.flash('success', 'Information updated successfully')
                res.status(200).redirect('/settings')
            } else {
                renderErrorPage(req, res, 422, 'ERR_BADENT', 'Unprocessable Entity')
            }
        } catch (err) {
            console.log(err.stack)
            renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
        }
    })

    // > DELETE
    // Deletes a user and their associated information
    app.post('/api/v1/user/delete', auth.isAuth, async (req, res) => {
        try {
            let user = await dbUtil.users.getUserByUserID(req.session.passport.user) || null
            if (user) {
                await user.deleteOne()
                req.logOut()
                if (req.session) req.session.destroy()
                if (req.accepts('html')) {
                    res.redirect('/')
                }
            }
        } catch (err) {
            console.log(err.stack)
            renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
        }
    })

    // EDITOR
    // > SAVE (POST)
    // Saves the given data to the database from the editor
    app.post('/api/v1/save/editor/:course/:chapter/:lesson', auth.isAuth, async (req, res) => {
        try {
            let user = null
            let editorSave = null
            if (typeof req.session.passport != 'undefined' && req.session.passport !== null) {
                user = await dbUtil.users.getUserByUserID(req.session.passport.user)
                if (user != null) {
                    editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)

                    if (editorSave == null) {
                        let saveData = []
                        let courseInfo = await readIXConfig(`../static/curriculum/curriculum-${req.params.course}/.ideoxan`)

                        for (let i = 0; i < courseInfo.chapters.length; i++) {
                            saveData[i] = []
                            for (let j = 0; j < courseInfo.chapters[i].lessons.length; j++) {
                                saveData[i][j] = {
                                    completed: false,
                                    data: []
                                }
                            }
                        }

                        await EditorSave.create({ userid: user.userid, course: req.params.course, data: saveData })
                        editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)
                    }
                    if (typeof editorSave.data[Number.parseInt(req.params.chapter)] == 'undefined') return renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')

                    if (typeof editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)] == 'undefined') {
                        return renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
                    } else {
                        editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)].data = req.body.documentArray
                    }

                    editorSave.markModified('data')
                    editorSave.lastActive = Date.now()
                    await editorSave.save()
                    res.status(200).end()
                } else {
                    renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
                }
            }
        } catch (err) {
            console.log(err.stack)
            renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
        }
    })

    // > SAVE (GET)
    // Responds with the save files from a user
    app.get('/api/v1/save/editor/:course/:chapter/:lesson', auth.isAuth, async (req, res) => {
        try {
            let user = null
            let editorSave = null
            if (req.session.passport) {
                user = await dbUtil.users.getUserByUserID(req.session.passport.user)
                if (user != null) {
                    editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)

                    if (editorSave == null) {
                        return res.status(204).end()
                    }
                    if (typeof editorSave.data[Number.parseInt(req.params.chapter)] == 'undefined')
                        return res.status(204).end()

                    if (typeof editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)] == 'undefined') {
                        return res.status(204).end()
                    } else {
                        return res.status(200).json({ documentArray: editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)].data })
                    }
                } else {
                    renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
                }
            }
        } catch (err) {
            console.log(err.stack)
            renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
        }
    })

    // > COMPLETE
    // Sets the completion status of a user's lesson save
    app.post('/api/v1/complete/:course/:chapter/:lesson', auth.isAuth, async (req, res) => {
        try {
            let user = null
            let editorSave = null
            if (typeof req.session.passport != 'undefined' && req.session.passport !== null) {
                user = await dbUtil.users.getUserByUserID(req.session.passport.user)
                if (user != null) {
                    editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)

                    if (editorSave == null) {
                        return res.status(403).end()
                    }
                    if (typeof editorSave.data[Number.parseInt(req.params.chapter)] == 'undefined')
                        return res.status(403).end()

                    if (typeof editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)] == 'undefined') {
                        return res.status(403).end()
                    } else {
                        editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)].completed = true
                        editorSave.markModified('data')
                        await editorSave.save()
                        return res.status(200).end()
                    }
                } else {
                    renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
                }
            }
        } catch (err) {
            console.log(err.stack)
            renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
        }
    })

    /* ------------------------------------------- Editor ------------------------------------------- */
    app.get('/editor/:course/:chapter/:lesson', async (req, res) => {
        if (await validateLessonPath(req.params.course, req.params.chapter, req.params.lesson)) { // Makes sure the lesson is valid
            let user = null
            let editorSave = null
            let savedDocuments = null
            if (typeof req.session.passport != 'undefined' && req.session.passport !== null) {
                user = await dbUtil.users.getUserByUserID(req.session.passport.user)
                if (user != null) {
                    editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)

                    if (editorSave == null) {
                        let saveData = []
                        let courseInfo = await readIXConfig(`../static/curriculum/curriculum-${req.params.course}/.ideoxan`)

                        for (let i = 0; i < courseInfo.chapters.length; i++) {
                            saveData[i] = []
                            for (let j = 0; j < courseInfo.chapters[i].lessons.length; j++) {
                                saveData[i][j] = {
                                    completed: false,
                                    data: []
                                }
                            }
                        }

                        await EditorSave.create({ userid: user.userid, course: req.params.course, data: saveData })
                        editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)
                    }
                    savedDocuments = editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)].data
                }
            }

            res.render('editor', {
                course: req.params.course,
                chapter: req.params.chapter,
                lesson: req.params.lesson,
                meta: Buffer.from(JSON.stringify(await readIXConfig(`../static/curriculum/curriculum-${req.params.course}/.ideoxan`))).toString('base64'),
                saves: savedDocuments || null,
                auth: req.isAuthenticated()
            })
        } else {
            renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
        }
    })

    app.get('/ping', async (req, res) => {                          // Server ping (check alive in editor)
        res.status(200)                                             // Can be used for other things ig but idc lol
        res.end('All Good :)')
    })

    app.post('/githook', async (req, res) => {
        // TODO: Listen for only production branch when NODE_ENV is set to "production"
        if (req.header('X-Hub-Signature') !== 'sha1=' + process.env.GITHUB_WEBHOOK_SIG) return res.status(404).end()

        res.status(200).end()
        exec('git submodule update --remote --init --recursive', (err, out, outerr) => {
            if (out.toString().length < 1) {
                console.log(`Courses Submodules already up to date`)
            } else {
                console.log(`Updated Courses Submodules from GitHub ${(outerr) ? 'Error' + outerr : ''}`)
            }
            exec('git pull', (err, out, outerr) => {
                if (out.toString().startsWith('Already up to date')) {
                    console.log(`Server already up to date`)
                } else {
                    console.log(`Updated Server from GitHub ${(outerr) ? 'Error' + outerr : ''}`)
                }
            })
        })

    })

    app.use(async (req, res) => {                             // If there are no more routes to follow then
        renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
    })

    app.use(async (err, req, res) => {                        // If there is a server side error thrown then
        console.error(err.stack)                                    // Log the error and send the response
        renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
    })



    /* ---------------------------------------------------------------------------------------------- */
    /*                                             METHODS                                            */
    /* ---------------------------------------------------------------------------------------------- */

    /**
     * Reads a .ideoxan configuration file in a course directory and returns a JSON object
     * 
     * @param {String} path A valid path to a course directory
     * @returns {Promise<JSON>} A JSON object of course metadata/configuration
     */
    async function readIXConfig(path) {
        try {
            let data = await fs.promises.readFile(require.resolve(path))
            return (data) ? JSON.parse(data) : null
        } catch (err) {
            return null
        }
    }

    /**
     * Checks to see if a valid course/lesson path configuration was given
     * 
     * @param {String} course The name of the course
     * @param {String} [chapter=] The chapter number (given in 3 place format)
     * @param {String} [lesson=] The lesson number (given in 3 place format)
     * @returns {Promise<Boolean>}
     */
    async function validateLessonPath(course, chapter, lesson) {
        try {
            (typeof lesson == 'undefined') ? await fs.promises.access(`./static/curriculum/curriculum-${course}`, fs.constants.R_OK) : await fs.promises.access(`./static/curriculum/curriculum-${course}/content/chapter-${chapter}/${lesson}`, fs.constants.R_OK)
            return true
        } catch (err) {
            return false
        }
    }

    /**
     * Renders a page found in the specified views directory based on what was requested
     * @param {Request} req - A HTTP request
     * @param {Response} res - A HTTP response
     */
    async function renderPage(req, res) {
        if (typeof req.session.passport != 'undefined' && req.session.passport !== null) {
            let user = await dbUtil.users.getUserByUserID(req.session.passport.user)
            res.render(req.path.substring(1), { auth: true, displayName: user.displayName, courses: await getAvailableCourses() })
        } else {
            res.render(req.path.substring(1), { auth: false, courses: await getAvailableCourses() })
        }
    }

    /**
     * Renders a page found in the specified views directory based on specified page.
     * @param {Request} req - A HTTP request
     * @param {Response} res - A HTTP response
     * @param {String} page - The name of a template page to render (independent from request)
     * @param {Object} data - Custom JSON data to feed to the rendering engine 
     */
    async function renderCustomPage(req, res, page, data = {}) {
        try {
            if (typeof req.session != 'undefined' && typeof req.session.passport != 'undefined' && req.session.passport !== null) {
                let user = await dbUtil.users.getUserByUserID(req.session.passport.user)
                data.auth = user !== null
                if (data.auth) data.displayName = user.displayName
            } else {
                data.auth = false
            }
            data.courses = await getAvailableCourses()
            return res.render(page, data)
        } catch (err) {
            console.error(err.stack)
            renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
        }

    }

    async function getAvailableCourses() {
        let courses = []
        let avail = await fs.promises.readdir('./static/curriculum')
        for (let course in avail) {
            if (avail[course] != 'courses.json') courses.push(await readIXConfig(`../static/curriculum/${avail[course]}/.ideoxan`))
        }
        return courses
    }

    async function renderErrorPage(req, res, errNum, code, message, jsonMessage = null) {
        if (!jsonMessage) jsonMessage = message // Can someone remove this line?
        res.status(errNum)
        if (req.accepts('html')) {
            res.render('error', { errNum: errNum, message: message, code: code })
        } else if (req.accepts('json')) {
            res.json({ error: errNum, code: code, message: jsonMessage })
        } else {
            res.send(jsonMessage)
        }
    }

    function coloredResponse(statusCode) {
        if (typeof statusCode == 'undefined') return c.grey.bold('INCOMP')
        else if (statusCode.toString().startsWith('5')) return c.redBright.bold(statusCode)
        else if (statusCode.toString().startsWith('4')) return c.yellow.bold(statusCode)
        else return c.green.bold(statusCode)
    }
}