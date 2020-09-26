/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- General ------------------------------------------ */
const PDFDocument = require('pdfkit')                           // PDF generation
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const dbUtil = require('../../utils/dbUtil')                        // Database Util Module
/* -------------------------------------------- Util -------------------------------------------- */
const {renderCustomPage, renderErrorPage} = require('../../utils/pages')

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {
    try {
        let user = null
        let editorSave = null
        if (typeof req.session.passport != 'undefined' && req.session.passport !== null) {
            user = await dbUtil.users.getUserByUserID(req.session.passport.user)
            if (user != null) {
                editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)

                if (editorSave == null) {
                    return renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
                } else {
                    let totalLessons = 0;
                    let completedLessons = 0;
                    for (let j = 0; j < editorSave.data.length; j++) {
                        for (let k = 0; k < editorSave.data[j].length; k++) {
                            if (editorSave.data[j][k].completed) completedLessons++
                            totalLessons++
                        }
                    }

                    if (totalLessons == completedLessons) {
                        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                        let date = new Date()
                        let certDate = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()

                        const certDoc = new PDFDocument({
                            size: [1632, 1056],
                            margins: {
                                top: 0, right: 0, bottom: 0, left: 0
                            }
                        })
                        const w = certDoc.page.width
                        const h = certDoc.page.height
                        let s = ''

                        let buf = []
                        certDoc.on('data', buf.push.bind(buf))
                        certDoc.on('end', () => {
                            let certDocData = Buffer.concat(buf).toString('base64')

                            return renderCustomPage(req, res, 'completed', { course: req.params.course, certificateDoc: certDocData })
                        })

                        certDoc.image('./www/static/img/certificate_background.png', {
                            align: 'center',
                            valign: 'center'
                        })
                        certDoc
                            .registerFont('Metropolis Bold', './www/static/fonts/Metropolis-Bold.otf')
                            .registerFont('Metropolis', './www/static/fonts/Metropolis-Regular.otf')

                        s = 'Certificate of Completion'
                        certDoc
                            .font('./www/static/fonts/FrenchScriptMT-Regular.ttf')
                            .fontSize(82)
                            .fillColor('#804dde')
                            .text(s, (w / 2) - (certDoc.widthOfString(s) / 2), (h * 0.15) - (certDoc.heightOfString(s) / 2), { align: 'left' })

                        s = 'THIS IS TO CERTIFY THAT'
                        certDoc
                            .font('Metropolis Bold')
                            .fontSize(12)
                            .fillColor('#121212')
                            .text(s, (w / 2) - (certDoc.widthOfString(s) / 2), (h * 0.25) - (certDoc.heightOfString(s) / 2), { align: 'left' })

                        s = user.displayName.replace(/\b\w+/g, (s) => { return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase() })
                        certDoc
                            .font('Metropolis Bold')
                            .fontSize(48)
                            .fillColor('#121212')
                            .text(s, (w / 2) - (certDoc.widthOfString(s) / 2), (h * 0.325) - (certDoc.heightOfString(s) / 2), { align: 'left' })

                        s = 'HAS SUCCESSFULLY COMPLETED THE COURSE'
                        certDoc
                            .font('Metropolis Bold')
                            .fontSize(12)
                            .fillColor('#121212')
                            .text(s, (w / 2) - (certDoc.widthOfString(s) / 2), (h * 0.4) - (certDoc.heightOfString(s) / 2), { align: 'left' })

                        s = req.params.course.replace(/\b\w+/g, (s) => { return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase() })
                        certDoc
                            .font('Metropolis Bold')
                            .fontSize(48)
                            .fillColor('#121212')
                            .text(s, (w / 2) - (certDoc.widthOfString(s) / 2), (h * 0.475) - (certDoc.heightOfString(s) / 2), { align: 'left' })

                        s = 'ON THIS DAY OF ' + certDate.toUpperCase()
                        certDoc
                            .font('Metropolis Bold')
                            .fontSize(12)
                            .fillColor('#121212')
                            .text(s, (w / 2) - (certDoc.widthOfString(s) / 2), (h * 0.55) - (certDoc.heightOfString(s) / 2), { align: 'left' })

                        certDoc
                            .image('./www/static/img/certificate_signature.png', (w / 2) - (207 / 2), h * 0.75, {
                                align: 'center'
                            })

                        certDoc
                            .lineCap('square')
                            .lineWidth(1)
                            .moveTo((w / 2) - 207, h * 0.8)
                            .lineTo((w / 2) + 207, h * 0.8)
                            .stroke('#121212')

                        s = 'BRYCE DALY (SKYCLO)'
                        certDoc
                            .font('Metropolis')
                            .fontSize(12)
                            .fillColor('#121212')
                            .text(s, (w / 2) - (certDoc.widthOfString(s) / 2), (h * 0.825) - (certDoc.heightOfString(s) / 2), { align: 'left' })
                        s = 'Founder, Lead Developer'
                        certDoc
                            .font('Metropolis')
                            .fontSize(12)
                            .fillColor('#121212')
                            .text(s, (w / 2) - (certDoc.widthOfString(s) / 2), (h * 0.85) - (certDoc.heightOfString(s) / 2), { align: 'left' })

                        certDoc
                            .opacity(0.75)
                            .image('./www/static/img/certificate_ix_horiz.png', (w * 0.175) - (230 / 4), h * 0.8, {
                                align: 'center',
                                scale: 0.5
                            })

                        certDoc.end()

                    } else {
                        return renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
                    }
                }
            } else {
                return renderErrorPage(req, res, 401, 'ERR_UNAUTH', 'Looks like you can\'t access that page... try signing in.', 'Unauthorized')
            }
        } else {
            return renderErrorPage(req, res, 401, 'ERR_UNAUTH', 'Looks like you can\'t access that page... try signing in.', 'Unauthorized')
        }
    } catch (err) {
        console.log(err.stack)
        renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
    }
}