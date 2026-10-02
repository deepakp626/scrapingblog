import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Search,
  Eye,
  Pencil,
  ArrowRight,
  RefreshCw,
  Globe,
  Gauge,
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
    <div className="space-y-8 bg-[#020618] p-4 sm:p-6 lg:p-8 min-h-screen text-slate-100">
      {/* Hero Header for SEO Manager */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0c132c] shadow-2xl p-6 sm:p-8 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="top-0 right-0 absolute bg-gradient-to-br from-orange-500/10 via-rose-500/10 to-transparent blur-3xl -mt-12 -mr-12 rounded-full w-96 h-96 pointer-events-none" />
        
        <div className="z-10 relative flex md:flex-row flex-col justify-between md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 px-3 py-1 border border-orange-500/30 rounded-full font-semibold text-orange-400 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SEO & Content Operations Dashboard</span>
            </div>
            <h1 className="bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 font-extrabold text-transparent text-3xl sm:text-4xl tracking-tight">
              Blog SEO & Management Control
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Upload, optimize, and audit blog posts with real-time SEO score checks, meta parameter monitoring, and SERP snippet validation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/write-post"
              className="inline-flex justify-center items-center space-x-2 bg-gradient-to-r from-orange-500 hover:from-orange-600 to-rose-600 hover:to-rose-700 shadow-lg shadow-orange-500/20 px-5 py-2.5 rounded-xl font-medium text-white text-sm hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>
            <Link
              to="/allblogs"
              className="inline-flex justify-center items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 px-5 py-2.5 border border-slate-700 rounded-xl font-medium text-slate-200 text-sm hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>View All Blogs</span>
            </Link>
            <button
              onClick={fetchBlogData}
              className="bg-slate-900 p-2.5 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* SEO Key Metrics Grid */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition-all">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Total Posts</span>
            <div className="flex justify-center items-center bg-orange-500/10 border border-orange-500/20 rounded-xl w-9 h-9 text-orange-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-between items-baseline mt-4">
            <span className="font-bold text-white text-3xl">{totalRecords}</span>
            <span className="text-slate-400 text-xs">Published in DB</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition-all">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider">SEO Audit Score</span>
            <div className="flex justify-center items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-9 h-9 text-emerald-400">
              <Gauge className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-between items-baseline mt-4">
            <span className="font-bold text-emerald-400 text-3xl">{seoPassPercentage}%</span>
            <span className="text-slate-400 text-xs">Health Index</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition-all">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Meta Desc Coverage</span>
            <div className="flex justify-center items-center bg-blue-500/10 border border-blue-500/20 rounded-xl w-9 h-9 text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-between items-baseline mt-4">
            <span className="font-bold text-white text-3xl">
              {blogs.length > 0 ? Math.round((blogsWithDesc / blogs.length) * 100) : 0}%
            </span>
            <span className="text-slate-400 text-xs">{blogsWithDesc} / {blogs.length} complete</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition-all">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Thumbnail Cover</span>
            <div className="flex justify-center items-center bg-rose-500/10 border border-rose-500/20 rounded-xl w-9 h-9 text-rose-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-between items-baseline mt-4">
            <span className="font-bold text-white text-3xl">
              {blogs.length > 0 ? Math.round((blogsWithThumb / blogs.length) * 100) : 0}%
            </span>
            <span className="text-slate-400 text-xs">{blogsWithThumb} / {blogs.length} images</span>
          </div>
        </div>
      </div>

      {/* Grid Layout for SEO Tools & Recent Blogs */}
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Recent Blogs with SEO Audit (2 Spans) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 font-bold text-white text-xl">
                <FileText className="w-5 h-5 text-orange-400" />
                Recent Blog Posts & SEO Status
              </h2>
              <p className="text-slate-400 text-xs">
                Audit title length, meta description availability, and slug optimization before indexing.
              </p>
            </div>
            <Link
              to="/allblogs"
              className="flex items-center gap-1 font-semibold text-orange-400 hover:text-orange-300 text-xs transition"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 bg-slate-900/40 p-12 border border-slate-800 rounded-2xl text-center">
              <RefreshCw className="mx-auto w-8 h-8 text-orange-500 animate-spin" />
              <p className="text-slate-400 text-sm">Scanning and loading blog records...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-950/30 p-6 border border-rose-900/50 rounded-2xl text-rose-400 text-sm text-center">
              <AlertCircle className="mx-auto mb-2 w-6 h-6" />
              {error}
            </div>
          ) : blogs.length === 0 ? (
            <div className="space-y-4 bg-slate-900/40 p-12 border border-slate-800 rounded-2xl text-center">
              <FileText className="mx-auto w-10 h-10 text-slate-600" />
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-200 text-base">No blogs uploaded yet</h3>
                <p className="mx-auto max-w-sm text-slate-400 text-xs">
                  Start uploading blogs with meta titles, descriptions, and keywords to build search authority.
                </p>
              </div>
              <Link
                to="/write-post"
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium text-white text-xs transition"
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
                    className="group flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4 max-w-lg">
                      {blog.thumbnail_image_url ? (
                        <img
                          src={blog.thumbnail_image_url}
                          alt={blog.title}
                          className="border border-slate-800 rounded-xl w-16 h-16 object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex justify-center items-center bg-slate-800 border border-slate-700/60 rounded-xl w-16 h-16 text-slate-500 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-y-1 space-x-2">
                          <h3 className="font-bold text-slate-100 group-hover:text-orange-400 text-sm sm:text-base line-clamp-1 transition">
                            {blog.title}
                          </h3>
                        </div>

                        <p className="font-mono text-slate-400 text-xs line-clamp-1">
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

                    <div className="flex items-center self-end sm:self-center space-x-2 shrink-0">
                      <button
                        onClick={() => navigate(`/blogs/${blog.slug}`)}
                        className="bg-slate-800/80 hover:bg-slate-800 p-2 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                        title="View Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/update-blog/${blog.slug}`)}
                        className="inline-flex items-center space-x-1.5 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-2 border border-orange-500/30 rounded-lg font-semibold text-orange-400 text-xs transition cursor-pointer"
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
          <div className="space-y-4 bg-slate-900/60 backdrop-blur-md p-5 border border-slate-800/80 rounded-2xl">
            <div className="flex justify-between items-center pb-3 border-slate-800/80 border-b">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-slate-200 text-sm">Google SERP Snippet Simulator</h3>
              </div>
              <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-[10px] text-slate-400">SEO Tool</span>
            </div>

            {/* Google Search Result Box Preview */}
            <div className="space-y-1 bg-white shadow-md p-4 rounded-xl font-sans">
              <div className="flex items-center space-x-1.5 overflow-hidden text-[#202124] text-xs truncate">
                <Globe className="w-3.5 h-3.5 text-[#5f6368] shrink-0" />
                <span className="text-[#202124] text-[12px] truncate">https://yourdomain.com › blogs › {serpSlug || "slug"}</span>
              </div>
              <h4 className="font-medium text-[#1a0dab] text-base hover:underline truncate leading-snug cursor-pointer">
                {serpTitle || "Blog Meta Title Preview"}
              </h4>
              <p className="text-[#4d5156] text-xs line-clamp-2 leading-relaxed">
                {serpDesc || "Meta description snippet will appear here in search engine results."}
              </p>
            </div>

            {/* Inputs for testing */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1 text-slate-400 text-xs">
                  <label className="font-medium">Title Test</label>
                  <span className={serpTitle.length > 60 ? "text-amber-400 font-semibold" : "text-slate-500"}>
                    {serpTitle.length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={serpTitle}
                  onChange={(e) => setSerpTitle(e.target.value)}
                  className="bg-slate-950 px-3 py-1.5 border border-slate-800 focus:border-orange-500 rounded-lg focus:outline-none w-full text-slate-200 text-xs transition"
                  placeholder="Enter test meta title..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-slate-400 text-xs">
                  <label className="font-medium">Slug Test</label>
                  <span className="text-slate-500">URL format</span>
                </div>
                <input
                  type="text"
                  value={serpSlug}
                  onChange={(e) => setSerpSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="bg-slate-950 px-3 py-1.5 border border-slate-800 focus:border-orange-500 rounded-lg focus:outline-none w-full text-slate-200 text-xs transition"
                  placeholder="enter-test-slug"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-slate-400 text-xs">
                  <label className="font-medium">Meta Description Test</label>
                  <span className={serpDesc.length > 160 ? "text-amber-400 font-semibold" : "text-slate-500"}>
                    {serpDesc.length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={serpDesc}
                  onChange={(e) => setSerpDesc(e.target.value)}
                  className="bg-slate-950 px-3 py-1.5 border border-slate-800 focus:border-orange-500 rounded-lg focus:outline-none w-full text-slate-200 text-xs transition resize-none"
                  placeholder="Enter test meta description..."
                />
              </div>
            </div>
          </div>

          {/* SEO Checklist for Uploaders */}
          <div className="space-y-3 bg-slate-900/60 backdrop-blur-md p-5 border border-slate-800/80 rounded-2xl">
            <h3 className="flex items-center gap-2 font-bold text-slate-200 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SEO Upload Checklist
            </h3>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li className="flex items-start space-x-2">
                <Check className="mt-0.5 w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Include main target keyword in title & first 100 words.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="mt-0.5 w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Keep title length between 50 and 60 characters.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="mt-0.5 w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Add thumbnail image for social graph (OpenGraph).</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="mt-0.5 w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Use clean, hyphen-separated lower-case slugs.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="mt-0.5 w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Fill meta keywords array for internal taxonomy tagging.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
