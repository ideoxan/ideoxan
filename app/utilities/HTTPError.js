class _HTTPErrorCode {
    constructor (status, error, message) {
        this.status = status
        this.error = error
        this.message = message
    }
}

class HTTPError {
    constructor(req, res, http_code) {
        this.req = req
        this.res = res

        this.http_code = http_code
    }

    render() {
        this.res.status(this.http_code.status)

        if (this.req.accepts('json')) return this.res.json({
            status: this.http_code.status,
            error: this.http_code.error,
            message: this.http_code.message
        })

        if (this.req.accepts('html')) {
            try {
                data = renderLocals({http_code: this.http_code})
                res.render('error', data)
            } catch (err) {
                res.send('500: Internal Server Error')
                console.error(err.stack)
            }
        }

        return this.res.send(this.http_code.status + ' ' + this.http_code.error)
    }
}

HTTPError.constants = {
    HTTP_ERROR_CODES: {
        // 400
        '400': new _HTTPErrorCode(400, 'Bad Request', 'The request could not be processed because of invalid syntax'),
        '401': new _HTTPErrorCode(401, 'Unauthorized', 'You are not allowed to view this content. Try signing in or out'),
        '403': new _HTTPErrorCode(403, 'Forbidden', 'You are not allowed to view this content.'),
        '404': new _HTTPErrorCode(404, 'Not Found', 'What you requested could not be found'),
        '405': new _HTTPErrorCode(405, 'Method Not Allowed', 'This method is recognized but not supported'),
        '406': new _HTTPErrorCode(406, 'Not Acceptable', 'Content types could not be negotiated'),
        '408': new _HTTPErrorCode(408, 'Request Timeout', ''),
        '409': new _HTTPErrorCode(409, 'Conflict', 'The requested resource conflicts with the current state of the server. Try again later.'),
        '411': new _HTTPErrorCode(411, 'Length Required','The Content-Length property is invalid or malformed'),
        '413': new _HTTPErrorCode(413, 'Payload Too Large', 'The request is too large in size to be processed'),
        '415': new _HTTPErrorCode(415, 'Unsupported Media Type', 'This format is not supported by the server'),
        '418': new _HTTPErrorCode(418, 'I\'m a teapot', 'Get brew\'d'),
        '422': new _HTTPErrorCode(422, 'Unprocessable Entity', 'The syntax of the request is valid but can not be processed due to schematic errors in the content'),
        '423': new _HTTPErrorCode(423, 'Locked', 'You are not allowed to view this content because it has been locked'),
        '426': new _HTTPErrorCode(426, 'Upgrade Required', 'The protocol must be changed'),
        '429': new _HTTPErrorCode(429, 'Too Many Requests', 'Slow down buddy :)'),
        '451': new _HTTPErrorCode(451, 'Unavailable Due To Legal Reasons', 'This resource has been permanently removed from the server as a result of legal action.'),

        // 500
        '500': new _HTTPErrorCode(500, 'Internal Server Error', 'The server has encountered and exception and is unable to proceed any further'),
        '503': new _HTTPErrorCode(503, 'Service Unavailable', 'The server is unable to handle the request. Try again later.')
    }
}

module.exports = HTTPError