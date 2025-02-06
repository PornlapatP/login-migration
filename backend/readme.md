1. npm init -y
2. ติดตั้ง Prisma CLI และ Client
npm install prisma @prisma/client
3. สร้าง Prisma schema
npx prisma init
4. change .env path connect database 
5. ใช้คำสั่งนี้สร้าง database createdb -h localhost -p 4321 -U postgres -W mydatabase (สร้างฐานข้อมูล (database) ใหม่ใน PostgreSQL)
6. สร้าง model ในschema.prisma 
7. npx prisma migrate dev --name init สร้าง migration file และตั้งชื่อ
-สร้างไฟล์ Migration ในโฟลเดอร์ prisma/migrations
-ปรับโครงสร้างฐานข้อมูลให้ตรงกับ Model
8. psql -d postgres -h localhost -p 4321 -U postgres (connect database)
9. อัพเดตโครงสร้างฐานข้อมูล 
Ex. model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  age       Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
10. สร้าง Migration ใหม่
-npx prisma migrate dev --name add-age-to-user
11. ตรวจสอบฐานข้อมูลและจัดการ Migration
-ดูสถานะ Migration npx prisma migrate status
-รีเซ็ตฐานข้อมูล (ลบข้อมูลทั้งหมด) npx prisma migrate reset
12.  ตัวเลือกเพิ่มเติมสำหรับการใช้งาน Production
npx prisma migrate deploy
13. สร้าง crud contoller , service , middlewere , routes
14. ถ้าจะใช้ import ex.import express from 'express';
import bodyParser from 'body-parser'ต้องเพิ่ม 
{
  "type": "module"
}
{
  "scripts": {
    "dev": "nodemon --experimental-modules app.js"
  }
ใน package.json
หรือ 
const express = require('express');
แบบนี้ก็ได้