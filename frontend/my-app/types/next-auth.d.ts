// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    authToken?: string; // เพิ่มฟิลด์ authToken ใน User
  }

  interface Session {
    user: User; // session.user จะเป็นประเภท User ที่เราได้ขยาย
    accessToken?: string;
  }

  interface JWT {
    authToken?: string; // เพิ่มฟิลด์ authToken ใน JWT
  }
}