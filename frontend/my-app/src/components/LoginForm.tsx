import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { login } from "../utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const { login: loginUser } = useAuth();
  const router = useRouter();
  // const { data: session, status } = useSession(); // ใช้ session จาก next-auth
  const { data: session } = useSession(); // ดึง session ที่ได้
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  
    if (result?.error) {
      setError("Invalid email or password");
    }
  };
  

  const handleGoogleLogin = async () => {
    signIn("google", { callbackUrl: "/" });
  };

  // เมื่อ session ถูกอัพเดตจาก Google Login
  // useEffect(() => {
  //   if (session?.accessToken) {
  //     loginUser(session.accessToken); // ใช้ AuthContext เพื่อเก็บ token
  //     localStorage.setItem("token", session.accessToken); // เก็บ token ลง localStorage
  //     router.push("/"); // Redirect ไปหน้า Home
  //   }
  // }, [session, loginUser, router]);
  useEffect(() => {
    // const { data: session } = useSession(); // ใช้ useSession เพื่อติดตาม session เมื่อมันเปลี่ยนแปลง
  
    if (session?.user?.authToken) {
      localStorage.setItem("token", session.user.authToken); // เก็บ token ลง localStorage
      router.push("/"); // Redirect ไปหน้า Home เมื่อ login สำเร็จ
    } else {
      // setError("ไม่มี token จาก session");
    }
  }, [session,router]); // ใช้ useEffect เพื่อให้ session ถูกตรวจสอบหลังจาก login

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">เข้าสู่ระบบ</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
            <input
              placeholder="email"
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
              placeholder="password"
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
            เข้าสู่ระบบ
          </button>
        </form>

        {/* 🔹 ปุ่ม Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white p-2 rounded-md mt-3 hover:bg-red-600"
        >
          Login with Google
        </button>

        <p className="mt-4 text-center">
          ยังไม่มีบัญชีใช่ไหม?{" "}
          <Link href="/register">
            สมัครสมาชิกที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;