const { getAllUsers, getUserById, createUser, updateUser, deleteUser, checkusersdata  } = require('../services/userService.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { generateGoogleAuthURL, getGoogleTokens } = require("../../utils/googleOAuth.js");

exports.getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    //Spread Operator (...) เพื่อรวม req.body กับ { password: passwordHash }
    const { password, ...rest } = req.body;
    const saltRounds = Number(process.env.SECRET_NUMBER);
    //only number .env chang to number 
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // รวม req.body กับ password ที่เข้ารหัสแล้ว
    const userData = { ...rest, password:  passwordHash};

    // สร้าง User ในฐานข้อมูล
    const user = await createUser(userData);

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.editUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.LoginUser = async (req,res) =>{
  const { email, password } = req.body;
  // console.log(email, password)
  try {
    const user = await checkusersdata(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Login failed" });
    }

    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      maxAge: process.env.AGE_TOKEN,
      secure: false,
      httpOnly: false,
      sameSite: "lax",
      domain: "localhost",
      path: "/",
    });

    return res.json({ message: "Login success", token });
  }catch(error){
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
// google login with save in postgres
exports.GoogleLogin = async (req, res) => {
  const { name, email } = req.body;
  console.log(name, email);

  // ตรวจสอบว่าผู้ใช้มีในระบบแล้วหรือไม่
  let user = await checkusersdata(email);

  if (!user) {
    // ถ้าผู้ใช้ยังไม่มีในระบบ, สร้างผู้ใช้ใหม่
    user = await createUser({ name, email }); // ไม่มีการส่ง password
  }

  // สร้าง JWT token สำหรับการเข้าสู่ระบบ
  const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: "1h" });
  res.json({ token, user });
};

// google login 

// exports.googleLogin = (req, res) => {
//   const authURL = generateGoogleAuthURL();
//   res.redirect(authURL);
// };

// exports.googleCallback = async (req, res) => {
//   const code = req.query.code;
//   if (!code) {
//     return res.status(400).json({ message: 'No code provided' });
//   }

//   try {
//     // แลกเปลี่ยน code เป็น token
//     const { id_token, access_token } = await getGoogleTokens(code);
//     const userInfo = jwt.decode(id_token);

//     // ตรวจสอบว่าผู้ใช้มีในระบบแล้วหรือไม่
//     let user = await checkusersdata(userInfo.email);
//     if (!user) {
//       // ถ้าผู้ใช้ยังไม่มีในระบบ, สร้างผู้ใช้ใหม่
//       user = await createUser({ name: userInfo.name, email: userInfo.email });
//     }

//     // สร้าง JWT token หรือใช้อะไรที่คุณต้องการ
//     const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: "1h" });

//     // ตั้งค่าคุกกี้ให้กับ client (สามารถใช้ cookie นี้ได้ในฟรอนต์เอนด์)
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production', // ใช้ secure cookie ใน production
//       sameSite: 'None', // Allow cross-origin cookie
//       domain: 'localhost', // ตั้งค่าให้สามารถใช้ในโดเมนร่วมกัน
//       maxAge: 3600000, // 1 hour
//     });

//     // Redirect ไปยังหน้าหลักหรือหน้าอื่นที่คุณต้องการ
//     res.redirect('http://localhost:3000/');  // ใช้ URL ที่ตรงกับ frontend ของคุณ

//   } catch (error) {
//     console.error('Error in Google Callback:', error);
//     res.status(500).json({ message: 'Authentication failed' });
//   }
// };




// ตรวจสอบ user profile
// exports.getUserProfile = (req, res) => {
//   // หาก token ถูกตรวจสอบและยืนยันแล้ว ให้ส่งข้อมูลผู้ใช้กลับ
//   if (req.user) {
//     return res.status(200).json({ user: req.user });
//   }
//   return res.status(401).json({ message: "Unauthorized" });
// };

// ใน controller
// exports.logout = (req, res) => {
//   // ลบ JWT token ที่เก็บใน cookies หรือ session
//   res.clearCookie('token'); // หรือถ้าใช้ session ก็สามารถลบ session ที่เกี่ยวข้องได้

//   // ส่ง response ยืนยันว่าออกจากระบบแล้ว
//   res.status(200).json({ message: "Logged out successfully" });
// };
