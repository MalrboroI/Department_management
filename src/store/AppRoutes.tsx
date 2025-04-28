import { Routes, Route } from "react-router-dom";
import { DepartmentsList } from "../components/Departments/DepartmentsList";
import { DepartmentForm } from "../components/Departments/DepartmentForm";
import { DepartmentEditForm } from "../components/Departments/DepartmentEditForm";
import { DepartmentDetails } from "../components/Departments/DepartmentDetails";
import { EmployeesList } from "../components/Employees/EmployeesList";
import { EmployeeForm } from "../components/Employees/EmployeeForm";
import { EmployeeDetails } from "../components/Employees/EmployeeDetails";
import { EmployeeEditForm } from "../components/Employees/EmployeeEditForm";
import { NotFound } from "../components/NotFound";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Departments routes */}
      <Route path="/departments" element={<DepartmentsList />} />
      <Route path="/departments/new" element={<DepartmentForm />} />
      <Route path="/departments/:id" element={<DepartmentDetails />} />
      <Route path="/departments/:id/edit" element={<DepartmentEditForm />} />

      {/* Employees routes */}
      <Route path="/employees" element={<EmployeesList />} />
      <Route path="/employees/new" element={<EmployeeForm />} />
      <Route path="/employees/:id" element={<EmployeeDetails />} />
      <Route path="/employees/:id/edit" element={<EmployeeEditForm />} />

      {/* Default routes */}
      <Route path="/" element={<DepartmentsList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
