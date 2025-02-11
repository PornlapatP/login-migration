import axios from 'axios';

const API_URL = 'http://localhost:3222/api/users'; // URL ของ Backend

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      {
        withCredentials: true, // ✅ ให้ axios ส่ง cookies หรือ header authentication
      }
    );

    return response.data;
  } catch (error) {
    const errMessage = (error as Error).message || "Login failed";
    console.error("Login error:", errMessage);
    throw new Error(errMessage);
  }
};

export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/register`,
    { name, email, password },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
export const googlelogin = async (name: string, email: string ) => {
  console.log(name,email)
  const response = await axios.post(
    `${API_URL}/google-login`,
    { name, email },
    {
      withCredentials: true,
    }
  );
  return response.data;
};


// export const googlelg = async () => {
//   try {
//     const response = await axios.get(
//       `${API_URL}/google/login`,
//       {
//         withCredentials: true,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Axios Error: ", error); // เพิ่มการพิมพ์ข้อผิดพลาดเพื่อหาสาเหตุ
//     throw error; // เพิ่มการโยนข้อผิดพลาดต่อ
//   }
// };
