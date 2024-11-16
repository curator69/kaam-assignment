import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import { employeeService } from "../../services/employees";
import { getInitials } from "../../utils/helpers";

export default function Employees() {
  const router = useRouter();
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetchEmployees();
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(id);
        alert("Employee deleted successfully");
        fetchEmployees();
      } catch (error) {
        alert("Failed to delete employee");
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleEdit = (id) => {
    router.push(`/employees/edit/${id}`);
  };

  const tableHeaders = [
    {
      key: "name",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              {getInitials(row.name)}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    // Update the tableHeaders array status section:
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(row._id)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage employee information
          </p>
        </div>
        <Button onClick={() => router.push("/employees/add")}>
          Add Employee
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (
          <Table headers={tableHeaders} data={filteredEmployees} />
        )}
      </div>
    </div>
  );
}
