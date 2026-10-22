import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers/auth";
import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiArrowDownSLine,
  RiUserLine,
  RiLogoutBoxRLine,
  RiWhatsappLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import { Breadcrumb } from "./Breadcrumb";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  owner: "Owner",
  manager: "Manager",
};

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen = true }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name ?? "Pengguna BRM";
  const displayRole = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : "Owner";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-5 gap-4 shrink-0 sticky top-0 z-20">
      <button
        onClick={onToggleSidebar}
        className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
        aria-label={sidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
        title={sidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
      >
        {sidebarOpen ? <RiMenuFoldLine size={20} /> : <RiMenuUnfoldLine size={20} />}
      </button>

      <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide py-1">
        <Breadcrumb />
      </div>

      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
        <RiWhatsappLine size={15} />
        <span>Bot WhatsApp: Online</span>
      </div>

      {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2.5 hover:bg-gray-50 rounded px-2.5 py-1.5 transition-colors cursor-pointer"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : null}
          <div
            className={`w-9 h-9 rounded-full bg-[#8B6914] flex items-center justify-center text-white text-xs font-bold shrink-0 ${
              user?.avatarUrl ? "hidden" : ""
            }`}
          >
            {initials}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{displayName}</p>
            <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 bg-green-100 text-green-700">
              {displayRole}
            </span>
          </div>
          <RiArrowDownSLine size={16} className="text-gray-400 hidden sm:block" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg border border-gray-100 py-1 z-50">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            <div className="py-1">
              <Link
                to="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RiUserLine size={15} className="text-gray-400" />
                <span>Dashboard Overview</span>
              </Link>
              <div className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-500">
                <RiShieldCheckLine size={15} className="text-emerald-500" />
                <span>Sesi Terautentikasi</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-1">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <RiLogoutBoxRLine size={15} />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
