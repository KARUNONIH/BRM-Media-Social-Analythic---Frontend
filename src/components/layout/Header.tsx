import React from "react";
import { RiLogoutBoxRLine, RiWhatsappLine } from "react-icons/ri";
import { useAuth } from "../../providers/auth";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-slate-800">Media Social Analytics</h2>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <RiWhatsappLine className="text-emerald-600" size={13} />
          <span>Bot WA: Online (n8n Active)</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2.5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-[#8B6914] text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-400 capitalize">{user.role}</div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          title="Keluar"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs font-medium cursor-pointer transition-colors"
        >
          <RiLogoutBoxRLine size={14} />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};
