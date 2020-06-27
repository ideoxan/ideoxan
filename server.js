/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */

/* ------------------------------------------- Express ------------------------------------------ */
const express = require('express')
const compression = require('compression')
const helmet = require('helmet')

/* ------------------------------------------- General ------------------------------------------ */
const path = require('path')
const fs = require('fs')

/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATIONS                                        */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Express ------------------------------------------ */
const app = express()
app.set('view engine', 'ejs')
app.use('/static', express.static('static')) // CSS, JS, HTML (NOT EJS), images, etc.
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(compression())

/* ---------------------------------------------------------------------------------------------- */
/*                                            CONSTANTS                                           */
/* ---------------------------------------------------------------------------------------------- */
const port = 3080

/* ---------------------------------------------------------------------------------------------- */
/*                                             SERVER                                             */
/* ---------------------------------------------------------------------------------------------- */
app.get('/', async (req, res) => {
    res.render('index')
})

app.get('/index*', async (req, res) => {
    res.render('index')
})

app.get('/editor/:course/:lesson', async (req, res) => {
    if (await validateLessonPath(req.params.course, req.params.lesson)) {
        res.render('editor', {
            ServerAppData: { //here for a reason just leave it alone :^)
                ideoxan: {
                    lessonData: {
                        course: req.params.course,
                        lesson: req.params.lesson,
                        meta: JSON.stringify(await readIXConfig(`./static/curriculum/curriculum-${req.params.course}/.ideoxan`))
                    }
                }
            }
        })
    } else {
        if (req.accepts('html')) {
            res.render('error', {errNum: 404, message: 'Seems like this page doesn\'t exist.', code: 'ERR_PAGE_NOT_FOUND'})
        } else if (req.accepts('json')) {
            res.json({error: 404, code: 'ERR_PAGE_NOT_FOUND', message: 'Not Found'})
        } else {
            res.send('Not Found')
        }
    }
})

app.get('/ping', async (req, res) => {
    res.status(200)
    res.end('All Good :)')
})


app.use(async (req, res, next) => {
    if (req.accepts('html')) {
        res.render('error', {errNum: 404, message: 'Seems like this page doesn\'t exist.', code: 'ERR_PAGE_NOT_FOUND'})
    } else if (req.accepts('json')) {
        res.json({error: 404, code: 'ERR_PAGE_NOT_FOUND', message: 'Not Found'})
    } else {
        res.send('Not Found')
    }
})

app.use(async (err, req, res, next) => {
    console.error(err.stack)
    if (req.accepts('html')) {
        res.render('error', {errNum: 404, message: 'Seems like this page doesn\'t exist.', code: 'ERR_PAGE_NOT_FOUND'})
    } else if (req.accepts('json')) {
        res.json({error: 404, code: 'ERR_INTERNAL_SERVER', message: 'Internal Server Error'})
    } else {
        res.send('Internal Server Error')
    }
    res.status(500).render('error', {errNum: 500, message: 'Looks like something broke on our side', code: 'ERR_INTERNAL_SERVER'})
})


app.listen(process.env.PORT || port)


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
        return (data)? JSON.parse(data) : null
    } catch (err) {
        return null
    }
}

/**
 * Checks to see if a valid course/lesson path configuration was given
 * 
 * @param {String} course The name of the course
 * @param {String} [lesson=] The lesson number (given in 3 place format)
 * @returns {Promise<Boolean>}
 */
async function validateLessonPath(course, lesson) {
    try {
        (typeof lesson == 'undefined')? await fs.promises.access(`./static/curriculum/curriculum-${course}`, fs.constants.R_OK) : await fs.promises.access(`./static/curriculum/curriculum-${course}/content/${lesson}`, fs.constants.R_OK)
        return true
    } catch (err) {
        return false
    }
}