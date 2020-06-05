const express = require("express")
const UserRouter = require("./users/userRouter.js")
const session = require("express-session")

const server = express()
server.use(express.json())

server.use(
  session({
    name: "notsession",
    secret: "no secret cookies allowed",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false,
    },
    httpOnly: true,
    saveUninitialized: false,
  })
)

server.use("/api", UserRouter)

module.exports = server