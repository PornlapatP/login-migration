import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

interface AuthContextType {
  token: string | null;
  login: (userToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // เมื่อกำลังโหลด session

    // ถ้ามี accessToken ใน session
    if (session?.accessToken) {
      setToken(session.accessToken);
      localStorage.setItem("token", session.accessToken); // เก็บ token ใน localStorage
    } else if (localStorage.getItem("token")) {
      // หรือถ้ามี token ใน localStorage
      setToken(localStorage.getItem("token"));
    }

    setIsLoading(false); // เปลี่ยนสถานะเป็นไม่โหลดแล้ว
  }, [session, status]);

  const login = (userToken: string) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
    router.push("/"); // ไปที่หน้า Home เมื่อ login สำเร็จ
  };

  const logout = () => {
    localStorage.removeItem("token"); // ลบ token จาก localStorage
    setToken(null); // รีเซ็ตค่า token ใน AuthContext
    signOut({ callbackUrl: "/login" }); // ทำการ sign out จาก next-auth และ redirect ไปที่หน้า login
  };
  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
