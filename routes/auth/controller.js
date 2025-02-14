const UserModel = require('./model');
require("dotenv").config();

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                meta: {
                    success: false,
                    message: "Email and password are required.",
                },
            });
        }
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                meta: {
                    success: false,
                    message: "User not found. Please register.",
                },
            });
        }
        console.log("🚀 ~ exports.userLogin= ~ user:", user)

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                meta: {
                    success: false,
                    message: "Invalid email or password.",
                },
            });
        }

        // Generate JWT Token
        const token = await user.generateToken();

        return res.status(200).json({
            meta: {
                success: true,
                message: "Login successful",
            },
            result: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            meta: {
                success: false,
                message: "Internal server error. Please try again later.",
            },
        });
    }
};

exports.userRegister = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body

        const result = await UserModel.create({
            name,
            email,
            password,
        })
        
        return res.status(200).json({
            meta: {
                success: true,
                message: "User createed successfully",
            },
            result: result,
        });

    } catch (error) {
        res.status(500).json({
            response: false,
            result: "internal server error on Register",
        });
    }
}
