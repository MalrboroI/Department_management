import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDepartmentById, updateDepartment } from "../../API/mockApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./DepartmentEditForm.scss";

// Схема валидации
const schema = z.object({
  name: z.string().min(1, "Название отдела обязательно"),
  description: z.string(),
});

type FormValues = z.infer<typeof schema>;

export const DepartmentEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
    },
  });

  // Загрузка данных отдела
  useEffect(() => {
    const loadData = async () => {
      try {
        const departmentData = await fetchDepartmentById(Number(id));

        if (departmentData) {
          reset({
            name: departmentData.name,
            description: departmentData.description || "",
          });
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        navigate("/departments", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, reset, navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Данные для отправки
      const updateData = {
        name: data.name,
        description: data.description,
      };

      await updateDepartment(Number(id), updateData);
      navigate(`/departments/${id}`);
    } catch (error) {
      console.error("Ошибка обновления:", error);
      alert("Не удалось обновить данные отдела");
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="form-container">
      <Form onSubmit={handleSubmit(onSubmit)} className="department-form">
        <h2 className="form-title">Редактирование отдела</h2>

        <div className="form-grid">
          <Form.Group className="form-group">
            <Form.Label className="form-label required">Название</Form.Label>
            <Form.Control
              {...register("name")}
              isInvalid={!!errors.name}
              placeholder="Введите название отдела"
              className="form-input"
            />
            <Form.Control.Feedback type="invalid" className="error-message">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label">Описание</Form.Label>
            <Form.Control
              as="textarea"
              {...register("description")}
              placeholder="Введите описание отдела"
              className="form-input"
              rows={3}
            />
          </Form.Group>
        </div>

        <div className="form-actions">
          <Button
            variant="outline-secondary"
            onClick={() => navigate(`/departments/${id}`)}
            className="cancel-btn"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="spinner" />{" "}
                Сохранение...
              </>
            ) : (
              "Сохранить изменения"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};
