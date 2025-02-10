import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Dashboard from "../components/Dashboard";
import { useAuth } from "../context/AuthContext"; // ใช้ AuthContext เพื่อจัดการ session และ token

const HomePage = () => {
  const { token, isLoading, logout } = useAuth(); // ดึง token จาก context
  const { data: session, status } = useSession(); // ใช้ useSession จาก next-auth
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // ถ้ากำลังโหลด session
    if (!session?.accessToken && !token) {
      router.push("/login"); // ถ้าไม่มี accessToken หรือ token ให้ไปหน้า login
    }
  }, [status, session, token, router]);

  if (status === "loading" || isLoading) {
    return <p>Loading...</p>; // ถ้า session กำลังโหลด
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
      <Dashboard />
      <button
        onClick={logout}
        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-4"
      >
        ออกจากระบบ
      </button>
    </div>
  );
};

export default HomePage;
