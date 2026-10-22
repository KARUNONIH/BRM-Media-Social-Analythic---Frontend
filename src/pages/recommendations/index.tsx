import React, { useEffect, useState } from "react";
import { RiSparklingLine, RiCheckboxCircleLine } from "react-icons/ri";

interface ActionItem {
  priority: string;
  title: string;
  description: string;
  expectedImpact: string;
}

interface AIRecommendations {
  overallHealth: string;
  executiveSummary: string;
  actionItems: ActionItem[];
}

export const RecommendationsPage: React.FC = () => {
  const [data, setData] = useState<AIRecommendations | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    fetch(`${apiUrl}/analytics/recommendations`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch(() => {});
  }, [apiUrl]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Rekomendasi Strategis AI
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Insight prediktif berbasis analisis kinerja konten Instagram @bumirekayasamandiri
        </p>
      </div>

      <div className="bg-white border border-[#8B6914]/30 rounded p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#8B6914] text-white flex items-center justify-center">
            <RiSparklingLine size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Executive Summary for Owner</h2>
            <span className="text-[11px] text-[#8B6914] font-semibold">
              {data?.overallHealth || "Status: Optimal"}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 border border-amber-100 rounded p-4">
          {data?.executiveSummary}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Rencana Tindakan Yang Direkomendasikan (Action Items)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data?.actionItems || []).map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded p-5 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.priority === "Tinggi"
                      ? "bg-rose-100 text-rose-700"
                      : item.priority === "Sedang"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  Prioritas {item.priority}
                </span>

                <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-emerald-700">
                <RiCheckboxCircleLine size={15} />
                <span>{item.expectedImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
