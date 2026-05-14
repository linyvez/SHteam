import Header from "../components/Header";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-shteam-bg text-base-content">
      <Header type="logout" />
      <main className="container mx-auto p-4 flex justify-center">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
