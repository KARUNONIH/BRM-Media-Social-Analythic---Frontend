import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiInstagramLine,
  RiWhatsappLine,
} from "react-icons/ri";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  onMobileClose,
  isMobile,
}) => {
  const location = useLocation();
  const showExpanded = isMobile || !collapsed;

  const sections: NavSection[] = [
    {
      title: "DASHBOARD",
      items: [
        { label: "Dashboard Overview", path: "/dashboard", icon: <RiDashboardLine size={18} /> },
      ],
    },
    {
      title: "ANALITIK KONTEN",
      items: [
        { label: "Data Postingan", path: "/dashboard/posts", icon: <RiInstagramLine size={18} /> },
      ],
    },
    {
      title: "ASISTEN WHATSAPP",
      items: [
        { label: "Log & Monitor Bot", path: "/dashboard/bot-logs", icon: <RiWhatsappLine size={18} /> },
      ],
    },
  ];

  const sidebarContent = (
    <aside
      className={[
        "bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-200 h-full",
        isMobile ? "w-60" : `${collapsed ? "w-[72px]" : "w-60"} shrink-0`,
      ].join(" ")}
    >
      {/* Brand Header */}
      <div
        className={`flex items-center gap-3 px-4 py-4 border-b border-gray-100 ${
          !showExpanded ? "justify-center" : ""
        }`}
      >
        <img
          src="/images/brm-logo.png"
          alt="Bumi Rekayasa Mandiri"
          className="w-9 h-9 object-contain shrink-0"
        />
        {showExpanded && (
          <span className="text-sm font-bold text-gray-800 leading-tight whitespace-nowrap">
            Bumi Rekayasa
          </span>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-3 px-3 space-y-1">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className={index > 0 ? "pt-2.5 mt-2.5 border-t border-gray-100" : "mb-1"}
          >
            {showExpanded && (
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pt-1 pb-1.5">
                {section.title}
              </p>
            )}
            {!showExpanded && <div className="pt-1" />}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.path === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (isMobile) onMobileClose();
                    }}
                    title={!showExpanded ? item.label : undefined}
                    className={`flex items-center gap-3 rounded text-sm font-medium transition-colors ${
                      showExpanded ? "px-3 py-2.5" : "justify-center px-0 py-2.5"
                    } ${
                      isActive
                        ? "bg-[#8B6914] text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {showExpanded && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Branding */}
      <div className={`border-t border-gray-100 px-4 py-3 ${!showExpanded ? "text-center" : ""}`}>
        {showExpanded ? (
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Bumi Rekayasa Mandiri
          </p>
        ) : (
          <p className="text-[10px] text-gray-300">&copy;</p>
        )}
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onMobileClose}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return sidebarContent;
};
