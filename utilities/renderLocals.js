const Users = require( "../src/models/Users" )

module.exports = async (req, res, data={}) => {

    data.server = {
        name: serverConfig.name,
        logo: serverConfig.logo,
        env: {
            node_env: process.env.NODE_ENV
        }
    }

    if (req.isAuthenticated()) {
        let user = await Users.findOne({uid: req.session.passport.user})
        data.user = {
            auth: true,
            email: user.email,
            username: user.username,
            displayName: user.name,
            pictureURL: null
        }
    } else {
        data.user = {
            auth: false,
            email: null,
            username: null,
            displayName: null,
            pictureURL: null
        }
    }
    
    return data
}