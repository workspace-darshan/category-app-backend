const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretkey = require("../../service/constant").secretkey;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password") && this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        console.error("Error in pre-save hook:", error);
        next(error);
    }
});

userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                name: this.name,
                email: this.email,
            },
            secretkey,
            {
                expiresIn: "30d",
            }
        )

    } catch (error) {
        console.error("Token generation error:", error);
    }
}

userSchema.methods.comparePassword = function (passw) {
    return bcrypt.compare(passw, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;