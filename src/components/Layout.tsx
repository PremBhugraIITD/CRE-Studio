import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  isReactorPage?: boolean;
}

const Layout = ({ children, isReactorPage = false }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main
        className={`flex-grow container mx-auto px-4 py-8 ${
          isReactorPage ? "reactor-page" : ""
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
