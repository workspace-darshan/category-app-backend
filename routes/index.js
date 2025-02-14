var express = require("express");
const routes = express.Router();

const tempRoute = require("./tempRoute");
routes.use('/', tempRoute.route);

const auth = require("./auth");
routes.use('/auth', auth.route);

const category = require("./category");
routes.use('/category', category.route);

module.exports = routes;
