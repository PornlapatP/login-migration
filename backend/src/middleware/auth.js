const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1]; // ตรวจสอบจากทั้ง Cookies และ Authorization Header
        let user;

        if (token) {
            // 1. ตรวจสอบ JWT ของระบบ (Login ด้วย Email + Password)
            try {
                // พยายามตรวจสอบว่า token เป็น JWT หรือไม่
                user = jwt.verify(token, process.env.SECRET); // ตรวจสอบ JWT
                console.log("✅ Authenticated User (JWT):", user);
            } catch (jwtError) {
                // ถ้า JWT มีปัญหา (เช่น "jwt malformed")
                console.log("❌ Invalid JWT Token:", jwtError.message);

                // 2. ตรวจสอบ Google Token (Login ด้วย Google)
                const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
                // console.log("Google API response:", response.data);
                user = response.data; // user ข้อมูลจาก Google
                // console.log("✅ Authenticated User (Google):", user);
            }

            req.user = user; // เก็บข้อมูล user ใน req.user
            return next(); // ไปยัง middleware หรือ route handler ต่อไป
        } else {
            return res.status(401).json({ message: "No token provided" }); // ไม่มี token
        }
    } catch (error) {
        console.error("❌ Token Error:", error.message || error.response?.data);
        if (error.response) {
            console.log("🔴 Google API Error:", error.response.data); // ดู error จาก Google API
        }
        return res.status(403).json({ message: "Invalid token" });
    }
};
