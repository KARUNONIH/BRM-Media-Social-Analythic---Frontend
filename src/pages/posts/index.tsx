import React, { useEffect, useState } from "react";
import { RiExternalLinkLine, RiSearchLine, RiFilter3Line } from "react-icons/ri";

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

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    fetch(`${apiUrl}/posts`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setPosts(res.data);
      })
      .catch(() => {});
  }, [apiUrl]);

  const filteredPosts = posts.filter((p) => {
    const matchSearch =
      p.caption.toLowerCase().includes(search.toLowerCase()) ||
      p.shortcode.toLowerCase().includes(search.toLowerCase());
    const matchType =
      filterType === "ALL" ||
      (filterType === "REEL" && (p.type.includes("Reel") || p.type.includes("Video"))) ||
      (filterType === "CAROUSEL" && (p.type.includes("Carousel") || p.type.includes("Post")));
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Data Postingan Media Sosial
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Eksplorasi seluruh konten terindeks dan metrik interaksi Instagram PT BRM
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari caption atau shortcode..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#8B6914]"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <RiFilter3Line className="text-slate-400" size={15} />
          <span className="text-xs text-slate-500 font-medium">Format:</span>
          {(["ALL", "CAROUSEL", "REEL"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                filterType === t
                  ? "bg-[#8B6914] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t === "ALL" ? "Semua" : t === "CAROUSEL" ? "Carousel" : "Reels"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Post Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-slate-200 rounded overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.shortcode}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                    post.type.includes("Reel") || post.type.includes("Video")
                      ? "bg-blue-600 text-white"
                      : "bg-[#8B6914] text-white"
                  }`}
                >
                  {post.type}
                </span>
              </div>

              <div className="p-4">
                <p className="text-xs text-slate-800 line-clamp-3 leading-relaxed font-medium">
                  {post.caption}
                </p>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                  <span>❤️ {post.likes.toLocaleString()}</span>
                  <span>💬 {post.comments.toLocaleString()}</span>
                  <span className="font-semibold text-emerald-600">ER: {post.engagementRate}%</span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#8B6914] hover:underline font-semibold"
              >
                <span>Lihat Instagram</span>
                <RiExternalLinkLine size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
