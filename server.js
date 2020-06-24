/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
const express = require('express')
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

app.get('/editor/:course/:lesson', async (req, res) => {
    res.render('index', {
        ServerAppData: { //here for a reason just leave it alone :^)
            ideoxan: {
                lessonData: {
                    course: req.params.course,
                    lesson: req.params.lesson,
                    meta: JSON.stringify(await readIXConfig(`../cur/curriculum-${req.params.course}/.ideoxan`))
                }
            }
        }
    })
})

app.get('/ping', async (req, res) => {
    res.status(200)
    res.end('All Good :)')
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
    let data = await fs.promises.readFile(require.resolve(path))
    return (data)? JSON.parse(data) : null
}