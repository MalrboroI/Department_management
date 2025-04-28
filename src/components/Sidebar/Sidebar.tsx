import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Sidebar.scss";

export const Sidebar = () => {
  return (
    <Nav className="flex-column sidebar">
      <Nav.Item className="sidebar-header">
        <Nav.Link as={Link} to="/" className="sidebar-brand">
          <h4>Название компании</h4>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/departments" className="sidebar-link">
          Отделы
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/employees" className="sidebar-link">
          Сотрудники
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
