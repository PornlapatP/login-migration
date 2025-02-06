const { getAllUsers, getUserById, createUser, updateUser, deleteUser, checkusersdata  } = require('../services/userService.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


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
  console.log(email, password)
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
