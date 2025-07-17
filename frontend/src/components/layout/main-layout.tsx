import Header from "components/header/header";
import { ReactNode } from "react";
import "./main-layout.css";

interface MainLayoutProps {
  children: ReactNode;
}
const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;

  return (
    <div className="layout">
      <Header />
      <main className="main-content">{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-text">
            © {new Date().getFullYear()} DAML Token Exchange. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
