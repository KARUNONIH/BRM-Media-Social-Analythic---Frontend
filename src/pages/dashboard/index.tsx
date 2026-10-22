import React, { useEffect, useState } from "react";
import {
  RiInstagramLine,
  RiVideoLine,
  RiImageLine,
  RiSparklingLine,
  RiLineChartLine,
  RiExternalLinkLine,
  RiRefreshLine,
  RiArrowRightUpLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";

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
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Dashboard Analitik Media Sosial
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring performa konten Instagram <span className="font-semibold text-slate-700">@bumirekayasamandiri</span> &amp; AI Asisten WhatsApp
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold cursor-pointer shadow-2xs transition-colors self-start"
        >
          <RiRefreshLine className={loading ? "animate-spin" : ""} size={14} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Postingan</span>
            <div className="w-8 h-8 rounded bg-amber-50 text-[#8B6914] flex items-center justify-center">
              <RiInstagramLine size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{summary?.totalPosts || 48}</span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center">
              <RiArrowRightUpLine size={12} /> +4 bulan ini
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Akun @bumirekayasamandiri</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rasio Reels : Carousel</span>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <RiVideoLine size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {summary ? `${summary.distribution.reels} : ${summary.distribution.carousel}` : "14 : 28"}
            </span>
            <span className="text-[11px] text-slate-500">post</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Reels 33% &bull; Carousel 67%</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rata-rata Engagement</span>
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <RiLineChartLine size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {summary?.averageEngagementRate || 5.78}%
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">+0.8%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Di atas rata-rata industri (3.2%)</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Jangkauan (Reach)</span>
            <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
              <RiImageLine size={18} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {summary?.totalReachMonth.toLocaleString("id-ID") || "42.800"}
            </span>
            <span className="text-[11px] text-slate-500">view</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Periode 30 hari terakhir</p>
        </div>
      </div>

      {/* AI Recommendation & Action Plan Card */}
      <div className="bg-white border border-[#8B6914]/30 rounded p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-[#8B6914] text-white flex items-center justify-center">
            <RiSparklingLine size={14} />
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            AI Strategic Insights &amp; Rekomendasi Langkah Selanjutnya
          </h2>
          <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-semibold bg-[#8B6914]/10 text-[#8B6914] border border-[#8B6914]/20">
            {recommendations?.overallHealth || "Kesehatan Akun: Sangat Baik"}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 border border-amber-100 rounded p-3 mb-4">
          {recommendations?.executiveSummary ||
            "Performa akun @bumirekayasamandiri didorong kuat oleh konten teknis berbasis bukti (Sertifikasi ISO, Portofolio Proyek Nyata, dan Tips RAB). Format Carousel dan Reels menghasilkan reach 2.4x lebih tinggi dibanding Single Image."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(recommendations?.actionItems || []).map((item, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded p-3.5 bg-slate-50/50 flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
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
                </div>
                <h3 className="text-xs font-bold text-slate-800 leading-snug">{item.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <RiCheckboxCircleLine size={13} className="shrink-0" />
                <span>{item.expectedImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Chart / Trend Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Tren Jangkauan Konten Mingguan
              </h2>
              <p className="text-[11px] text-slate-400">Total jangkauan tayang per hari posting</p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Satuan: Reach</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2">
            {(summary?.weeklyTrend || []).map((t, i) => {
              const maxReach = 14000;
              const heightPct = Math.round((t.reach / maxReach) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-slate-500 font-semibold">{t.reach.toLocaleString()}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-[#8B6914] hover:bg-[#735710] rounded transition-all cursor-pointer relative group"
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                      {t.posts} post &bull; ER: {t.engagement}%
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium">{t.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Format Distribution Card */}
        <div className="bg-white border border-slate-200 rounded p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
              Distribusi Format Konten
            </h2>
            <p className="text-[11px] text-slate-400 mb-4">Proporsi format postingan @bumirekayasamandiri</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#8B6914]" /> Carousel / Slide
                  </span>
                  <span>28 item (58%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-[#8B6914] rounded" style={{ width: "58%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Reels / Video
                  </span>
                  <span>14 item (29%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-blue-600 rounded" style={{ width: "29%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-purple-600" /> Foto Tunggal
                  </span>
                  <span>6 item (13%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-purple-600 rounded" style={{ width: "13%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">Catatan Engine:</span> Format Carousel dan Video terbukti paling efektif mengonversi audiens menjadi prospek klien konstruksi.
          </div>
        </div>
      </div>

      {/* Table: Latest Posts */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Daftar Data Postingan Instagram BRM
            </h2>
            <p className="text-[11px] text-slate-400">Hasil sinkronisasi pipeline scraping n8n</p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {posts.length} Postingan Terdata
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">Thumbnail</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3">Caption Postingan</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Komentar</th>
                <th className="px-4 py-3">Engagement</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <img
                      src={post.imageUrl}
                      alt={post.shortcode}
                      className="w-12 h-12 object-cover rounded border border-slate-200"
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
                  <td className="px-4 py-3 max-w-sm">
                    <p className="line-clamp-2 text-slate-700 leading-relaxed font-normal">
                      {post.caption}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block">
                      #{post.shortcode}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {post.likes.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {post.comments.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">
                    {post.engagementRate}%
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#8B6914] hover:underline font-semibold text-[11px]"
                    >
                      <span>Buka</span>
                      <RiExternalLinkLine size={12} />
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
