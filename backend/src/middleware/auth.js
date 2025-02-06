require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies?.token; // เช็ค cookie token
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "No token provided" }); // ไม่มี token
    }

    try {
        const user = jwt.verify(token, process.env.SECRET); // ตรวจสอบ token
        req.user = user; // เพิ่ม payload ลง req
        console.log("Authenticated User:", user);
        next(); // ไป middleware ตัวถัดไป
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token has expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token" });
        } else {
            return res.status(403).json({ message: "Token verification failed" });
        }
    }
};
