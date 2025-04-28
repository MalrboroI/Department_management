import { useForm } from "react-hook-form";
import { createDepartment } from "../../API/mockApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./DepartmentForm.scss";

const schema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string(), // Убрали .min(1) чтобы разрешить пустую строку
});

type FormValues = z.infer<typeof schema>;

export const DepartmentForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "", // Устанавливаем пустую строку по умолчанию
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Преобразуем данные перед отправкой
      const departmentData = {
        name: data.name,
        description: data.description || "", // Гарантируем, что description будет строкой
      };
      await createDepartment(departmentData);
      navigate("/departments");
    } catch (error) {
      console.error("Ошибка при создании Отдела:", error);
      alert("Не удалось создать Отдел");
    }
  };

  return (
    <div className="form-container">
      <Form onSubmit={handleSubmit(onSubmit)} className="department-form">
        <h2 className="form-title">Создание нового отдела</h2>

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
              rows={3}
              {...register("description")}
              isInvalid={!!errors.description}
              placeholder="Введите описание отдела (необязательно)"
              className="form-input"
            />
            <Form.Control.Feedback type="invalid" className="error-message">
              {errors.description?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="form-actions">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/departments")}
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
              "Создать отдел"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};
