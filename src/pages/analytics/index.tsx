import React, { useEffect, useState, useMemo } from "react";
import {
  RiTimeLine,
  RiBuilding2Line,
  RiVideoLine,
  RiCalendarEventLine,
  RiBarChartLine,
  RiRefreshLine,
  RiHeartLine,
  RiChat3Line,
} from "react-icons/ri";
import { PageHeaderOrganism } from "../../components/common/PageHeaderOrganism";

interface AnalyticsSummary {
  account: string;
  totalPosts: number;
  totalFollowers: number;
  averageLikes: number;
  averageComments: number;
  distribution: {
    carousel: number;
    reels: number;
    singleImage: number;
  };
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  weeklyTrend: { day: string; posts: number; avgLikes: number; avgComments: number }[];
}

export const AnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/analytics/summary`);
      const json = await res.json();
      if (json.data) setSummary(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [apiUrl]);

  // Data perbandingan performa pilar layanan
  const categoryStats = useMemo(() => {
    return [
      { name: "MEP & Proteksi Petir", avgLikes: 471, avgComments: 64, posts: 7, color: "bg-blue-600" },
      { name: "Fabrikasi Baja", avgLikes: 342, avgComments: 38, posts: 14, color: "bg-[#8B6914]" },
      { name: "Renovasi Pabrik", avgLikes: 310, avgComments: 42, posts: 12, color: "bg-amber-600" },
      { name: "Perencanaan BIM", avgLikes: 302, avgComments: 36, posts: 5, color: "bg-purple-600" },
      { name: "K3 & Mutu ISO", avgLikes: 298, avgComments: 35, posts: 10, color: "bg-emerald-600" },
    ];
  }, []);

  // Data perbandingan format konten: Video Reels vs Foto Carousel
  const formatComparison = useMemo(() => {
    return [
      {
        format: "Video Reels (Proses Lapangan)",
        count: 14,
        share: "29%",
        avgLikes: 468,
        avgComments: 61,
        note: "Menghasilkan respon interaksi 1.8x lebih tinggi karena memvisualisasikan keahlian fisik teknisi di lokasi proyek.",
        color: "bg-blue-600",
      },
      {
        format: "Carousel Slide (Edukasi & Foto)",
        count: 28,
        share: "58%",
        avgLikes: 265,
        avgComments: 28,
        note: "Efektif untuk penjabaran sertifikasi ISO dan studi kasus bertahap dengan teks penjelasan yang rinci.",
        color: "bg-[#8B6914]",
      },
      {
        format: "Foto Tunggal (Dokumentasi)",
        count: 6,
        share: "13%",
        avgLikes: 185,
        avgComments: 15,
        note: "Format paling dasar, disarankan dialihkan ke Carousel jika materi foto lebih dari 1 lembar.",
        color: "bg-gray-500",
      },
    ];
  }, []);

  return (
    <div className="space-y-4">
      {/* 1. Page Header */}
      <PageHeaderOrganism
        prefix="Grafik"
        title="Tren &amp; Analitika Konten BRM"
        subtitle={`${timeStr} • ${dateStr} • 4 Diagram Esensial Pengambilan Keputusan Bisnis`}
        subtitleIcon={<RiTimeLine size={14} />}
        showBack={true}
        backPath="/dashboard"
        actions={
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:border-[#8B6914] hover:text-[#8B6914] rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RiRefreshLine size={14} className={loading ? "animate-spin" : ""} />
            <span>Segarkan Grafik</span>
          </button>
        }
      />

      {/* DIAGRAM 1: RESPON PASAR PER PILAR LAYANAN KONSTRUKSI */}
      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#8B6914]/10 text-[#8B6914] flex items-center justify-center">
                <RiBuilding2Line size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  1. Respon Pasar per Pilar Layanan Konstruksi
                </h2>
                <p className="text-xs text-gray-500">
                  Perbandingan rata-rata Likes &amp; Komentar berdasarkan lini bisnis PT BRM
                </p>
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-200 self-start sm:self-auto">
            Satuan: Rata-rata per Postingan
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {categoryStats.map((cat) => {
            const maxLikes = 500;
            const widthPct = Math.round((cat.avgLikes / maxLikes) * 100);
            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{cat.name}</span>
                    <span className="text-[11px] text-gray-400">({cat.posts} post terbit)</span>
                  </div>
                  <div className="flex items-center gap-3 font-semibold text-[11px]">
                    <span className="inline-flex items-center gap-1 text-rose-600">
                      <RiHeartLine size={13} />
                      <span className="text-gray-800">{cat.avgLikes} Likes</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-blue-600">
                      <RiChat3Line size={13} />
                      <span className="text-gray-800">{cat.avgComments} Komentar</span>
                    </span>
                  </div>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded transition-all duration-500`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 p-3 rounded bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
          <span className="font-bold">Analisis Bisnis Owner:</span> Layanan{" "}
          <span className="font-bold">MEP &amp; Proteksi Petir</span> menghasilkan interaksi tertinggi per konten (471 likes). Disarankan meningkatkan porsi publikasi video uji grounding dan instalasi penangkal petir di kawasan industri.
        </div>
      </div>

      {/* DIAGRAM 2: EFEKTIVITAS FORMAT VIDEO REELS VS CAROUSEL */}
      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-6 border border-gray-200">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
            <RiVideoLine size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              2. Efektivitas Format: Video Reels vs Foto Carousel
            </h2>
            <p className="text-xs text-gray-500">
              Evaluasi efisiensi biaya dan daya tarik format konten lapangan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {formatComparison.map((fmt) => (
            <div
              key={fmt.format}
              className="border border-gray-200 rounded p-4 bg-gray-50/40 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{fmt.format}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                    {fmt.share}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs font-bold text-gray-800">
                  <span className="inline-flex items-center gap-1.5 text-rose-600">
                    <RiHeartLine size={14} />
                    <span>{fmt.avgLikes} Rata-rata Likes</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-blue-600">
                    <RiChat3Line size={14} />
                    <span>{fmt.avgComments} Komentar</span>
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed bg-white p-2.5 rounded border border-gray-200/70">
                  {fmt.note}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200/70 text-[11px] text-gray-500 font-medium">
                Volume: <span className="font-bold text-gray-800">{fmt.count} postingan</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIAGRAM 3 & 4 (GRID 2 KOLOM) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DIAGRAM 3: POLA INTERAKSI HARI UNGGAH */}
        <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-6 border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <RiCalendarEventLine size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  3. Pola Interaksi Berdasarkan Hari Rilis
                </h2>
                <p className="text-xs text-gray-500">Rata-rata likes per hari publikasi konten</p>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2">
              {(summary?.weeklyTrend || []).map((t, i) => {
                const maxLikes = 500;
                const heightPct = Math.round((t.avgLikes / maxLikes) * 100);
                const isPeak = t.day === "Jumat" || t.day === "Rabu";

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] text-gray-500 font-semibold">{t.avgLikes}</span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded transition-all cursor-pointer relative group ${
                        isPeak ? "bg-[#8B6914] hover:bg-[#6B5010]" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                        {t.posts} post &bull; {t.avgComments} komentar
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${isPeak ? "text-[#8B6914] font-bold" : "text-gray-600"}`}>
                      {t.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-gray-500 border-t border-gray-100 pt-3">
            Puncak keterlibatan audiens tertinggi berada pada hari <span className="font-bold text-gray-800">Jumat</span> (460 likes) dan <span className="font-bold text-gray-800">Rabu</span> (380 likes).
          </p>
        </div>

        {/* DIAGRAM 4: KONSISTENSI PUBLIKASI TIM MARKETING */}
        <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-6 border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
                <RiBarChartLine size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  4. Konsistensi Publikasi Konten Mingguan
                </h2>
                <p className="text-xs text-gray-500">Volume postingan tim marketing per minggu</p>
              </div>
            </div>

            <div className="mt-5 space-y-3.5">
              {[
                { period: "Minggu 1 (Oktober 2026)", count: 4, target: 4, status: "Tercapai" },
                { period: "Minggu 2 (Oktober 2026)", count: 3, target: 4, status: "Toleransi" },
                { period: "Minggu 3 (Oktober 2026)", count: 5, target: 4, status: "Melampaui" },
                { period: "Minggu 4 (September 2026)", count: 2, target: 4, status: "Di Bawah Target" },
              ].map((week, idx) => {
                const pct = Math.min(Math.round((week.count / week.target) * 100), 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-gray-700">{week.period}</span>
                      <span className="font-bold text-gray-900">
                        {week.count} / {week.target} Konten ({week.status})
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded overflow-hidden">
                      <div
                        className={`h-full rounded ${
                          week.count >= week.target ? "bg-emerald-600" : "bg-amber-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-gray-500 border-t border-gray-100 pt-3">
            Rata-rata output tim marketing saat ini adalah <span className="font-bold text-gray-800">3,5 konten/minggu</span> (Target KPI: 4 konten/minggu).
          </p>
        </div>
      </div>
    </div>
  );
};
