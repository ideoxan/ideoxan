// Load local .env config if not prod
if (process.env.NODE_ENV != 'production') require('dotenv').config()

const app = require('./src/app').app    // Creates Ideoxan Server

app.listen(process.env.PORT||3080,  // Listens on environment set port
    ()=>console.log('Ideoxan Server Online')) 
