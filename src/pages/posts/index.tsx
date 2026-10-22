import React, { useEffect, useState, useMemo } from "react";
import { RiExternalLinkLine, RiSearchLine, RiFilter3Line, RiTimeLine } from "react-icons/ri";
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

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
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
    <div className="space-y-4">
      <PageHeaderOrganism
        prefix="Data"
        title="Postingan Media Sosial"
        subtitle={`${timeStr} • ${dateStr} • Direktori Seluruh Konten @bumirekayasamandiri`}
        subtitleIcon={<RiTimeLine size={14} />}
        showBack={true}
        backPath="/dashboard"
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 shadow shadow-gray-300 rounded border border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari caption atau shortcode..."
            className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#8B6914]"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <RiFilter3Line className="text-gray-400" size={15} />
          <span className="text-xs text-gray-500 font-medium">Format:</span>
          {(["ALL", "CAROUSEL", "REEL"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                filterType === t
                  ? "bg-[#8B6914] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
            className="bg-white border border-gray-200 rounded overflow-hidden shadow shadow-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
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
                <p className="text-xs text-gray-800 line-clamp-3 leading-relaxed font-medium">
                  {post.caption}
                </p>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-500">
                  <span>❤️ {post.likes.toLocaleString()}</span>
                  <span>💬 {post.comments.toLocaleString()}</span>
                  <span className="font-semibold text-emerald-600">ER: {post.engagementRate}%</span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-mono">
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
