/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const dbUtil = require('../../utils/dbUtil')                        // Database Util Module
/* -------------------------------------------- Util -------------------------------------------- */
const { renderCustomPage } = require('../../utils/pages')
const { getAvailableCourses } = require('../../utils/courses')
const { HTTPErrorPage } = require("../../utils/HTTPErrors")

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {           // Renders User Page
    try {
        let user = await dbUtil.users.getUserByUserID(req.session.passport.user) || null
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
            renderCustomPage(req, res, 'dashboard', { reqUserDisplayName: user.displayName, reqUserRoles: user.roles, reqUserCreated: user.created, completed: completed, inProgress: inProgress, requestedSection: req.params.section })
        } else {
            let responseError = new HTTPErrorPage(req, res, '401')
            return responseError.renderPage()
        }
    } catch (err) {
        console.log(err.stack)
        let responseError = new HTTPErrorPage(req, res, '500')
        return responseError.renderPage()
    }
} 