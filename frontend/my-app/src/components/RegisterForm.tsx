import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // ใช้ useAuth
import { register } from '../utils/api'; // ฟังก์ชันสมัครสมาชิก
import { useRouter } from 'next/router';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { token, isLoading, login: loginUser } = useAuth(); // ใช้ token และ isLoading จาก context
  const router = useRouter();

  // ตรวจสอบ token หรือ session เมื่อเริ่มต้น
  useEffect(() => {
    if (isLoading) return; // ถ้ายังโหลดอยู่ ให้รอจนกว่า isLoading จะเป็น false

    // ถ้ามี token แล้วให้ redirect ไปหน้า Home
    if (token) {
      router.replace('/'); // ไปหน้า Home
    }
  }, [isLoading, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await register(name, email, password);
      loginUser(data.token); // เข้าสู่ระบบหลังจากสมัคร
      router.push('/'); // เปลี่ยนเส้นทางไปหน้า Home
    } catch {
      setError('สมัครสมาชิกไม่สำเร็จ');
    }
  };

  if (isLoading) {
    return <div>กำลังโหลด...</div>; // เมื่อกำลังโหลดไม่แสดง RegisterForm
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">สมัครสมาชิก</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
            <input
              placeholder='name'
              type="text"
              className="w-full p-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
            <input
              placeholder='email'
              type="email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input
              placeholder='password'
              type="password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            สมัครสมาชิก
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
