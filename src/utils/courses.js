/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- General ------------------------------------------ */
const fs = require('fs')                                        // File System interface

/* ---------------------------------------------------------------------------------------------- */
/*                                             EXPORTS                                            */
/* ---------------------------------------------------------------------------------------------- */
module.exports = {
    /**
     * Reads a .ideoxan configuration file in a course directory and returns a JSON object
     * 
     * @param {String} course The name of the course
     * @returns {Promise<JSON>} A JSON object of course metadata/configuration
     */
    readIXMeta: async (course) => {
        try {
            let data = await fs.promises.readFile(`./static/curriculum/curriculum-${course}/.ideoxan`)
            return (data) ? JSON.parse(data) : null
        } catch (err) {
            return null
        }
    },

    /**
     * Reads a Lesson Meta file in a lesson directory and returns a JSON object
     * 
     * @param {String} course The name of the course
     * @param {String} [chapter=] The chapter number (given in 3 place format)
     * @param {String} [lesson=] The lesson number (given in 3 place format)
     * @returns {Promise<JSON>} A JSON object of course metadata/configuration
     */
    readLessonConfig: async (course, chapter, lesson) => {
        try {
            let data = await fs.promises.readFile(`./static/curriculum/curriculum-${course}/chapter-${chapter}/${lesson}/${lesson}.json`)
            return (data) ? JSON.parse(data) : null
        } catch (err) {
            return null
        }
    },

    /**
     * Checks to see if a valid course/lesson path configuration was given
     * 
     * @param {String} course The name of the course
     * @param {String} [chapter=] The chapter number (given in 3 place format)
     * @param {String} [lesson=] The lesson number (given in 3 place format)
     * @returns {Promise<Boolean>}
     */
    validateLessonPath: async (course, chapter, lesson) => {
        try {
            (typeof lesson == 'undefined') ? await fs.promises.access(`./static/curriculum/curriculum-${course}`, fs.constants.R_OK) : await fs.promises.access(`./static/curriculum/curriculum-${course}/chapter-${chapter}/${lesson}`, fs.constants.R_OK)
            return true
        } catch (err) {
            return false
        }
    },

    /**
     * Returns all available Ideoxan Courses in the curriculum directory
     * 
     * @returns {Promise<JSON>}
     */
    getAvailableCourses: async () => {
        let avail = await fs.promises.readdir('./static/curriculum')
        let courses = []
        for (let course in avail) {
            if (avail[course] != 'courses.json') courses.push(await module.exports.readIXMeta(avail[course].substring('curriculum-'.length)))
        }
        return courses
    }
}