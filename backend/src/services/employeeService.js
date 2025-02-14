const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new employee
exports.createEmployee = async ({ fname, lname, nname, departmentId, departmentName }) => {
    let department = null;
  
    // ถ้ามี departmentId ให้หา department ที่มีอยู่แล้ว
    if (departmentId) {
      department = await prisma.department.findUnique({
        where: { id: departmentId },
      });
    }
  
    // ถ้าไม่มี department และมี departmentName ให้สร้าง department ใหม่
    if (!department && departmentName) {
      department = await prisma.department.create({
        data: {
          name: departmentName,
        },
      });
    }
  
    // ถ้าไม่มี department หลังจากพยายามสร้าง return error
    if (!department) {
      throw new Error(`Department does not exist and no name provided to create one.`);
    }
  
    // สร้าง Employee โดยใช้ departmentId ที่ถูกต้อง
    return await prisma.employee.create({
      data: {
        fname,
        lname,
        nname,
        departmentId: department.id, // ใช้ ID ของ department ที่มีหรือสร้างใหม่
      },
      include: {
        department: true, // รวมข้อมูล department มาด้วย
      },
    });
  };
  

exports.getEmployees = async () => {
    return await prisma.employee.findMany({
      include: {
        department: true,  // รวมข้อมูลจากตาราง department
      },
    });
  };
// Get employee by ID
exports.getEmployeeById = async (id) => {
  return await prisma.employee.findUnique({
    where: { id: Number(id) },
    include: {
      department: true, // Include department info if needed
    },
  });
};

// Update employee by ID
exports.updateEmployee = async (id, { fname, lname, nname, departmentId }) => {
  return await prisma.employee.update({
    where: { id: Number(id) },
    data: {
      fname,
      lname,
      nname,
      departmentId,
    },
  });
};

// Delete employee by ID
exports.deleteEmployee = async (id) => {
  return await prisma.employee.delete({
    where: { id: Number(id) },
  });
};

// Create new department
exports.createDepartment = async (name) => {
  return await prisma.department.create({
    data: {
      name: name,
    },
  });
};

// Get department by ID (to check if it exists)
exports.getDepartmentById = async (id) => {
  return await prisma.department.findUnique({
    where: { id: Number(id) },
  });
};
