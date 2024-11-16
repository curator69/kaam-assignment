import { useState } from "react";
import { useRouter } from "next/router";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { employeeService } from "../../../services/employees";

export default function AddEmployee() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "employee",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeService.createEmployee({
        ...formData,
        isActive: true,
      });
      router.push("/employees");
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Employee</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new employee account
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
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
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
            <Button type="submit">Add Employee</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
