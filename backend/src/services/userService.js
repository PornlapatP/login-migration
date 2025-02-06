const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAllUsers = async () => {
  return await prisma.user.findMany();
};

exports.getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id: parseInt(id) } });
};
// exports.getUserById = async (id) => {
//   return await prisma.user.findUnique({ where: { id: parseInt(id) } });
// };

exports.createUser = async (data) => {
  return await prisma.user.create({ data });
};

exports.updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data,
  });
};

exports.deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id: parseInt(id) } });
};

exports.checkusersdata = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user; // ถ้าไม่พบ user จะได้ค่า null
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};