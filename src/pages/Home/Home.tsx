import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  Eye,
  Pencil,
  ArrowRight,
  RefreshCw,
  Globe,
  Gauge,
  Sliders,
  Check,
  AlertCircle
} from "lucide-react";
import { getPaginatedBlogs } from "../../api/api";

interface Blog {
  id: number;
  slug: string;
  title: string;
  description: string;
  html_content: string;
  date: string;
  thumbnail_image_url: string;
  thumbnail_image_name: string | null;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

export default function Home() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);

  // SERP Simulator State for SEO Persons
  const [serpTitle, setSerpTitle] = useState("Your Optimized Blog Post Title Here | SEO Insights");
  const [serpSlug, setSerpSlug] = useState("optimized-blog-post-slug");
  const [serpDesc, setSerpDesc] = useState(
    "Write a compelling meta description containing target keywords (150-160 characters) to maximize click-through rate (CTR) on search engine results pages."
  );

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getPaginatedBlogs({ page: 1, limit: 10 });
      const fetchedBlogs = Array.isArray(response?.data) ? response.data : [];
      setBlogs(fetchedBlogs);
      setTotalRecords(response?.pagination?.total_records || fetchedBlogs.length);
    } catch (err: any) {
      console.error("Error fetching blog list for SEO Home:", err);
      setError(err?.message || "Unable to fetch blog records.");
    } finally {
      setLoading(false);
    }
  };

  // Compute SEO Health Metrics dynamically from loaded blogs
  const blogsWithDesc = blogs.filter((b) => b.description && b.description.trim().length > 0).length;
  const blogsWithThumb = blogs.filter((b) => b.thumbnail_image_url && b.thumbnail_image_url.trim().length > 0).length;
  const cleanSlugCount = blogs.filter((b) => /^[a-z0-9-]+$/.test(b.slug || "")).length;
  
  const seoPassPercentage = blogs.length > 0 
    ? Math.round(((blogsWithDesc + blogsWithThumb + cleanSlugCount) / (blogs.length * 3)) * 100) 
    : 100;

  const calculateSEOScore = (blog: Blog) => {
    let score = 0;
    if (blog.title && blog.title.length >= 20 && blog.title.length <= 70) score += 35;
    else if (blog.title) score += 20;

    if (blog.description && blog.description.length >= 50) score += 35;
    else if (blog.description) score += 15;

    if (blog.thumbnail_image_url) score += 30;

    return Math.min(100, score);
  };

  return (
    <div className="min-h-screen bg-[#020618] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Hero Header for SEO Manager */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0c132c] border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-orange-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SEO & Content Operations Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Blog SEO & Management Control
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Upload, optimize, and audit blog posts with real-time SEO score checks, meta parameter monitoring, and SERP snippet validation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/write-post"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>
            <Link
              to="/allblogs"
              className="inline-flex items-center justify-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-sm px-5 py-2.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>View All Blogs</span>
            </Link>
            <button
              onClick={fetchBlogData}
              className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* SEO Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Posts</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">{totalRecords}</span>
            <span className="text-xs text-slate-400">Published in DB</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">SEO Audit Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Gauge className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-400">{seoPassPercentage}%</span>
            <span className="text-xs text-slate-400">Health Index</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Meta Desc Coverage</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">
              {blogs.length > 0 ? Math.round((blogsWithDesc / blogs.length) * 100) : 0}%
            </span>
            <span className="text-xs text-slate-400">{blogsWithDesc} / {blogs.length} complete</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Thumbnail Cover</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white">
              {blogs.length > 0 ? Math.round((blogsWithThumb / blogs.length) * 100) : 0}%
            </span>
            <span className="text-xs text-slate-400">{blogsWithThumb} / {blogs.length} images</span>
          </div>
        </div>
      </div>

      {/* Grid Layout for SEO Tools & Recent Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Blogs with SEO Audit (2 Spans) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                Recent Blog Posts & SEO Status
              </h2>
              <p className="text-xs text-slate-400">
                Audit title length, meta description availability, and slug optimization before indexing.
              </p>
            </div>
            <Link
              to="/allblogs"
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-400">Scanning and loading blog records...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-6 text-center text-rose-400 text-sm">
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              {error}
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-200">No blogs uploaded yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Start uploading blogs with meta titles, descriptions, and keywords to build search authority.
                </p>
              </div>
              <Link
                to="/write-post"
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Write First Post</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {blogs.map((blog) => {
                const seoScore = calculateSEOScore(blog);
                const hasDesc = Boolean(blog.description && blog.description.trim().length > 0);
                const isCleanSlug = /^[a-z0-9-]+$/.test(blog.slug || "");

                return (
                  <div
                    key={blog.id || blog.slug}
                    className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-200 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4 max-w-lg">
                      {blog.thumbnail_image_url ? (
                        <img
                          src={blog.thumbnail_image_url}
                          alt={blog.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 text-slate-500">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h3 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-orange-400 transition line-clamp-1">
                            {blog.title}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-400 font-mono line-clamp-1">
                          /{blog.slug}
                        </p>

                        {/* Badges for SEO */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                              seoScore >= 75
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : seoScore >= 40
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                            }`}
                          >
                            SEO Score: {seoScore}/100
                          </span>

                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                              hasDesc
                                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                : "bg-slate-800 border-slate-700 text-slate-400"
                            }`}
                          >
                            {hasDesc ? "Meta Desc ✓" : "No Meta Desc"}
                          </span>

                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                              isCleanSlug
                                ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            }`}
                          >
                            {isCleanSlug ? "SEO Slug ✓" : "Fix Slug"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => navigate(`/blogs/${blog.slug}`)}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="View Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/update-blog/${blog.slug}`)}
                        className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold transition cursor-pointer"
                        title="Edit Post & SEO Metadata"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: SERP Snippet Preview Simulator & Best Practices */}
        <div className="space-y-6">
          {/* SERP Snippet Preview Simulator */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-slate-200">Google SERP Snippet Simulator</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">SEO Tool</span>
            </div>

            {/* Google Search Result Box Preview */}
            <div className="bg-white rounded-xl p-4 shadow-md space-y-1 font-sans">
              <div className="flex items-center space-x-1.5 text-xs text-[#202124] overflow-hidden truncate">
                <Globe className="w-3.5 h-3.5 text-[#5f6368] shrink-0" />
                <span className="text-[#202124] text-[12px] truncate">https://yourdomain.com › blogs › {serpSlug || "slug"}</span>
              </div>
              <h4 className="text-[#1a0dab] text-base font-medium leading-snug hover:underline cursor-pointer truncate">
                {serpTitle || "Blog Meta Title Preview"}
              </h4>
              <p className="text-[#4d5156] text-xs leading-relaxed line-clamp-2">
                {serpDesc || "Meta description snippet will appear here in search engine results."}
              </p>
            </div>

            {/* Inputs for testing */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <label className="font-medium">Title Test</label>
                  <span className={serpTitle.length > 60 ? "text-amber-400 font-semibold" : "text-slate-500"}>
                    {serpTitle.length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={serpTitle}
                  onChange={(e) => setSerpTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none transition"
                  placeholder="Enter test meta title..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <label className="font-medium">Slug Test</label>
                  <span className="text-slate-500">URL format</span>
                </div>
                <input
                  type="text"
                  value={serpSlug}
                  onChange={(e) => setSerpSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none transition"
                  placeholder="enter-test-slug"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <label className="font-medium">Meta Description Test</label>
                  <span className={serpDesc.length > 160 ? "text-amber-400 font-semibold" : "text-slate-500"}>
                    {serpDesc.length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={serpDesc}
                  onChange={(e) => setSerpDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none transition resize-none"
                  placeholder="Enter test meta description..."
                />
              </div>
            </div>
          </div>

          {/* SEO Checklist for Uploaders */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SEO Upload Checklist
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Include main target keyword in title & first 100 words.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Keep title length between 50 and 60 characters.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Add thumbnail image for social graph (OpenGraph).</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Use clean, hyphen-separated lower-case slugs.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Fill meta keywords array for internal taxonomy tagging.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
