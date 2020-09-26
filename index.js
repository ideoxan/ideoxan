// Load local .env config if not prod
process.env.NODE_ENV != 'production'? require('dotenv').config():{}

// Config
global.cfg = require('./cfg.json')

const app = require('./src/apps/main').app                      // Creates Ideoxan Server

app.listen(cfg.server.port||3080, ()=> {                        // Listens on environment set port
    console.log(`${cfg.server.name} Server Online`)
}) 
