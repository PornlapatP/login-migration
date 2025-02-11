import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import { login } from "../../../utils/api"; // นำเข้า login function
import axios from "axios";
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post("http://localhost:3222/api/users/login", {
            email: credentials?.email,
            password: credentials?.password,
          });
      
          const user = res.data;
          console.log("🔹 User Data:", user); // ตรวจสอบข้อมูลที่ได้จาก API
      
          // ตรวจสอบว่า user มีค่าที่จำเป็น
          if (!user.token || !credentials?.email) {
            throw new Error("User data is incomplete");
          }
      
          // คืนค่าที่ตรงกับ User type ของ NextAuth
          return {
            id: user.id || "",  // เพิ่ม id ถ้ามี
            email: credentials?.email,
            name: user.name || "",  // เพิ่ม name ถ้ามี
            authToken: user.token, // ใช้ token ที่ได้จาก API
          };
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      // กรณีใช้ Google Login
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }

      // กรณีใช้ Email/Password Login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.authToken = user.authToken; // เก็บ authToken
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.accessToken = token.accessToken as string | undefined;
        session.user.authToken = token.authToken as string | undefined;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
