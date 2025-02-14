const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    parentCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
