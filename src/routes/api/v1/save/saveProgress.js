/* ---------------------------------------------------------------------------------------------- */
/*                                              SPEC                                              */
/* ---------------------------------------------------------------------------------------------- */
// EDITOR
// > SAVE (POST)
// Saves the given data to the database from the editor

// > SAVE (GET)
// Responds with the save files from a user

/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const dbUtil = require('../../../../utils/dbUtil')              // Database Util Module
const EditorSave = require('../../../../models/EditorSave')     // Schema: Editor Saves

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = {
    GET: async (req, res) => {
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
    },
    POST: async (req, res) => {
        try {
            let user = null
            let editorSave = null
            if (typeof req.session.passport != 'undefined' && req.session.passport !== null) {
                user = await dbUtil.users.getUserByUserID(req.session.passport.user)
                if (user != null) {
                    editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)
    
                    if (editorSave == null) {
                        let saveData = []
                        let courseInfo = await readIXMeta(req.params.course)
    
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
    }
}