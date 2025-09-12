"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import SiadilContent from "./SiadilContent";
import SiadilHeader from "./SiadilHeader";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [activeMenu, setActiveMenu] = useState("");

  const renderContent = () => {
    switch (activeMenu) {
      case "SIADIL":
        return <SiadilContent />;
      case "Home":
        return children;
      case "Profile":
        return (
          <div className="min-h-screen">
            <SiadilHeader />
            <div className="p-4 text-black">
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="mt-2">Halaman Profile</p>
            </div>
          </div>
        );
      case "Employment":
        return (
          <div className="min-h-screen">
            <SiadilHeader />
            <div className="p-4 text-black">
              <h1 className="text-2xl font-bold">Employment</h1>
              <p className="mt-2">Halaman Employment</p>
            </div>
          </div>
        );
      case "Kehadiran":
        return (
          <div className="min-h-screen">
            <SiadilHeader />
            <div className="p-4 text-black">
              <h1 className="text-2xl font-bold">
                Kehadiran, Koreksi, Cuti, dan Dinas
              </h1>
              <p className="mt-2">
                Halaman Kehadiran, Koreksi, Cuti, dan Dinas
              </p>
            </div>
          </div>
        );
      default:
        return children;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <main className="flex-1">{renderContent()}</main>
    </div>
  );
};

export default MainLayout;
