import React from "react";
// import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

const DashboardLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
    
        {children}
      
    </div>
  );
};

export default DashboardLayout;