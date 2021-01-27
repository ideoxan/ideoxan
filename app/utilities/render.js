const HTTPError = require(serverConfig.paths.utilities + '/HTTPError')
const renderLocals = require(serverConfig.paths.utilities + '/renderLocals')


render = async (req, res, page=null, data={}) => {
    try {
        renderLocals()
        if (!page) page = req.path.split('/')[req.path.split('/').length-1]
        res.render(page, data).catch(err => new Error(err))
    } catch (err) {
        let responseError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES[500])
        responseError.render()
        console.error(err.stack)
    }
}

module.exports = render