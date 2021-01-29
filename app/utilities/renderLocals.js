module.exports = (data={}) => {
    data.server = {
        name: serverConfig.name,
        logo: serverConfig.logo,
        env: {
            node_env: process.env.NODE_ENV
        }
    }
    data.user = {
        auth: false,
        email: 'email@example.com',
        username: 'sample_user',
        displayName: 'Sample User',
        pictureURL: 'https://example.com/images/abc123'
    }
    return data
}