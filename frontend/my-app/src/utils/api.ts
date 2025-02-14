import axios from 'axios';

const API_URL = 'http://localhost:3222/api/users'; // URL ของ Backend

// ดึง Token จาก localStorage
const getToken = () => localStorage.getItem('token');

// สร้าง Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ ให้ axios ส่ง cookies หรือ header authentication
});

// Interceptor สำหรับแนบ Token เข้าไปใน Headers ของทุก Request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ แนบ Token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ ฟังก์ชัน Login
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/login', { email, password });

    // ✅ บันทึก Token ลง localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error) {
    const errMessage = (error as Error).message || 'Login failed';
    console.error('Login error:', errMessage);
    throw new Error(errMessage);
  }
};

// ✅ ฟังก์ชัน Register
export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/register', { name, email, password });
  return response.data;
};

// ✅ ฟังก์ชัน Google Login
export const googlelogin = async (name: string, email: string) => {
  console.log(name, email);
  const response = await api.post('/google-login', { name, email });
  return response.data;
};

// ✅ ฟังก์ชัน Fetch Employees (ต้องแนบ Token)
export const fetchEmployees = async () => {
  const response = await api.get('/get/employees');
  return response.data;
};

// ✅ ฟังก์ชัน Create Employee (ต้องแนบ Token)
export const createEmployee = async (employeeData: {
  fname: string;
  lname: string;
  nname: string;
  departmentId: number;
}) => {
  console.log(employeeData);
  const response = await api.post('/create/employees', employeeData);
  return response.data;
};


// ✅ ฟังก์ชัน Update Employee (ต้องแนบ Token)
export const updateEmployee = async (
  id: number,
  employeeData: { fname: string; lname: string; nname: string; departmentId: number }
) => {
  const response = await api.put(`/update/employees/${id}`, employeeData);
  return response.data;
};

// ✅ ฟังก์ชัน Delete Employee (ต้องแนบ Token)
export const deleteEmployee = async (id: number) => {
  await api.delete(`/delete/employees/${id}`);
};
