import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "../../providers/auth";

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth < 768);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((v) => !v);
    } else {
      setDesktopCollapsed((v) => !v);
    }
  };

  const isSidebarOpen = isMobile ? mobileSidebarOpen : !desktopCollapsed;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f5f6fa] overflow-hidden">
      <Sidebar
        collapsed={desktopCollapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onToggleSidebar={handleToggleSidebar} sidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
