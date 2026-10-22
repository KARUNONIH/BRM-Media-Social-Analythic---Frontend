import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RiArrowRightSLine, RiHomeLine } from "react-icons/ri";

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard Overview",
  posts: "Data Postingan Media Sosial",
  recommendations: "Rekomendasi Strategis AI",
  "bot-logs": "Log Asisten WhatsApp",
  settings: "Pengaturan",
};

function toLabel(segment: string): string {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  type Crumb = { label: string; href: string | null };
  const crumbs: Crumb[] = [];

  const isRootDashboard = segments.length === 0 || (segments.length === 1 && segments[0] === "dashboard");
  crumbs.push({ label: "Dashboard Overview", href: isRootDashboard ? null : "/dashboard" });

  if (isRootDashboard) {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500">
        <span className="flex items-center gap-1 text-gray-700 font-medium">
          <RiHomeLine className="w-4 h-4 text-gray-400" />
          <span>Dashboard Overview</span>
        </span>
      </nav>
    );
  }

  let cumulativePath = "/dashboard";
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i];
    const label = toLabel(seg);
    cumulativePath += `/${seg}`;
    const isLast = i === segments.length - 1;
    crumbs.push({ label, href: isLast ? null : cumulativePath });
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500">
      {crumbs.map((crumb, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <RiArrowRightSLine className="w-4 h-4 text-gray-300 shrink-0" />}
          {crumb.href ? (
            <Link to={crumb.href} className="flex items-center gap-1 hover:text-[#8B6914] transition-colors">
              {idx === 0 && <RiHomeLine className="w-4 h-4 text-gray-400" />}
              <span>{crumb.label}</span>
            </Link>
          ) : (
            <span className={`flex items-center gap-1 ${idx === 0 ? "text-gray-500" : "text-gray-800 font-semibold"}`}>
              {idx === 0 && <RiHomeLine className="w-4 h-4 text-gray-400" />}
              <span>{crumb.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
