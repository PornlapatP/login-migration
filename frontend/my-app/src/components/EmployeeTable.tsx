// components/EmployeeTable.tsx
import { useEffect, useState } from "react";
import { createEmployee, deleteEmployee, fetchEmployees, updateEmployee } from "../utils/api";

// กำหนด interface สำหรับประเภทข้อมูลพนักงาน
interface Department {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  fname: string;
  lname: string;
  nname: string;
  department?: Department;
}

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    nname: "",
    departmentId: 0,
  });

  // โหลดข้อมูลพนักงานจาก backend
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrEdit = async () => {
    try {
      const departmentName = formData.departmentId === 1 ? "HR" : formData.departmentId === 2 ? "Sale" : "Engineer";
      const employeeData = { ...formData, departmentName };
  
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, employeeData);
      } else {
        await createEmployee(employeeData);
      }
  
      setSelectedEmployee(null);
      setFormData({ fname: "", lname: "", nname: "", departmentId: 0 });
      loadEmployees();
    } catch (err) {
      setError("Failed to save employee.");
    }
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      fname: employee.fname,
      lname: employee.lname,
      nname: employee.nname,
      departmentId: employee.department?.id || 0,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      loadEmployees(); // โหลดข้อมูลใหม่หลังจากลบ
    } catch (err) {
      setError("Failed to delete employee.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border-b">ID</th>
            <th className="px-4 py-2 text-left border-b">First Name</th>
            <th className="px-4 py-2 text-left border-b">Last Name</th>
            <th className="px-4 py-2 text-left border-b">Nickname</th>
            <th className="px-4 py-2 text-left border-b">Department</th>
            <th className="px-4 py-2 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{employee.id}</td>
              <td className="px-4 py-2 border-b">{employee.fname}</td>
              <td className="px-4 py-2 border-b">{employee.lname}</td>
              <td className="px-4 py-2 border-b">{employee.nname}</td>
              <td className="px-4 py-2 border-b">
                {employee.department ? employee.department.name : "N/A"}
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(employee.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form for creating/editing employee */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">
          {selectedEmployee ? "Edit Employee" : "Create Employee"}
        </h3>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateOrEdit(); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              placeholder="First Name"
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              value={formData.fname}
              onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              placeholder="Last Name"
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              value={formData.lname}
              onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nickname</label>
            <input
              placeholder="Nickname"
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              value={formData.nname}
              onChange={(e) => setFormData({ ...formData, nname: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              aria-label="label for the select"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: parseInt(e.target.value) })}
              required
            >
              <option value={0}>Select Department</option>
              <option value={1}>HR</option>
              <option value={2}>Sale</option>
              <option value={3}>Engineer</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {selectedEmployee ? "Update Employee" : "Create Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeTable;
