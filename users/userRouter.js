const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("./user-model.js")
const uMid = require("./userMiddleware.js")
const router = express.Router()

router.post("/register", uMid.validateUser, (req, res) => {
    const credentials = req.body
    const hash = bcrypt.hashSync(credentials.password, 14)

    credentials.password = hash

    Users.insert(credentials)
    .then( id => {
        res.status(201).json({id: id[0], ...credentials})
    })
    .catch( err => {
        res.status(500).json({
            errorMessage: "Failed to register."
        })
    })
})

router.post("/login", uMid.validateUser, uMid.validateCredentials, (req, res) => {
    req.session.userId = req.body.userId
    res.status(200).json({
        message: "Logged in"
    })
})

router.get("/auth/users", uMid.restricted, (req, res) => {
    Users.find()
    .then( users => {
        res.status(200).json(users)
    })
    .catch( err => {
        res.status(500).json({
            errorMessage: "Failed to get users."
        })
    })
})

module.exports = router