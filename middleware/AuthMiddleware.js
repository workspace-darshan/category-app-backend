const jwt = require('jsonwebtoken');
const secretkey = require("../service/constant").secretkey;

// const authMiddleware = (req, res, next) => {
//     try {
//         // Extract token from Authorization header
//         const token = req.headers.authorization?.startsWith('Bearer ')
//             ? req.headers.authorization.split(' ')[1]
//             : null;

//         if (!token) {
//             return res.status(401).json({
//                 meta: {
//                     success: false,
//                     message: "Authentication token is required."
//                 }
//             });
//         }

//         // Verify token
//         const decoded = jwt.verify(token, secretkey);

//         // Attach decoded user info to the request
//         req.user = decoded;

//         // Proceed to next middleware or route
//         next();
//     } catch (error) {
//         console.error("Authentication error:", error);

//         // Handle token-specific errors
//         if (error.name === "TokenExpiredError") {
//             return res.status(401).json({
//                 meta: {
//                     success: false,
//                     message: "Authentication token has expired. Please log in again."
//                 }
//             });
//         }

//         if (error.name === "JsonWebTokenError") {
//             return res.status(401).json({
//                 meta: {
//                     success: false,
//                     message: "Invalid authentication token."
//                 }
//             });
//         }

//         return res.status(500).json({
//             meta: {
//                 success: false,
//                 message: "Internal server error during authentication."
//             }
//         });
//     }
// };


const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Authorization" header
    console.log("🚀 ~ authMiddleware ~ token:", token)

    if (!token) {
        return res.status(403).json({ meta: { success: false, message: "No token provided" } });
    }

    try {
        const decoded = jwt.verify(token, secretkey);
        console.log("🚀 ~ authMiddleware ~ decoded:", decoded)
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ meta: { success: false, message: "Invalid token" } });
    }
};


module.exports = authMiddleware;
