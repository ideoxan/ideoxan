/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const dbUtil = require('../../utils/dbUtil')                        // Database Util Module
/* -------------------------------------------- Util -------------------------------------------- */
const {renderCustomPage, renderErrorPage} = require('../../utils/pages')
const { getAvailableCourses } = require('../../utils/courses')

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {           // Renders User Page
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
}