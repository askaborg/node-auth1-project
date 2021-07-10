 
const Users = require("./user-model.js")
const bcrypt = require("bcryptjs")

module.exports = {
    validateCredentials,
    validateUser,
    restricted
}

function validateUser(req, res, next) {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({
            message: "Use a username and a password"
        })
    } else {
        next()
    }
}

function validateCredentials(req, res, next) {
    const credentials = req.body

    Users.findBy(credentials.username)
    .then( user => {
        if (!user ||
            !bcrypt.compareSync(credentials.password, user.password)
        ) {
            return res.status(401).json({
                error: "You shall not pass!"
            })
        } else {
            req.body.userId = user.id
            next()
        }
    })
    .catch( err => {
        res.status(500).json({
            errorMessage: "Unkown user."
        })
    })
}

function restricted(req, res, next) {
    if (req.session && req.session.userId) {
        next()
    } else {
        res.status(401).json({
            message: "you shall not pass!" 
        })
    }
}