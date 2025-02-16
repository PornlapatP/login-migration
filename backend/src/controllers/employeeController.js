const { language } = require('googleapis/build/src/apis/language');
const employeeService = require('../services/employeeService');

// Create new employee
exports.createEmployee = async (req, res) => {
    try {
      const { fname, lname, nname, departmentId, departmentName } = req.body;
  
      const newEmployee = await employeeService.createEmployee({
        fname,
        lname,
        nname,
        departmentId: departmentId || null, // ถ้าไม่มีให้ส่งเป็น null
        departmentName: departmentName || null, // ถ้าไม่มีให้ส่งเป็น null
      });
  
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get all employees
exports.getEmployees = async (req, res) => {
    try {
      const employees = await employeeService.getEmployees();
      console.log(employees)
      res.status(200).json(employees);  // ส่งผลลัพธ์ทั้งหมด
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee by ID
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { fname, lname, nname, departmentId } = req.body;
    const updatedEmployee = await employeeService.updateEmployee(id, { fname, lname, nname, departmentId });
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await employeeService.deleteEmployee(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Create new department
// exports.createDepartmentHandler = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const newDepartment = await employeeService.createDepartment(name);
//     res.status(201).json(newDepartment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
