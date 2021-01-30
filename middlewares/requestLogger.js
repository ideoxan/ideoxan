const morgan = require('morgan')
const c = require('chalk')
const httpCodeColorizer = require(serverConfig.paths.utilities + '/httpCodeColorizer.js')

module.exports = morgan((tokens, req, res) => {
    const timestamp = c.grey(tokens['date'](req, res, 'iso'))       // Timestamp (ex. 1999-01-30T23:59:00Z)
    const scope = c.bold('SERVER')                                  // Scope of request (ex. Server)
    const method = tokens['method'](req, res)                       // HTTP Method Used (ex. GET, POST)
    const status = httpCodeColorizer(tokens['status'](req, res))    // Status of Request (ex. 200, 404, 500)
    const timing = tokens['response-time'](req, res) + 'ms'         // Response time (ex. 20ms)
    const destination = tokens['url'](req, res)                     // Resource requested (ex. /index.html)

    return `[${timestamp}] [${scope}] ${status} ${method} ${destination} (${timing})`   // Formatted output
})