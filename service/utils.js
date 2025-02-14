// responseHelper.js

const successResponse = (res, data, message = "Request was successful.", statusCode = 200) => {
    return res.status(statusCode).json({
        meta: {
            success: true,
            message,
        },
        result: data,
    });
};

const errorResponse = (res, error, message = "An error occurred.", statusCode = 500) => {
    console.log("Error creating notfication:", error);
    return res.status(statusCode).json({
        meta: {
            success: false,
            message,
        },
    });
};

const buildCategoryTree = (categories) => {
    const map = {};
    categories.forEach((category) => {
        map[category._id] = { ...category.toObject(), children: [] };
    });

    const categoryTree = [];
    categories.forEach((category) => {
        if (category.parent) {
            map[category.parent._id].children.push(map[category._id]);
        } else {
            categoryTree.push(map[category._id]);
        }
    });
    return categoryTree;
}

module.exports = { successResponse, errorResponse, buildCategoryTree };
