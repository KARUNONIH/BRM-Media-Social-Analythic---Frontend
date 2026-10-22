import React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";

interface PageHeaderOrganismProps {
  prefix?: string;
  title: string;
  subtitle?: React.ReactNode;
  subtitleIcon?: React.ReactNode;
  actions?: React.ReactNode;
  showBack?: boolean;
  backPath?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeaderOrganism: React.FC<PageHeaderOrganismProps> = ({
  prefix,
  title,
  subtitle,
  subtitleIcon,
  actions,
  showBack = false,
  backPath,
  children,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={className}>
      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden">
        <div className={`p-6 ${children ? "border-b border-gray-100" : "border-b border-gray-200"}`}>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center gap-3">
              {showBack && (
                <button
                  onClick={handleBack}
                  className="shrink-0 p-2 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Kembali"
                >
                  <RiArrowLeftLine size={20} />
                </button>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl text-gray-700 font-light mb-1">
                  {prefix && <span>{prefix} </span>}
                  <span className="font-bold text-gray-900">{title}</span>
                </h1>
                {subtitle && (
                  <div className="text-gray-500 text-sm flex items-center gap-1.5 flex-wrap">
                    {subtitleIcon && <span>{subtitleIcon}</span>}
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
            {actions && <div className="shrink-0 flex gap-2">{actions}</div>}
          </div>
        </div>
        {children && <div className="px-6 py-4 bg-gray-50/50">{children}</div>}
      </div>
    </div>
  );
};
