import axios from 'axios';

const API_URL = 'http://localhost:3222/api/users'; // URL ของ Backend

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/login`, 
    { email, password }, 
    { 
      withCredentials: true, // ✅ ให้ axios ส่ง cookies หรือ header authentication
    }
  );
  return response.data;
};
