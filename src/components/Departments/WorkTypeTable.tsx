import { useState } from "react";
import { Table, Button, Form, Spinner } from "react-bootstrap";
import { Employee } from "../../API/mockApi";
import "./WorkTypeTable.scss";

interface WorkType {
  id: number;
  name: string;
  description: string;
  assignedEmployeeId?: number;
}

interface WorkTypeTableProps {
  employees: Employee[];
  departmentId: number;
}

export const WorkTypeTable = ({ employees, departmentId }: WorkTypeTableProps) => {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([
    { id: 1, name: 'Разработка', description: 'Разработка новых функций' },
    { id: 2, name: 'Тестирование', description: 'Проверка качества' },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleValueChange = (id: number, field: keyof WorkType, value: string | number) => {
    setWorkTypes(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addWorkType = () => {
    const newId = workTypes.length > 0 ? Math.max(...workTypes.map(w => w.id)) + 1 : 1;
    setWorkTypes(prev => [
      ...prev,
      { id: newId, name: '', description: '', assignedEmployeeId: undefined }
    ]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Здесь будет логика сохранения
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saved work types:', { departmentId, workTypes });
      alert('Изменения успешно сохранены');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="work-type-table">
      <div className="table-header">
        <h4>Виды работ</h4>
        <Button 
          variant="primary" 
          onClick={addWorkType}
          className="add-button"
        >
          Добавить вид работ
        </Button>
      </div>

      <div className="table-container">
        <Table hover>
          <thead>
            <tr>
              <th >Название</th>
              <th >Описание</th>
              <th >Ответственный</th>
            </tr>
          </thead>
          <tbody>
            {workTypes.map(workType => (
              <tr key={workType.id}>
                <td>
                  <Form.Control
                    value={workType.name}
                    onChange={(e) => handleValueChange(workType.id, 'name', e.target.value)}
                    placeholder="Введите название"
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={workType.description}
                    onChange={(e) => handleValueChange(workType.id, 'description', e.target.value)}
                    placeholder="Введите описание"
                  />
                </td>
                <td>
                  <Form.Select
                    value={workType.assignedEmployeeId || ''}
                    onChange={(e) => handleValueChange(workType.id, 'assignedEmployeeId', Number(e.target.value))}
                  >
                    <option value="">Не назначен</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="save-section">
        <Button
          variant="success"
          onClick={handleSave}
          disabled={isSaving}
          className="save-button"
        >
          {isSaving ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="spinner" />
              Сохранение...
            </>
          ) : (
            'Сохранить изменения'
          )}
        </Button>
      </div>
    </div>
  );
};
