const c = require('chalk')                                      // Terminal coloring

// Load local .env config if not prod
process.env.NODE_ENV != 'production'? require('dotenv').config():{}

// Config
try {
    global.cfg = require('./config.json')
} catch(error) {
    global.cfg = require('./config.default.json')
}

const port = process.env.PORT || cfg.server.port || 3080
const ip = cfg.server.ip || 'localhost'

const app = require('./src/apps/main').app                      // Creates Ideoxan Server

app.listen(port, ()=> {      // Listens on environment set port
    console.log(`\n\n`)
    console.log(`${c.greenBright('⦿')}  ${c.bold.italic(cfg.server.name + ' Main Server')}`)
    if (process.env.NODE_ENV != 'production')
        console.log(c.magentaBright.italic(`\t(DEV) Now you can visit the website in testing mode at http://${ip}:${port}/`))
    console.log(`\tStatus: ${c.greenBright('online')}`)
    console.log(`\tNetwork:`)
    console.log(`\t\tIP: ${c.keyword('orange')(ip)}`)
    console.log(`\t\tPort: ${c.keyword('orange')(port)}`)
    console.log(`\tPID: ${process.pid}`)
    console.log(`\tLoaded Apps:`)
    cfg.server.apps.forEach(_app => {
        console.log(`\t\t${_app}: ${c.bgGreen(' ✔ OK ')}`) // TODO: use request module to "ping" server
    })
    console.log(`\tLogs:`)
}) 
