const express = require('express')
const controller = require('./controller')
const authMiddleware = require('../../middleware/AuthMiddleware');

const routes = express.Router()

routes.post("/", authMiddleware, controller.createCategory); // Create category

routes.get("/", authMiddleware, controller.getCategories); // Get all categories

routes.put("/:id", authMiddleware, controller.updateCategory); // Update category

routes.delete("/:id", authMiddleware, controller.deleteCategory); // Delete category

routes.post("/subcategory", authMiddleware, controller.addSubcategory);

module.exports = routes;
