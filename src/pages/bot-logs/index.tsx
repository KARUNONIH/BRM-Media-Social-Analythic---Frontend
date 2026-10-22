import React, { useEffect, useState, useMemo } from "react";
import {
  RiWhatsappLine,
  RiRobotLine,
  RiUserLine,
  RiTimeLine,
  RiSendPlaneLine,
  RiCheckboxCircleLine,
  RiServerLine,
  RiDatabase2Line,
} from "react-icons/ri";
import { PageHeaderOrganism } from "../../components/common/PageHeaderOrganism";

interface BotLog {
  id: string;
  sender: string;
  query: string;
  toolCalled: string;
  responseSummary: string;
  timestamp: string;
  status: string;
}

export const BotLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [testMsg, setTestMsg] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [dispatching, setDispatching] = useState(false);

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

  const handleTestDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMsg.trim()) return;

    setDispatching(true);
    try {
      const res = await fetch(`${apiUrl}/bot/dispatch-summary`, { method: "POST" });
      const data = await res.json();
      setDispatchStatus(data.message || "Pesan uji berhasil dikirim ke WhatsApp.");
      setTestMsg("");
    } catch {
      setDispatchStatus("Gagal mengirimkan pesan uji.");
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeaderOrganism
        prefix="Asisten"
        title="WhatsApp Bot &amp; Audit Log"
        subtitle={`${timeStr} • ${dateStr} • Monitoring Interaksi n8n Agentic Tool Calling`}
        subtitleIcon={<RiTimeLine size={14} />}
        showBack={true}
        backPath="/dashboard"
      />

      {/* Status 3 Layanan Inti */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4 shadow shadow-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <RiWhatsappLine size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Gowa WhatsApp Gateway</p>
              <p className="text-[11px] text-gray-500">Koneksi Nomor Bot BRM</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <RiCheckboxCircleLine size={12} />
            <span>Online</span>
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 shadow shadow-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#8B6914]/10 text-[#8B6914] flex items-center justify-center">
              <RiServerLine size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">n8n Workflow Engine</p>
              <p className="text-[11px] text-gray-500">ID: jsfzacwY867GGMnW</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#8B6914] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <RiCheckboxCircleLine size={12} />
            <span>Aktif (32 Node)</span>
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 shadow shadow-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <RiDatabase2Line size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">MongoDB Database</p>
              <p className="text-[11px] text-gray-500">Audit Log &amp; Whitelist Access</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <RiCheckboxCircleLine size={12} />
            <span>Terhubung</span>
          </span>
        </div>
      </div>

      {/* Form Uji Kirim Pesan ke WhatsApp */}
      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-5 border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">
          Uji Coba Pengiriman Laporan ke WhatsApp
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          Kirim notifikasi atau pesan uji ke nomor WhatsApp terdaftar whitelist
        </p>

        {dispatchStatus && (
          <div className="mb-3 p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            {dispatchStatus}
          </div>
        )}

        <form onSubmit={handleTestDispatch} className="flex gap-2">
          <input
            type="text"
            value={testMsg}
            onChange={(e) => setTestMsg(e.target.value)}
            placeholder="Ketik pesan tes atau instruksi untuk bot WhatsApp..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#8B6914]"
          />
          <button
            type="submit"
            disabled={dispatching}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8B6914] text-white hover:bg-[#6B5010] rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RiSendPlaneLine size={14} className={dispatching ? "animate-pulse" : ""} />
            <span>{dispatching ? "Mengirim..." : "Kirim Sekarang"}</span>
          </button>
        </form>
      </div>

      {/* Riwayat Interaksi Chat & Tool Calling */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Riwayat Audit Chat &amp; Tool Calling n8n
        </h3>

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
                  Eksekusi Tool: {log.toolCalled}
                </div>
                <p className="text-gray-700 leading-relaxed">{log.responseSummary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
