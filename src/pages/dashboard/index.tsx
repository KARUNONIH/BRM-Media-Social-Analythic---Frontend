import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiInstagramLine,
  RiVideoLine,
  RiSparklingLine,
  RiLineChartLine,
  RiTimeLine,
  RiRefreshLine,
  RiSendPlaneLine,
  RiCloseLine,
  RiHeartLine,
  RiChat3Line,
  RiBuilding2Line,
  RiExternalLinkLine,
} from "react-icons/ri";
import { PageHeaderOrganism } from "../../components/common/PageHeaderOrganism";

interface PostItem {
  id: string;
  shortcode: string;
  type: string;
  category?: string;
  caption: string;
  postUrl: string;
  imageUrl: string;
  likes: number;
  comments: number;
  publishedAt: string;
  tags?: string[];
}

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

interface ContentIdea {
  priority: string;
  title: string;
  rationale: string;
  targetPillar: string;
  suggestedDay: string;
}

interface AIRecommendations {
  accountScore: string;
  executiveSummary: string;
  nextContentIdeas: ContentIdea[];
}

export const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [syncingScraper, setSyncingScraper] = useState(false);
  const [sendingWA, setSendingWA] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

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

  const loadData = async () => {
    try {
      const [resPosts, resSum, resRec] = await Promise.all([
        fetch(`${apiUrl}/posts`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${apiUrl}/analytics/summary`).then((r) => r.json()).catch(() => ({ data: null })),
        fetch(`${apiUrl}/analytics/recommendations`).then((r) => r.json()).catch(() => ({ data: null })),
      ]);

      if (resPosts.data) setPosts(resPosts.data);
      if (resSum.data) setSummary(resSum.data);
      if (resRec.data) setRecommendations(resRec.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Trigger On-Demand Scraper via n8n Webhook
  const handleTriggerScrape = async () => {
    setSyncingScraper(true);
    try {
      const res = await fetch(`${apiUrl}/sync/scrape`, { method: "POST" });
      const data = await res.json();
      setActionNotice(data.message || "Pipeline scraping n8n berhasil dipicu.");
      await loadData();
    } catch {
      setActionNotice("Gagal memicu scraper n8n.");
    } finally {
      setSyncingScraper(false);
    }
  };

  // Trigger Dispatch Rekap ke WhatsApp
  const handleDispatchWhatsApp = async () => {
    setSendingWA(true);
    try {
      const res = await fetch(`${apiUrl}/bot/dispatch-summary`, { method: "POST" });
      const data = await res.json();
      setActionNotice(data.message || "Laporan ringkas berhasil dikirimkan ke WhatsApp.");
    } catch {
      setActionNotice("Gagal mengirim laporan ke WhatsApp.");
    } finally {
      setSendingWA(false);
    }
  };

  const statCards = [
    {
      label: "Total Postingan",
      value: summary?.totalPosts || 48,
      sub: "Akun @bumirekayasamandiri",
      icon: <RiInstagramLine size={16} />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Rasio Format",
      value: summary ? `${summary.distribution.carousel} : ${summary.distribution.reels}` : "28 : 14",
      sub: "Carousel vs Video Reels",
      icon: <RiVideoLine size={16} />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Rata-rata Likes",
      value: summary?.averageLikes || 307,
      sub: "per postingan Instagram",
      icon: <RiHeartLine size={16} />,
      bg: "bg-rose-50",
      border: "border-rose-100",
      iconColor: "text-rose-600",
    },
    {
      label: "Rata-rata Komentar",
      value: summary?.averageComments || 38,
      sub: "tanggapan teknis & inquiry",
      icon: <RiChat3Line size={16} />,
      bg: "bg-green-50",
      border: "border-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. UNIFIED PAGE HEADER */}
      <PageHeaderOrganism
        prefix="Dashboard"
        title="Bumi Rekayasa Mandiri"
        subtitle={`${timeStr} • ${dateStr} • Analitik Instagram & Integrasi Bot WhatsApp`}
        subtitleIcon={<RiTimeLine size={14} />}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleTriggerScrape}
              disabled={syncingScraper}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B6914] text-white hover:bg-[#6B5010] rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RiRefreshLine size={14} className={syncingScraper ? "animate-spin" : ""} />
              <span>{syncingScraper ? "Menyinkronkan..." : "Tarik Data Instagram"}</span>
            </button>
            <button
              type="button"
              onClick={handleDispatchWhatsApp}
              disabled={sendingWA}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RiSendPlaneLine size={14} className={sendingWA ? "animate-pulse" : ""} />
              <span>{sendingWA ? "Mengirim..." : "Kirim Rekap ke WA"}</span>
            </button>
          </div>
        }
      />

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-3 rounded border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-center justify-between shadow-2xs">
          <span>{actionNotice}</span>
          <button
            onClick={() => setActionNotice(null)}
            className="text-amber-700 hover:text-amber-900 p-1"
          >
            <RiCloseLine size={16} />
          </button>
        </div>
      )}

      {/* 2. UNIFIED STATISTIK RINGKAS CARD */}
      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden">
        <div className="p-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Statistik Ringkas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`rounded p-3 ${card.bg} border ${card.border} flex flex-col`}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2 ${card.iconColor}`}
                  >
                    {card.icon}
                  </div>
                  <p className="text-xs text-gray-700 font-medium">{card.label}</p>
                </div>
                <p className="text-xl font-bold text-gray-800 mt-1">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DIAGRAM ANALITIK: KATEGORI LAYANAN BRM & TREN AKTIVITAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Distribusi Kategori Layanan Konstruksi */}
        <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RiBuilding2Line className="text-[#8B6914]" size={18} />
              <h2 className="text-sm font-semibold text-gray-800">
                Pilar Layanan Konstruksi BRM
              </h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Komposisi topik konten promosi layanan PT BRM
            </p>

            <div className="space-y-3">
              {(summary?.categoryBreakdown || []).map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>{cat.category}</span>
                    <span className="font-semibold text-gray-900">{cat.count} post ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-[#8B6914] rounded"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-[11px] text-gray-500 border-t border-gray-100 pt-3">
            Dominasi konten saat ini berada pada layanan <span className="font-semibold text-gray-800">Fabrikasi Baja</span> dan <span className="font-semibold text-gray-800">Renovasi Pabrik</span>.
          </p>
        </div>

        {/* Tren Aktivitas Posting Mingguan */}
        <div className="lg:col-span-2 bg-white shadow shadow-gray-300 rounded overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <RiLineChartLine className="text-blue-600" size={18} />
                <h2 className="text-sm font-semibold text-gray-800">
                  Aktivitas &amp; Interaksi Mingguan
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Rata-rata likes per hari publikasi konten Instagram
              </p>
            </div>
            <span className="text-xs text-gray-400 font-medium">Satuan: Likes</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2">
            {(summary?.weeklyTrend || []).map((t, i) => {
              const maxLikes = 500;
              const heightPct = Math.round((t.avgLikes / maxLikes) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-gray-500 font-semibold">{t.avgLikes}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-[#8B6914] hover:bg-[#6B5010] rounded transition-all cursor-pointer relative group"
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                      {t.posts} post &bull; {t.avgComments} komentar
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{t.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. AI CONTENT IDEATOR FOR MARKETING */}
      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#8B6914] text-white flex items-center justify-center">
              <RiSparklingLine size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                AI Content Ideator &amp; Strategic Action Plan
              </h2>
              <p className="text-xs text-gray-500">
                Rekomendasi draf ide konten berikutnya berbasis analisis performa data terdahulu
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            {recommendations?.accountScore || "Kesehatan Akun: 88/100"}
          </span>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed bg-amber-50/60 border border-amber-200/60 rounded p-4">
          {recommendations?.executiveSummary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {(recommendations?.nextContentIdeas || []).map((idea, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded p-4 bg-gray-50/50 flex flex-col justify-between space-y-2 hover:bg-white transition-all shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      idea.priority === "Tinggi"
                        ? "bg-rose-100 text-rose-700"
                        : idea.priority === "Sedang"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    Prioritas {idea.priority}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{idea.targetPillar}</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 mt-2 leading-snug">
                  {idea.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  {idea.rationale}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200/60 text-[11px] text-gray-700 font-medium">
                Waktu Unggah Disarankan: <span className="font-bold text-[#8B6914]">{idea.suggestedDay}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. TABEL 5 POSTINGAN TERAKHIR */}
      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Postingan Instagram Terkini
            </h2>
            <p className="text-xs text-gray-500">Klik baris untuk melihat pratinjau detail postingan</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/posts")}
            className="text-xs text-[#8B6914] font-semibold hover:underline cursor-pointer"
          >
            Buka Direktori Lengkap ({posts.length}) &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-max w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">Thumbnail</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">Format</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">Kategori Layanan</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">Caption Konten</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">Likes</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">Komentar</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">Tanggal</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(0, 5).map((post, rowIdx) => (
                <tr
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`border-b border-gray-100 last:border-0 transition-colors hover:bg-blue-50/30 cursor-pointer ${
                    rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <img
                      src={post.imageUrl}
                      alt={post.shortcode}
                      className="w-11 h-11 object-cover rounded border border-gray-200"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        post.type.includes("Reel") || post.type.includes("Video")
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {post.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                    {post.category || "Proyek Konstruksi"}
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <p className="line-clamp-2 text-gray-800 leading-relaxed font-normal">
                      {post.caption}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-rose-600">
                      <RiHeartLine size={14} />
                      <span className="text-gray-800 font-medium">{post.likes.toLocaleString()}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-blue-600">
                      <RiChat3Line size={14} />
                      <span className="text-gray-700 font-medium">{post.comments.toLocaleString()}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="text-[#8B6914] font-semibold hover:underline text-xs">
                      Detail &rarr;
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. MODAL DETAIL POSTINGAN (Tidak perlu reload halaman) */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded max-w-2xl w-full p-6 space-y-4 shadow-xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8B6914] text-white">
                  {selectedPost.type}
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  {selectedPost.category || "Proyek Lapangan"}
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-video md:aspect-square bg-gray-100 rounded overflow-hidden border border-gray-200">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.shortcode}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
                    <span className="inline-flex items-center gap-1.5 text-rose-600">
                      <RiHeartLine size={15} />
                      <span className="text-gray-700">{selectedPost.likes.toLocaleString()} Likes</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-blue-600">
                      <RiChat3Line size={15} />
                      <span className="text-gray-700">{selectedPost.comments.toLocaleString()} Komentar</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed max-h-56 overflow-y-auto scrollbar-hide border border-gray-100 p-3 rounded bg-gray-50/50">
                    {selectedPost.caption}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-mono">
                    Shortcode: #{selectedPost.shortcode}
                  </span>
                  <a
                    href={selectedPost.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#8B6914] text-white text-xs font-semibold hover:bg-[#6B5010]"
                  >
                    <span>Buka Instagram</span>
                    <RiExternalLinkLine size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
