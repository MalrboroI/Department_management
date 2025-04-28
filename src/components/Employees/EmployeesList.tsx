import { useEffect, useState, useMemo } from "react";
import { Table, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchEmployes, deleteEmployee } from "../../API/mockApi";
import { ConfirmationModal } from "../Modals/ConfirmationModal";
import { Employee } from "../../API/mockApi";
import Eye from "../../icons/eye.svg";
import Del from "../../icons/circle-xmark.svg";
import "./EmployeesList.scss";

export const EmployeesList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployes();
      setEmployees(data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;

    const term = searchTerm.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term)
      // emp.phone.toLowerCase().includes(term) ||
      // emp.email.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await deleteEmployee(employeeToDelete.id);
      await loadEmployees();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  const handleCancelDelete = () => {
    setEmployeeToDelete(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="employees-list">
      <div className="list-header">
        <Link to="/employees/new" className="add-employee-btn">
          Добавить сотрудника
        </Link>

        <div className="search-container">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Поиск по имени, телефону или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm("")}
                className="clear-search-btn"
                title="Очистить поиск"
              >
                ×
              </Button>
            )}
          </InputGroup>
        </div>
      </div>

      <div className="table-container">
        <Table striped hover responsive className="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Отдел</th>
              <th>Должность</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.email}</td>
                  <td>{employee.departmentId}</td>
                  <td>{employee.role}</td>
                  <td className="actions-cell">
                    <Link
                      to={`/employees/${employee.id}`}
                      className="edit-link"
                    >
                      <img src={Eye} alt="Eye" />
                    </Link>
                    <Button
                      onClick={() => handleDeleteClick(employee)}
                      className="delete-btn"
                    >
                      <img src={Del} alt="Delete" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-results">
                  {employees.length === 0
                    ? "Нет сотрудников"
                    : "Сотрудники не найдены"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <ConfirmationModal
        show={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить сотрудника ${employeeToDelete?.firstName} ${employeeToDelete?.lastName}?`}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};
