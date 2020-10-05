// Load local .env config if not prod
process.env.NODE_ENV != 'production'? require('dotenv').config():{}

// Config
try {
    global.cfg = require('./config.json')
} catch(error) {
    global.cfg = require('./config.default.json')
}

const app = require('./src/apps/main').app                      // Creates Ideoxan Server

app.listen(cfg.server.port||3080, ()=> {                        // Listens on environment set port
    console.log(`${cfg.server.name} Server Online`)
}) 
