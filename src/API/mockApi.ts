// Микросервис для работы с mock данными
// Имитирует реальный API (back) с задержкой ответа

// Типы данных
export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  departmentId: number;
  phone?: string;
  email?: string;
  role?: string;
}

export interface WorkType {
  id: number;
  name: string;
  description: string;
  assignedEmployeeId?: number;
}

// Ключи для LocalStorage
const DEPARTMENTS_KEY = "departments";
const EMPLOYEES_KEY = "employees";

// Инициализация данных
const initializeData = <T>(key: string, defaultValue: T[]): T[] => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

// Mock данные Отдела
let departments: Department[] = initializeData(DEPARTMENTS_KEY, [
  { id: 1, name: "Отдел маркетинга", description: "Маркетологи" },
  { id: 2, name: "Поддержка", description: "Поддержка производственников" },
  { id: 3, name: "Разработчики", description: "Разработчики IT" },
]);

// Mock данные сотрудников
let employees: Employee[] = initializeData(
  EMPLOYEES_KEY,
  Array(5)
    .fill({
      id: 1,
      firstName: "Имя",
      lastName: "Фамилия",
      departmentId: 1,
      phone: "+7 999 999 99 99",
      email: "ФИО@company.ru",
      role: "Роль 1",
    })
    .map((emp, idx) => ({ ...emp, id: idx + 1 }))
);

// Обработка ошибок
const handleStorageError = (error: unknown, action: string) => {
  console.error(`Ошибка ${action} данных:`, error);
  throw new Error(`Не удалось ${action} данные`);
};

// Сохранение в LocalStorage
const saveToStorage = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    handleStorageError(error, "сохранить");
  }
};

// Имитация API вызовов (имитация асинхронности)
const fakeDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

// Для получения всех Отделов
export const fetchDepartments = async (): Promise<Department[]> => {
  await fakeDelay();
  return departments;
};

// Для получения конкретного Отдела по ID
export const fetchDepartmentById = async (id: number): Promise<Department> => {
  await fakeDelay();
  const department = departments.find((d) => d.id === id);
  if (!department) throw new Error("Department not found");
  return department;
};

// Для создания нового Отдела
export const createDepartment = async (
  department: Omit<Department, "id">
): Promise<Department> => {
  await fakeDelay();
  const newDepartment = {
    ...department,
    id: Math.max(...departments.map((d) => d.id), 0) + 1,
  };
  departments = [...departments, newDepartment];
  saveToStorage(DEPARTMENTS_KEY, departments);
  return newDepartment;
};

export const updateDepartment = async (
  id: number,
  updatedData: Omit<Department, "id">
): Promise<Department> => {
  await fakeDelay(); // Имитация задержки сети

  try {
    // Получаем текущие данные из localStorage
    const storedData = localStorage.getItem(DEPARTMENTS_KEY);
    const departments: Department[] = storedData ? JSON.parse(storedData) : [];

    // Находим индекс обновляемого отдела
    const departmentIndex = departments.findIndex((dept) => dept.id === id);

    if (departmentIndex === -1) {
      throw new Error("Отдел не найден");
    }

    // Создаем обновленный объект отдела
    const updatedDepartment = {
      ...departments[departmentIndex],
      ...updatedData,
    };

    // Обновляем массив отделов
    departments[departmentIndex] = updatedDepartment;

    // Сохраняем обратно в localStorage
    localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(departments));

    return updatedDepartment;
  } catch (error) {
    console.error("Ошибка при обновлении отдела:", error);
    throw new Error("Не удалось обновить отдел");
  }
};

// Получение всех сотрудников
export const fetchEmployes = async (): Promise<Employee[]> => {
  await fakeDelay();
  return employees;
};

// Получение конкретного сотрудника по ID
export const fetchEmployeeById = async (id: number): Promise<Employee> => {
  await fakeDelay();
  const employee = employees.find((empl) => empl.id === id);
  if (!employee) throw new Error("Employee not found");
  return employee;
};

// Для создания нового сотрудника
export const createEmploy = async (
  employee: Omit<Employee, "id">
): Promise<Employee> => {
  await fakeDelay();
  const newEmployee = {
    ...employee,
    id: Math.max(...employees.map((e) => e.id), 0) + 1,
  };
  employees = [...employees, newEmployee];
  saveToStorage(EMPLOYEES_KEY, employees);
  return newEmployee;
};

export const updateEmployee = async (
  id: number,
  updatedData: Omit<Employee, "id">
): Promise<Employee> => {
  await fakeDelay();
  const index = employees.findIndex((emp) => emp.id === id);

  if (index === -1) {
    throw new Error("Сотрудник не найден");
  }

  const updatedEmployee = { ...employees[index], ...updatedData };
  employees[index] = updatedEmployee;
  saveToStorage(EMPLOYEES_KEY, employees);
  return updatedEmployee;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await fakeDelay();
  const index = departments.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Department not found");
  departments.splice(index, 1);
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await fakeDelay();
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Employee not found");
  employees.splice(index, 1);
};

export const fetchWorkTypes = async (): Promise<WorkType[]> => {
  await fakeDelay();
  return [
    {
      id: 1,
      name: "Разработка",
      description: "Разработка новых фич",
      assignedEmployeeId: 1,
    },
    {
      id: 2,
      name: "Тестирование",
      description: "Проверка качества",
      assignedEmployeeId: 2,
    },
  ];
};

export const saveWorkTypes = async (
  departmentId: number,
  workTypes: WorkType[]
): Promise<void> => {
  await fakeDelay();
  console.log("Saved work types:", { departmentId, workTypes });
};
