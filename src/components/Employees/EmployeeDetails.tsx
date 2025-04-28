import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, ListGroup, Alert, Spinner } from "react-bootstrap";
import { fetchEmployeeById, deleteEmployee, Employee } from "../../API/mockApi";
import { ConfirmationModal } from "../Modals/ConfirmationModal";
import "./EmployeeDetails.scss";

export const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        if (!id) throw new Error("Id не валидно");
        const data = await fetchEmployeeById(Number(id));
        setEmployee(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Ошибка при загрузке сотрудника"
        );
      } finally {
        setLoading(false);
      }
    };
    loadEmployee();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteEmployee(Number(id));
      navigate("/employees");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ошибка при удалении сотрудника"
      );
    }
  };

  if (loading) {
    return (
      <div className="employee-details">
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="employee-details">
        <Alert variant="danger" className="mt-4">
          Сотрудник не найден
        </Alert>
      </div>
    );
  }

  return (
    <div className="employee-details">
      <Card className="employee-card">
        <Card.Header>
          <Card.Title>{`${employee.firstName} ${employee.lastName}`}</Card.Title>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush" className="employee-info">
            <ListGroup.Item>
              <strong>Отдел: </strong>
              <span>{employee.departmentId}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Телефон: </strong>
              <span>{employee.phone || "Не указан"}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Email: </strong>
              <span>{employee.email || "Не указан"}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Должность: </strong>
              <span>{employee.role || "Не указана"}</span>
            </ListGroup.Item>
          </ListGroup>

          {error && (
            <Alert variant="danger" className="mt-4">
              {error}
            </Alert>
          )}

          <div className="employee-actions">
            <Button
              variant="primary"
              onClick={() => navigate(`/employees/${id}/edit`)}
              className="edit-btn"
            >
              Редактировать
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              className="delete-btn"
            >
              Удалить
            </Button>
          </div>
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showDeleteModal}
        title="Удалить сотрудника"
        message={`Вы уверены, что хотите удалить сотрудника ${employee.firstName} ${employee.lastName}? Это действие не может быть отменено.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Удалить"
        cancelText="Отменить"
      />
    </div>
  );
};
