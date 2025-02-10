import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt"; // นำเข้า JWT จาก next-auth/jwt

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
    //   console.log("JWT callback: ", { token, account }); // ตรวจสอบข้อมูล token และ account ที่ได้รับ
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
    //   console.log("Session callback: ", { session, token }); // ตรวจสอบข้อมูล session และ token ที่ได้รับ
      if (token.accessToken) {
        session.accessToken = token.accessToken as string; // ส่งค่าจาก token มาเก็บใน session
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
