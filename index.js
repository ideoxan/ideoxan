// Load local .env config if not prod
process.env.NODE_ENV != 'production'? require('dotenv').config():{}

const c = require('chalk')                                      // Terminal coloring

// Config
try {
    global.cfg = require('./config.json')
} catch(error) {
    global.cfg = require('./config.default.json')
}

const app = require('./src/apps/main').app                      // Creates Ideoxan Server

app.listen(cfg.server.port||3080, ()=> {                        // Listens on environment set port
    console.log(`\n\n`)
    console.log(`${c.greenBright('⦿')}  ${c.bold.italic(cfg.server.name + ' Main Server')}`)
    if (process.env.NODE_ENV != 'production')
        console.log(c.magentaBright.italic(`\t(DEV) Now you can visit the website in testing mode at http://${cfg.server.ip||'localhost'}:${cfg.server.port||3080}/`))
    console.log(`\tStatus: ${c.greenBright('online')}`)
    console.log(`\tNetwork:`)
    console.log(`\t\tIP: ${c.keyword('orange')(cfg.server.ip||'localhost')}`)
    console.log(`\t\tPort: ${c.keyword('orange')(cfg.server.port||3080)}`)
    console.log(`\tPID: ${process.pid}`)
    console.log(`\tLoaded Apps:`)
    cfg.server.apps.forEach(_app => {
        console.log(`\t\t${_app}: ${c.bgGreenBright(' ✔ OK ')}`)
    })
    console.log(`\tLogs:`)
}) 
