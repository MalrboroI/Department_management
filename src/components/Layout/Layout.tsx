import { ReactNode } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import "./Layout.scss";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-content">{children}</main>
    </div>
  );
};
