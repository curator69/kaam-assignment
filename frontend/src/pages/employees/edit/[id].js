import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import { employeeService } from "../../../../services/employees";

export default function EditEmployee() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "employee",
  });

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const employee = await employeeService.getEmployeeById(id);
      setFormData({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        role: employee.role,
      });
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateEmployee(id, formData);
      alert("Employee updated successfully");
      router.push("/employees");
    } catch (error) {
      alert("Failed to update employee");
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update employee information
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/employees")}
            >
              Cancel
            </Button>
            <Button type="submit">Update Employee</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
