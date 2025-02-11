// next-auth.d.ts

import NextAuth from "next-auth";
import { Session } from "next-auth";

// ประกาศโมดูลเพื่อขยายประเภท default
declare module "next-auth" {
  interface User {
    email: string;
    name?: string;
    token?: string; // เพิ่ม token ในประเภท User
  }

  interface Session {
    user: User; // อัปเดตประเภท session.user ให้รองรับ User ที่มี token
    accessToken?: string; // เพิ่ม accessToken ใน session ถ้าต้องการ
  }
}
