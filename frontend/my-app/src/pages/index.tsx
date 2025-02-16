import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useAuth } from "../context/AuthContext";
import Navbar from "@/components/Navbar";
import EmployeeTable from "../components/EmployeeTable";

const HomePage = () => {
  const { token, isLoading } = useAuth(); // ดึง token จาก context
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log("Session Data:", session);
  console.log("Session Status:", status);

  useEffect(() => {
    if (!token && status === "unauthenticated") {
      console.log("🔴 No token, redirecting to login...");
      router.push("/login");
    }
  }, [token, status, router]);
  

  if (isLoading || status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Employee Management System</h1>
        <EmployeeTable />
      </div>
    </div>
  );
};

export default HomePage;
