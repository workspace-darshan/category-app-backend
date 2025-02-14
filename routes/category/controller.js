const Category = require('./model');
const UserModel = require('../auth/model');

module.exports = {
    // Create a category
    createCategory: async (req, res) => {
        try {
            const { name, status, parentCategoryId } = req.body;

            // Check if name is provided
            if (!name) {
                return res.status(400).json({ message: "Category name is required." });
            }

            // Create a new category
            const newCategory = new Category({
                name,
                status: status || "active",
                children: [],
            });

            // Save the category to DB
            const savedCategory = await newCategory.save();

            // If parentCategoryId is provided, add this category to the parent's `children`
            if (parentCategoryId) {
                await Category.findByIdAndUpdate(parentCategoryId, {
                    $push: { children: savedCategory._id },
                });
            }

            return res.status(201).json(savedCategory);
        } catch (error) {
            console.error("Error creating category:", error);
            return res.status(500).json({ message: "Server error. Please try again." });
        }
    },

    // Get all categories and build nested structure
    getCategories: async (req, res) => {
        try {
            // Fetch all categories and populate parent-child relationship
            const categories = await Category.find({}).populate('parentCategoryId').populate('children');

            // Function to build the nested category structure
            const buildCategoryTree = (categories) => {
                const map = {};
                const roots = [];

                // Create a map with category id as the key
                categories.forEach((category) => {
                    map[category._id] = { ...category.toObject(), children: [] };
                });

                categories.forEach((category) => {
                    if (category.parentCategoryId) {
                        // If the category has a parent, add it to the parent's children array
                        map[category.parentCategoryId._id].children.push(map[category._id]);
                    } else {
                        // If the category doesn't have a parent, it's a root category
                        roots.push(map[category._id]);
                    }
                });

                // Format the nested structure
                return roots.map((root) => formatCategory(root));
            };

            // Helper function to format category (removes unnecessary fields)
            const formatCategory = (category) => {
                return {
                    _id: category._id.toString(),
                    name: category.name,
                    status: category.status,
                    children: category.children.map(formatCategory),  // Recursively format children
                };
            };

            // Build the nested category structure
            const rootCategories = buildCategoryTree(categories);

            // Return the root categories with their nested children
            return res.status(200).json(rootCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            return res.status(500).json({ message: "Server error. Please try again." });
        }
    },

    // Update category (name or status)
    updateCategory: async (req, res) => {
        const { id } = req.params;
        const { name, status } = req.body;

        try {
            const category = await Category.findById(id);

            if (!category) {
                return res.status(404).json({ message: "Category not found." });
            }

            if (name) category.name = name;
            if (status) category.status = status;

            const updatedCategory = await category.save();

            return res.status(200).json(updatedCategory);
        } catch (error) {
            console.error("Error updating category:", error);
            return res.status(500).json({ message: "Server error. Please try again." });
        }
    },

    // Delete a category
    deleteCategory: async (req, res) => {
        const { id } = req.params;

        try {
            const category = await Category.findById(id);

            if (!category) {
                return res.status(404).json({ message: "Category not found." });
            }

            // Remove the category from its parent's `children` array if it has a parent
            if (category.children.length > 0) {
                for (const childId of category.children) {
                    await Category.findByIdAndUpdate(childId, {
                        $set: { parentCategoryId: null },
                    });
                }
            }

            await category.remove();

            return res.status(200).json({ message: "Category deleted successfully." });
        } catch (error) {
            console.error("Error deleting category:", error);
            return res.status(500).json({ message: "Server error. Please try again." });
        }
    },

    // Add a subcategory
    addSubcategory: async (req, res) => {
        const { parentCategoryId, name, status } = req.body;

        if (!parentCategoryId || !name) {
            return res.status(400).json({ message: "Parent category ID and subcategory name are required." });
        }

        try {
            const parentCategory = await Category.findById(parentCategoryId);

            if (!parentCategory) {
                return res.status(404).json({ message: "Parent category not found." });
            }

            // Create new subcategory
            const newSubcategory = new Category({
                name,
                status: status || "active",
                children: [],
            });

            const savedSubcategory = await newSubcategory.save();

            // Add subcategory to parent's `children` array
            parentCategory.children.push(savedSubcategory._id);
            await parentCategory.save();

            return res.status(201).json(savedSubcategory);
        } catch (error) {
            console.error("Error adding subcategory:", error);
            return res.status(500).json({ message: "Server error. Please try again." });
        }
    },
};
