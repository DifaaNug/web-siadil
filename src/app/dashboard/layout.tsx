"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Function untuk mendapatkan active menu berdasarkan pathname
  const getActiveMenuFromPath = (path: string) => {
    if (path === "/dashboard") return "Home";
    if (path === "/dashboard/profile") return "Profile";
    if (path === "/dashboard/employment") return "Employment";
    if (path === "/dashboard/kehadiran") return "Kehadiran";
    if (path === "/dashboard/siadil") return "SIADIL";
    return "Home";
  };

  const [activeMenu, setActiveMenu] = useState(() =>
    getActiveMenuFromPath(pathname)
  );

  // Update active menu saat pathname berubah
  useEffect(() => {
    const newActiveMenu = getActiveMenuFromPath(pathname);
    setActiveMenu(newActiveMenu);
  }, [pathname]);

  // Set loaded state untuk enable smooth transitions
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMenuChange = (menu: string) => {
    const routes: { [key: string]: string } = {
      Home: "/dashboard",
      Profile: "/dashboard/profile",
      Employment: "/dashboard/employment",
      Kehadiran: "/dashboard/kehadiran",
      SIADIL: "/dashboard/siadil",
    };

    if (routes[menu] && routes[menu] !== pathname) {
      setActiveMenu(menu);
      router.push(routes[menu]);
    }
  };

  return (
    <div className={`dashboard-container ${isLoaded ? "loaded" : ""}`}>
      <div
        className={`sidebar-container ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}>
        <Sidebar
          activeMenu={activeMenu}
          onMenuChange={handleMenuChange}
          onCollapseChange={setIsSidebarCollapsed}
        />
      </div>
      <main className="main-content">{children}</main>
    </div>
  );
}
