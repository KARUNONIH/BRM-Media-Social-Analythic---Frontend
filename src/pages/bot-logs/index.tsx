import React, { useEffect, useState } from "react";
import { RiWhatsappLine, RiRobotLine, RiUserLine } from "react-icons/ri";

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

  useEffect(() => {
    fetch(`${apiUrl}/bot/logs`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setLogs(res.data);
      })
      .catch(() => {});
  }, [apiUrl]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Log Asisten WhatsApp AI
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit interaksi nyata bot WhatsApp dengan Owner dan tim operasional
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <RiWhatsappLine size={14} />
          <span>Gowa WhatsApp Gateway: Siaga</span>
        </span>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white border border-slate-200 rounded p-4 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                  <RiUserLine size={13} />
                </div>
                <span className="text-xs font-bold text-slate-800">{log.sender}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleString("id-ID")}
              </span>
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200/60">
              <span className="font-semibold text-slate-900">Pesan Masuk: </span>
              {log.query}
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-800 bg-emerald-50/50 p-3 rounded border border-emerald-100">
              <RiRobotLine className="text-emerald-600 shrink-0 mt-0.5" size={16} />
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  Tindakan AI: {log.actionTaken}
                </div>
                <p className="text-slate-700 leading-relaxed">{log.responsePreview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
