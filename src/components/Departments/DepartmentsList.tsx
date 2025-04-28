import { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchDepartments } from "../../API/mockApi";
import { Department } from "../../API/mockApi";
import "./DepartmentsList.scss";

export const DepartmentsList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Ошибка загрузки Отделов:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="departments-list">
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="departments-list">
      <div className="list-header">
        <Link to="/departments/new" className="add-department-btn">
          Добавить отдел
        </Link>
      </div>

      <div className="table-container">
        <Table striped hover responsive className="departments-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="department-name">{dept.name}</td>
                  <td className="department-description">
                    {dept.description || "—"}
                  </td>
                  <td className="actions-cell">
                    <Link to={`/departments/${dept.id}`} className="view-link">
                      Просмотр
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="no-results">
                  Нет отделов
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
