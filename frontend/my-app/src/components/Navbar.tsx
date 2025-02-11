import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const Navbar = () => {
  const { logout } = useAuth(); // ดึง token จาก context

  return (
    <nav className="bg-blue-600 w-full p-4 shadow-lg rounded-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-white text-2xl pr-5 ">
          <p>MyApp</p>
        </div>

        {/* Navbar Links - อยู่ทางซ้าย */}
        <div className="space-x-6 text-white flex">
          <Link href="/dashboard">
            <span className="hover:bg-blue-500 px-4 py-2 rounded-md transition-colors duration-300">
              profile
            </span>
          </Link>
          <Link href="/list">
            <span className="hover:bg-blue-500 px-4 py-2 rounded-md transition-colors duration-300">
              List
            </span>
          </Link>
        </div>

        {/* User Account / Logout - อยู่ทางขวา */}
        <div className="flex items-center space-x-4 ml-auto">
          <button
            onClick={logout}
            className="text-white hover:bg-blue-500 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
