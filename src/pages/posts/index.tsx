import React, { useEffect, useState, useMemo } from "react";
import {
  RiExternalLinkLine,
  RiSearchLine,
  RiFilter3Line,
  RiTimeLine,
  RiDownloadLine,
  RiCloseLine,
  RiHeartLine,
  RiChat3Line,
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

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
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

  useEffect(() => {
    fetch(`${apiUrl}/posts`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setPosts(res.data);
      })
      .catch(() => {});
  }, [apiUrl]);

  const categories = [
    "ALL",
    "Fabrikasi Baja",
    "Renovasi Pabrik",
    "MEP & Proteksi Petir",
    "K3 & Mutu ISO",
    "Perencanaan BIM",
  ];

  const filteredPosts = posts.filter((p) => {
    const matchSearch =
      p.caption.toLowerCase().includes(search.toLowerCase()) ||
      p.shortcode.toLowerCase().includes(search.toLowerCase());
    const matchType =
      filterType === "ALL" ||
      (filterType === "REEL" && (p.type.includes("Reel") || p.type.includes("Video"))) ||
      (filterType === "CAROUSEL" && (p.type.includes("Carousel") || p.type.includes("Post")));
    const matchCat = filterCategory === "ALL" || p.category === filterCategory;
    return matchSearch && matchType && matchCat;
  });

  const handleDownloadCsv = () => {
    window.open(`${apiUrl}/posts/export`, "_blank");
  };

  return (
    <div className="space-y-4">
      <PageHeaderOrganism
        prefix="Data"
        title="Postingan Media Sosial BRM"
        subtitle={`${timeStr} • ${dateStr} • Arsip Konten Instagram & Metrik Interaksi`}
        subtitleIcon={<RiTimeLine size={14} />}
        showBack={true}
        backPath="/dashboard"
        actions={
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B6914] text-white hover:bg-[#6B5010] rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RiDownloadLine size={14} />
            <span>Download Rekap (.csv)</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 shadow shadow-gray-300 rounded border border-gray-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari caption atau shortcode..."
            className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#8B6914]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Format Filter */}
          <div className="flex items-center gap-1">
            <RiFilter3Line className="text-gray-400" size={14} />
            {(["ALL", "CAROUSEL", "REEL"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  filterType === t
                    ? "bg-[#8B6914] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t === "ALL" ? "Semua Format" : t === "CAROUSEL" ? "Carousel" : "Reels"}
              </button>
            ))}
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1 border border-gray-200 rounded text-xs text-gray-700 bg-white font-medium focus:outline-none focus:border-[#8B6914]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "Semua Kategori Layanan" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Post Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="bg-white border border-gray-200 rounded overflow-hidden shadow shadow-gray-200 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.shortcode}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                      post.type.includes("Reel") || post.type.includes("Video")
                        ? "bg-blue-600 text-white"
                        : "bg-[#8B6914] text-white"
                    }`}
                  >
                    {post.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white">
                    {post.category || "Konstruksi"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-800 line-clamp-3 leading-relaxed font-medium">
                  {post.caption}
                </p>
                <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-600 font-semibold">
                  <span className="inline-flex items-center gap-1.5 text-rose-600">
                    <RiHeartLine size={14} />
                    <span className="text-gray-700">{post.likes.toLocaleString()} Likes</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-blue-600">
                    <RiChat3Line size={14} />
                    <span className="text-gray-700">{post.comments.toLocaleString()} Komentar</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-[11px]">
              <span className="text-gray-400 font-mono">
                {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="text-[#8B6914] font-semibold group-hover:underline">
                Lihat Detail &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Postingan */}
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
                    #{selectedPost.shortcode}
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
