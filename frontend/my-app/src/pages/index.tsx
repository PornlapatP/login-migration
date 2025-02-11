import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useAuth } from "../context/AuthContext";
import Navbar from "@/components/Navbar";
import ProfilePage from "@/components/Profile";
// import Dashboard from "../components/Dashboard";
// import ProfilePage from "@/components/Profile";

const HomePage = () => {
  const { token, isLoading, logout } = useAuth(); // ดึง token จาก context
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("Session Data:", session);
  console.log("Session Status:", status);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Navbar />
      <ProfilePage />
    </div>
  );
};

export default HomePage;
