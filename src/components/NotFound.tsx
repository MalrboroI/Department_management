import { Link } from "react-router-dom";
import "./NotFound.scss";

export const NotFound = () => {
  return (
    <div className="not-found">
      <h2>404 - Страница не найдена</h2>
      <p>Страница, которую вы ищете, не существует.</p>
      <Link to="/" className="home-link">
        Назад на домашнюю страницу
      </Link>
    </div>
  );
};
