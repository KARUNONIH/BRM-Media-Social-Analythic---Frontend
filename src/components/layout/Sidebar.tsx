import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiInstagramLine,
  RiSparklingLine,
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

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const sections: NavSection[] = [
    {
      title: "DASHBOARD",
      items: [
        { label: "Overview", path: "/dashboard", icon: <RiDashboardLine size={18} /> },
      ],
    },
    {
      title: "MEDIA SOSIAL",
      items: [
        { label: "Data Postingan", path: "/dashboard/posts", icon: <RiInstagramLine size={18} /> },
      ],
    },
    {
      title: "AI & OTOMASI",
      items: [
        { label: "Rekomendasi AI", path: "/dashboard/recommendations", icon: <RiSparklingLine size={18} /> },
        { label: "Log WhatsApp Bot", path: "/dashboard/bot-logs", icon: <RiWhatsappLine size={18} /> },
      ],
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 h-16">
        <img
          src="/images/brm-logo.png"
          alt="Bumi Rekayasa Mandiri"
          className="w-8 h-8 object-contain shrink-0"
        />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800 leading-tight">Bumi Rekayasa</span>
          <span className="text-[10px] text-slate-400 font-medium">Media Analytics</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 pb-1.5">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[#8B6914]/10 text-[#8B6914] font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className={isActive ? "text-[#8B6914]" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
        v1.0.0 &bull; TA TRPL SV IPB
      </div>
    </aside>
  );
};
