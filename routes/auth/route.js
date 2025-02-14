const express = require('express')
const controller = require('./controller')
const authMiddleware = require('../../middleware/AuthMiddleware');

const routes = express.Router()

routes.post("/login", controller.userLogin)

routes.post("/register", controller.userRegister)

module.exports = routes;
