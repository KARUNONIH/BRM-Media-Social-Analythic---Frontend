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
  RiLayoutGridLine,
  RiTableLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiInboxLine,
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
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "likes" | "comments">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
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

  // 1. Filtered and Sorted Data
  const processedPosts = useMemo(() => {
    const filtered = posts.filter((p) => {
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

    return filtered.sort((a, b) => {
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "comments") return b.comments - a.comments;
      if (sortBy === "oldest") return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [posts, search, filterType, filterCategory, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType, filterCategory, sortBy, pageSize]);

  // 2. Pagination Calculations
  const totalItems = processedPosts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = processedPosts.slice(startIndex, startIndex + pageSize);

  const handleDownloadCsv = () => {
    window.open(`${apiUrl}/posts/export`, "_blank");
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilterType("ALL");
    setFilterCategory("ALL");
    setSortBy("newest");
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <PageHeaderOrganism
        prefix="Data"
        title="Postingan Media Sosial BRM"
        subtitle={`${timeStr} • ${dateStr} • Direktori Lengkap & Pengurutan Interaksi`}
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

      {/* Control Bar: Search, Filters, Sorting, and View Toggle */}
      <div className="bg-white p-4 shadow shadow-gray-300 rounded border border-gray-200 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari caption atau shortcode..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#8B6914]"
            />
          </div>

          {/* Filters, Sorting, View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 justify-between lg:justify-end">
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

            {/* Category Dropdown */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1 border border-gray-200 rounded text-xs text-gray-700 bg-white font-medium focus:outline-none focus:border-[#8B6914]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "Semua Kategori" : c}
                </option>
              ))}
            </select>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 border-l border-gray-200 pl-2.5">
              <RiArrowUpDownLine className="text-gray-400" size={14} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 border border-gray-200 rounded text-xs text-gray-700 bg-white font-medium focus:outline-none focus:border-[#8B6914]"
              >
                <option value="newest">Terbaru</option>
                <option value="likes">Likes Terbanyak</option>
                <option value="comments">Komentar Terbanyak</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>

            {/* Grid vs Table View Mode Switcher */}
            <div className="flex items-center border border-gray-200 rounded overflow-hidden p-0.5 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  setViewMode("grid");
                  setPageSize(6);
                }}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-[#8B6914] shadow-xs font-bold" : "text-gray-400 hover:text-gray-700"
                }`}
                title="Tampilan Grid"
              >
                <RiLayoutGridLine size={15} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("table");
                  setPageSize(10);
                }}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === "table" ? "bg-white text-[#8B6914] shadow-xs font-bold" : "text-gray-400 hover:text-gray-700"
                }`}
                title="Tampilan Tabel"
              >
                <RiTableLine size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Text & Active Filter Badges */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
          <div>
            Menampilkan <span className="font-semibold text-gray-800">{totalItems > 0 ? startIndex + 1 : 0}</span> -{" "}
            <span className="font-semibold text-gray-800">{Math.min(startIndex + pageSize, totalItems)}</span> dari{" "}
            <span className="font-semibold text-gray-800">{totalItems}</span> postingan terdata
          </div>
          {(search || filterType !== "ALL" || filterCategory !== "ALL" || sortBy !== "newest") && (
            <button
              onClick={handleResetFilters}
              className="text-[#8B6914] hover:underline font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {paginatedPosts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded border border-gray-200 p-12 text-center shadow-xs shadow-gray-200">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-3">
            <RiInboxLine size={24} />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Tidak ada postingan yang sesuai</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Tidak ditemukan konten dengan filter atau kata kunci pencarian yang Anda masukkan.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-3 py-1.5 bg-[#8B6914] text-white hover:bg-[#6B5010] rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            Bersihkan Filter
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* 1. Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedPosts.map((post) => (
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
      ) : (
        /* 2. Compact Table Mode */
        <div className="bg-white shadow shadow-gray-300 rounded overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Thumbnail</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Caption Konten</th>
                  <th className="px-4 py-3">Likes</th>
                  <th className="px-4 py-3">Komentar</th>
                  <th className="px-4 py-3">Tanggal Terbit</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedPosts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="hover:bg-amber-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2.5">
                      <img
                        src={post.imageUrl}
                        alt={post.shortcode}
                        className="w-10 h-10 object-cover rounded border border-gray-200"
                      />
                    </td>
                    <td className="px-4 py-2.5">
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
                    <td className="px-4 py-2.5 font-medium text-gray-700 whitespace-nowrap">
                      {post.category || "Proyek Lapangan"}
                    </td>
                    <td className="px-4 py-2.5 max-w-md">
                      <p className="line-clamp-2 text-gray-800 leading-relaxed font-normal">
                        {post.caption}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-gray-800">
                      <span className="inline-flex items-center gap-1 text-rose-600">
                        <RiHeartLine size={13} />
                        <span className="text-gray-800">{post.likes.toLocaleString()}</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      <span className="inline-flex items-center gap-1 text-blue-600">
                        <RiChat3Line size={13} />
                        <span className="text-gray-700">{post.comments.toLocaleString()}</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">
                      {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <span className="text-[#8B6914] font-semibold hover:underline text-[11px]">
                        Detail &rarr;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white p-3.5 shadow shadow-gray-200 rounded border border-gray-200 flex items-center justify-between text-xs">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded font-semibold border ${
              currentPage === 1
                ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <RiArrowLeftSLine size={16} />
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    currentPage === pageNum
                      ? "bg-[#8B6914] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded font-semibold border ${
              currentPage === totalPages
                ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <span>Selanjutnya</span>
            <RiArrowRightSLine size={16} />
          </button>
        </div>
      )}

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
