import React, { useEffect, useState, useMemo } from "react";
import { RiWhatsappLine, RiRobotLine, RiUserLine, RiTimeLine } from "react-icons/ri";
import { PageHeaderOrganism } from "../../components/common/PageHeaderOrganism";

interface BotLog {
  id: string;
  sender: string;
  query: string;
  actionTaken: string;
  responsePreview: string;
  timestamp: string;
  status: string;
}

export const BotLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<BotLog[]>([]);
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
    fetch(`${apiUrl}/bot/logs`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setLogs(res.data);
      })
      .catch(() => {});
  }, [apiUrl]);

  return (
    <div className="space-y-4">
      <PageHeaderOrganism
        prefix="Log"
        title="Asisten WhatsApp AI"
        subtitle={`${timeStr} • ${dateStr} • Audit Interaksi Nyata n8n LangChain Bot`}
        subtitleIcon={<RiTimeLine size={14} />}
        showBack={true}
        backPath="/dashboard"
        actions={
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <RiWhatsappLine size={15} />
            <span>Gowa Gateway: Siaga</span>
          </span>
        }
      />

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white border border-gray-200 rounded p-4 shadow shadow-gray-200 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-600">
                  <RiUserLine size={13} />
                </div>
                <span className="text-xs font-bold text-gray-800">{log.sender}</span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">
                {new Date(log.timestamp).toLocaleString("id-ID")}
              </span>
            </div>

            <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded border border-gray-200/60">
              <span className="font-semibold text-gray-900">Pesan Masuk: </span>
              {log.query}
            </div>

            <div className="flex items-start gap-2.5 text-xs text-gray-800 bg-emerald-50/60 p-3 rounded border border-emerald-200/70">
              <RiRobotLine className="text-emerald-600 shrink-0 mt-0.5" size={16} />
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  Tindakan AI: {log.actionTaken}
                </div>
                <p className="text-gray-700 leading-relaxed">{log.responsePreview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
