import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiInstagramLine,
  RiVideoLine,
  RiImageLine,
  RiSparklingLine,
  RiLineChartLine,
  RiExternalLinkLine,
  RiArrowRightLine,
  RiWhatsappLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiRefreshLine,
} from "react-icons/ri";
import { PageHeaderOrganism } from "../../components/common/PageHeaderOrganism";

interface PostItem {
  id: string;
  shortcode: string;
  type: string;
  caption: string;
  postUrl: string;
  imageUrl: string;
  likes: number;
  comments: number;
  reach: number;
  engagementRate: number;
  publishedAt: string;
}

interface AnalyticsSummary {
  account: string;
  totalPosts: number;
  totalFollowers: number;
  averageEngagementRate: number;
  totalReachMonth: number;
  distribution: {
    carousel: number;
    reels: number;
    singleImage: number;
  };
  weeklyTrend: { day: string; posts: number; reach: number; engagement: number }[];
}

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

export const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const { timeStr, dateStr } = useMemo(() => {
    const now = new Date();
    return {
      timeStr: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dateStr: now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resPosts, resSum, resRec] = await Promise.all([
        fetch(`${apiUrl}/posts`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${apiUrl}/analytics/summary`).then((r) => r.json()).catch(() => ({ data: null })),
        fetch(`${apiUrl}/analytics/recommendations`).then((r) => r.json()).catch(() => ({ data: null })),
      ]);

      if (resPosts.data) setPosts(resPosts.data);
      if (resSum.data) setSummary(resSum.data);
      if (resRec.data) setRecommendations(resRec.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      label: "Rata-rata Engagement",
      value: `${summary?.averageEngagementRate || 5.78}%`,
      sub: "interaksi per konten",
      icon: <RiLineChartLine size={16} />,
      bg: "bg-green-50",
      border: "border-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Jangkauan Bulanan",
      value: summary?.totalReachMonth.toLocaleString("id-ID") || "42.800",
      sub: "tayangan 30 hari terakhir",
      icon: <RiImageLine size={16} />,
      bg: "bg-purple-50",
      border: "border-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. UNIFIED PAGE HEADER */}
      <PageHeaderOrganism
        prefix="Dashboard"
        title="Bumi Rekayasa Mandiri"
        subtitle={`${timeStr} • ${dateStr} • Analitik Konten & Otomasi Asisten WhatsApp`}
        subtitleIcon={<RiTimeLine size={14} />}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:border-[#8B6914] hover:text-[#8B6914] rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RiRefreshLine size={14} className={loading ? "animate-spin" : ""} />
              <span>Segarkan</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/posts")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B6914] text-white hover:bg-[#6B5010] rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RiInstagramLine size={14} />
              <span>Data Postingan</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/recommendations")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:border-[#8B6914] hover:text-[#8B6914] rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RiSparklingLine size={14} />
              <span>Rekomendasi AI</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/bot-logs")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:border-[#8B6914] hover:text-[#8B6914] rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RiWhatsappLine size={14} />
              <span>Log Bot WA</span>
            </button>
          </div>
        }
      />

      {/* 2. QUICK ACTION BANNERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          onClick={() => navigate("/dashboard/posts")}
          className="bg-gradient-to-r from-amber-50 via-white to-amber-50/40 p-4 rounded border border-amber-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#8B6914]/10 text-[#8B6914] flex items-center justify-center shrink-0">
              <RiLineChartLine size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Analisis Kinerja Konten Instagram
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Daftar postingan, engagement rate, dan statistik reach real-time.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-[#8B6914] shrink-0">
            <RiArrowRightLine size={16} />
          </div>
        </div>

        <div
          onClick={() => navigate("/dashboard/bot-logs")}
          className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 p-4 rounded border border-emerald-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
              <RiWhatsappLine size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                WhatsApp Bot AI Assistant
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Audit riwayat interaksi, ekspor rekap Excel, dan status pipeline n8n.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 shrink-0">
            <RiArrowRightLine size={16} />
          </div>
        </div>
      </div>

      {/* 3. UNIFIED STATISTIK RINGKAS CARD */}
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

      {/* 4. AI STRATEGIC RECOMMENDATION CARD */}
      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#8B6914] text-white flex items-center justify-center">
              <RiSparklingLine size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                AI Strategic Insights &amp; Rekomendasi Langkah Selanjutnya
              </h2>
              <p className="text-xs text-gray-500">
                Evaluasi performa berkala untuk Owner &amp; Manajemen BRM
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            {recommendations?.overallHealth || "Status: Optimal"}
          </span>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed bg-amber-50/60 border border-amber-200/60 rounded p-4">
          {recommendations?.executiveSummary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {(recommendations?.actionItems || []).map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded p-4 bg-gray-50/50 flex flex-col justify-between space-y-2 hover:bg-white transition-all shadow-2xs"
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
                <h4 className="text-xs font-bold text-gray-800 mt-2 leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200/60 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                <RiCheckboxCircleLine size={13} className="shrink-0" />
                <span>{item.expectedImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. VISUAL CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tren Jangkauan Mingguan */}
        <div className="lg:col-span-2 bg-white shadow shadow-gray-300 rounded overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Tren Jangkauan Konten Mingguan
              </h2>
              <p className="text-xs text-gray-500">Total jangkauan tayang per hari posting</p>
            </div>
            <span className="text-xs text-gray-400 font-medium">Satuan: Reach</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2">
            {(summary?.weeklyTrend || []).map((t, i) => {
              const maxReach = 14000;
              const heightPct = Math.round((t.reach / maxReach) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-gray-500 font-semibold">{t.reach.toLocaleString()}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-[#8B6914] hover:bg-[#6B5010] rounded transition-all cursor-pointer relative group"
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                      {t.posts} post &bull; ER: {t.engagement}%
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{t.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribusi Format Konten */}
        <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-1">
              Distribusi Format Konten
            </h2>
            <p className="text-xs text-gray-500 mb-4">Proporsi format konten Instagram BRM</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#8B6914]" /> Carousel / Slide
                  </span>
                  <span>28 item (58%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-[#8B6914] rounded" style={{ width: "58%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Reels / Video
                  </span>
                  <span>14 item (29%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-blue-600 rounded" style={{ width: "29%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-purple-600" /> Foto Tunggal
                  </span>
                  <span>6 item (13%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-purple-600 rounded" style={{ width: "13%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900">
            <span className="font-bold">Insight Format:</span> Video Reels menghasilkan jangkauan audiens baru tertinggi (+35%).
          </div>
        </div>
      </div>

      {/* 6. TABEL POSTINGAN TERAKHIR */}
      <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Daftar Postingan Terkini
            </h2>
            <p className="text-xs text-gray-500">Data postingan hasil ekstraksi otomatis n8n</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/posts")}
            className="text-xs text-[#8B6914] font-semibold hover:underline cursor-pointer"
          >
            Lihat Semua Postingan &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3">Thumbnail</th>
                <th className="px-5 py-3">Tipe</th>
                <th className="px-5 py-3">Caption Konten</th>
                <th className="px-5 py-3">Likes</th>
                <th className="px-5 py-3">Komentar</th>
                <th className="px-5 py-3">Engagement</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3 text-right">Tautan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.slice(0, 5).map((post) => (
                <tr key={post.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <img
                      src={post.imageUrl}
                      alt={post.shortcode}
                      className="w-12 h-12 object-cover rounded border border-gray-200"
                    />
                  </td>
                  <td className="px-5 py-3.5">
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
                  <td className="px-5 py-3.5 max-w-sm">
                    <p className="line-clamp-2 text-gray-800 leading-relaxed font-medium">
                      {post.caption}
                    </p>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 inline-block">
                      #{post.shortcode}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800">
                    {post.likes.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {post.comments.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-600">
                    {post.engagementRate}%
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#8B6914] hover:underline font-semibold"
                    >
                      <span>Lihat</span>
                      <RiExternalLinkLine size={13} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
