const express = require('express');
const bodyParser= require('body-parser');
const userRoutes = require('./src/routes/userRoute');
const cookieParser = require("cookie-parser");
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:3000', //กำหนดสิทธิ์การเข้าถึง
  credentials: true,/// send cookie
  optionsSuccessStatus: 200,
  methods:"GET,PUT,POST,DELETE,HEAD" //method
};
app.use(cors(corsOptions));
app.use(express.json());
// เส้นทางหลัก
app.use('/api/users', userRoutes);


// app.use(express.urlencoded({ extended: true })); // ✅ รองรับ Form Data

// Middleware สำหรับจัดการข้อผิดพลาด
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});
const PORT = process.env.PORT || 3222;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// export default app;
