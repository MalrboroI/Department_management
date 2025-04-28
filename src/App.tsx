import { BrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { AppRoutes } from "./store/AppRoutes";
import "./GlobalStyles/App.scss";

export const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
};

export default App;
