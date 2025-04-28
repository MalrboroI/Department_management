import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Alert, Spinner } from "react-bootstrap";
import {
  fetchDepartmentById,
  fetchEmployes,
  deleteDepartment,
  Department,
  Employee,
} from "../../API/mockApi";
import { WorkTypeTable } from "./WorkTypeTable";
import { ConfirmationModal } from "../Modals/ConfirmationModal";
import "./DepartmentDetails.scss";

export const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employees, setEmployes] = useState<Employee[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) throw new Error("Id Отдела не существует");

        const [departmentData, employeesData] = await Promise.all([
          fetchDepartmentById(Number(id)),
          fetchEmployes(),
        ]);

        setDepartment(departmentData);
        setEmployes(employeesData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Ошибка при загрузке данных"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteDepartment(Number(id));
      navigate("/departments");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Ошибка при удалении Отдела"
      );
    }
  };

  if (loading) {
    return (
      <div className="department-details">
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="department-details">
        <Alert variant="danger" className="m-3">
          Отдел не найден
        </Alert>
      </div>
    );
  }

  return (
    <div className="department-details">
      <Card className="department-card">
        <Card.Header>
          <Card.Title>{department.name}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text>{department.description}</Card.Text>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="department-actions">
            <Button
              variant="primary"
              onClick={() => navigate(`/departments/${id}/edit`)}
            >
              Редактировать
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Удалить
            </Button>
          </div>

          <div className="work-type-table-container">
            <WorkTypeTable employees={employees} departmentId={Number(id)} />
          </div>
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showDeleteModal}
        title="Удалить Отдел"
        message={`Вы уверены, что хотите удалить отдел "${department.name}"? Это действие не может быть отменено.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};
