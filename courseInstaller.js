const dotenv = require('dotenv')
const exec = require('child_process').exec
const path = require('path')

if (process.env.NODE_ENV != 'production') dotenv.config()

let coursesConfig = require(process.env.IDEOXAN_COURSESCONFIG_PATH || './static/curriculum/courses.json')

process.chdir('./static/curriculum/')

coursesConfig.forEach(async course => {
    exec(`git clone https://github.com/ideoxan/curriculum-${course}`, (err, out, outerr) => {
        if (outerr.includes('fatal')) {
            process.chdir('./curriculum-' + course)
            exec(`git pull`, (err, out, outerr) => {
                if (outerr.includes('fatal')) console.log(`Failed to download ${course}\n${outerr}`); else console.log(`Updated ${course}`)
            })
            process.chdir('../')
        } else {
            console.log(`Downloaded ${course}`)
        }
    })
})