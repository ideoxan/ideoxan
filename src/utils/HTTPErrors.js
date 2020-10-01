
class HTTPError {
    constructor (status = '500', error = 'Internal Server Error', message = 'Looks like something broke on our side') {
        this.status = status
        this.error = error
        this.message = message
    }
}

class HTTPError401 extends HTTPError {
    constructor () {
        super("401", "Unauthorized", "You are restricted from viewing this content. Try signing in/out.")
    }
}

class HTTPError403 extends HTTPError {
    constructor () {
        super("403", "Forbidden", "You are restricted from viewing this content")
    }
}

class HTTPError404 extends HTTPError {
    constructor () {
        super("404", "Not Found", "Seems like this page doesn't exist.")
    }
}

class HTTPError500 extends HTTPError {
    constructor () {
        super("500", "Internal Server Error", "Looks like something broke on our side")
    }
}

class HTTPErrorPage {
    constructor (req, res, errorType = '500', options = {}) {
        this.req = req
        this.res = res

        this.errorType = new this.constants.errorTypes[errorType]

        this.options = options
    }

    get constants() {
        return {
            errorTypes: {
                '401':HTTPError401,
                '403':HTTPError403,
                '404':HTTPError404,
                '500':HTTPError500
            }
        }
    }

    renderPage() {
        this.res.status(this.errorType.status)
        if (this.req.accepts('html')) {
            if (this.options.redirect) {
                return this.res.redirect(this.options.redirect)
            }
            return this.res.render('error', { errNum: this.errorType.status, message: this.errorType.message, code: this.errorType.error })
        } else if (this.req.accepts('json')) {
            res.json({ status: this.errorType.status, error: this.errorType.error, message: this.errorType.message })
        } else return this.res.send(this.errorType.status + ' ' + this.errorType.error)
    }
}

module.exports = {
    HTTPErrorPage
}