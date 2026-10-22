import React, { useEffect, useState, useMemo } from "react";
import { RiSparklingLine, RiCheckboxCircleLine, RiTimeLine } from "react-icons/ri";
import { PageHeaderOrganism } from "../../components/common/PageHeaderOrganism";

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

  const { timeStr, dateStr } = useMemo(() => {
    const now = new Date();
    return {
      timeStr: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      dateStr: now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/analytics/recommendations`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch(() => {});
  }, [apiUrl]);

  return (
    <div className="space-y-4">
      <PageHeaderOrganism
        prefix="Rekomendasi"
        title="Strategis AI untuk Owner"
        subtitle={`${timeStr} • ${dateStr} • Evaluasi Pola Konten & Rencana Aksi Bisnis`}
        subtitleIcon={<RiTimeLine size={14} />}
        showBack={true}
        backPath="/dashboard"
      />

      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#8B6914] text-white flex items-center justify-center">
              <RiSparklingLine size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Executive Summary for Owner</h2>
              <span className="text-xs text-[#8B6914] font-semibold">
                {data?.overallHealth || "Status: Optimal"}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed bg-amber-50/60 border border-amber-200/70 rounded p-4">
          {data?.executiveSummary}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Rencana Aksi Yang Direkomendasikan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data?.actionItems || []).map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded p-5 shadow shadow-gray-200 flex flex-col justify-between space-y-3"
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

                <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
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
