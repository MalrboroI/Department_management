import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createEmploy, fetchDepartments, Department } from "../../API/mockApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./EmployeeForm.scss";

type FormValues = z.infer<typeof schema>;

const schema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  departmentId: z.number().min(1, "Выберите Отдел"),
  email: z.string().email("Некорректный email"),
  phone: z
    .string()
    .regex(/^\+7 \d{3} \d{3} \d{2} \d{2}$/, "Формат: +7 999 123 45 67"),
  role: z.string().optional(),
});

export const EmployeeForm = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      departmentId: 1,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [departmentsData] = await Promise.all([fetchDepartments()]);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        navigate("/employees", { replace: true });
      }
    };

    loadData();
    const loadDepartments = async () => {
      const depts = await fetchDepartments();
      if (depts.length > 0) {
        setValue("departmentId", depts[0].id);
      }
    };
    loadDepartments();
  }, [setValue, navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      await createEmploy(data);
      reset();
      navigate("/employees");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить сотрудника");
    }
  };

  return (
    <div className="form-container">
      <Form onSubmit={handleSubmit(onSubmit)} className="employee-form">
        <h2 className="form-title">Добавление нового сотрудника</h2>

        <div className="form-grid">
          <Form.Group className="form-group">
            <Form.Label className="form-label required">Имя</Form.Label>
            <Form.Control
              {...register("firstName")}
              isInvalid={!!errors.firstName}
              placeholder="Введите имя сотрудника"
              className="form-input"
            />
            <Form.Control.Feedback type="invalid" className="error-message">
              {errors.firstName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label required">Фамилия</Form.Label>
            <Form.Control
              {...register("lastName")}
              isInvalid={!!errors.lastName}
              placeholder="Введите фамилию сотрудника"
              className="form-input"
            />
            <Form.Control.Feedback type="invalid" className="error-message">
              {errors.lastName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label required">Email</Form.Label>
            <Form.Control
              type="email"
              {...register("email")}
              isInvalid={!!errors.email}
              placeholder="name@company.ru"
              className="form-input"
            />
            <Form.Control.Feedback type="invalid" className="error-message">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group phone-group">
            <Form.Label className="form-label required">Телефон</Form.Label>
            <div className="phone-input">
              <span className="phone-prefix"></span>
              <Form.Control
                {...register("phone")}
                isInvalid={!!errors.phone}
                placeholder="+7 999 999 99 99"
                className="form-input"
              />
            </div>
            <Form.Control.Feedback type="invalid" className="error-message">
              {errors.phone?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label">Должность</Form.Label>
            <Form.Control
              {...register("role")}
              placeholder="Укажите должность"
              className="form-input"
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label required">Отдел</Form.Label>
            <Form.Select
              {...register("departmentId", { valueAsNumber: true })}
              isInvalid={!!errors.departmentId}
              className="form-input"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid" className="error-message">
              {errors.departmentId?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="form-actions">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/employees")}
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
              "Добавить сотрудника"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};
