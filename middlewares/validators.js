const { check }                 = require('express-validator')

module.exports = {
    email: (fieldName) => {
        return check(fieldName).isEmail().normalizeEmail({gmail_remove_dots: false})
    },
    username: (fieldName) => {
        // Used regex instead of isAlphanumeric() because of "-" and "_" characters
        return check(fieldName).notEmpty().matches(/^[a-z0-9_\-]+$/i).isLength({min: 3, max: 36})
    },
    displayName: (fieldName) => {
        return check(fieldName).notEmpty().isString().isLength({min: 2, max: 256})
    },
    password: (fieldName) => {
        return check(fieldName).isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false
        })
    },
    uid: (fieldName) => {
        return check(fieldName).isUUID(4)
    },
    verificationCode: (fieldName) => {
        return check(fieldName).isNumeric({no_symbols: true}).isLength({min:6, max: 6})
    },
    bio: (fieldName) => {
        return check(fieldName).notEmpty().isString().isLength({min: 1, max: 1024}).isAscii()
    },
    connections: {
        ghProfile: (fieldName) => {
            return check(fieldName).notEmpty().isURL().isLength({min: 12, max: 256})
        }
    },
    public: (fieldName) => {
        return check(fieldName).if((value, {req}) => {
            return value == 'on' || typeof value == 'undefined'
        })
    }
}
