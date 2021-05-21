const renderLocals = require(serverConfig.paths.utilities + '/renderLocals')


module.exports = function (page=null, data={}) {
    return async function (req, res, next) {
        try {
            data = await renderLocals(req, res, data)
            if (!page) page = req.path.split('/')[req.path.split('/').length-1]
            res.render(page, data)
        } catch (err) {
            next(err)
        }
    }
}
