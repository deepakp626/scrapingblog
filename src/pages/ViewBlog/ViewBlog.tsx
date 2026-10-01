import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBlogBySlug } from "../../api/api";
import parse from "html-react-parser";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Tag,
  Clock,
  Code2,
  FileText,
  AlertCircle,
  Share2,
  ExternalLink,
  Link2,
  Check,
} from "lucide-react";
import "../../blog.css";

export interface SingleBlogData {
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

const ViewBlog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<SingleBlogData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"rendered" | "raw">("rendered");

  // Iframe height dynamic state
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(850);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setError("No blog slug provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const response = await getBlogBySlug(slug);

        // The API returns { success: true, status_code: 200, message: "...", data: SingleBlogData }
        // Handle both wrapped response ({ data: ... }) and direct object
        const blogData = (response as any)?.data || response;

        if (blogData && (blogData.title || blogData.html_content || blogData.id)) {
          setBlog(blogData);
        } else {
          setError((response as any)?.message || "Blog post not found.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            "Failed to load blog."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Clean rogue markdown fences from scraped HTML
  const cleanHtmlContent = (content: string): string => {
    if (!content) return "";
    return content
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/gm, "")
      .replace(/```$/gm, "");
  };

  // Check if content is a complete HTML document
  const isFullDocument = (content: string): boolean => {
    if (!content) return false;
    return /<!DOCTYPE\s+html|<html[\s>]|<head[\s>]|<body[\s>]/i.test(content);
  };

  // Auto-resize iframe when full document is loaded
  const handleIframeLoad = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const updateHeight = () => {
          const scrollH = Math.max(
            doc.documentElement?.scrollHeight || 0,
            doc.body?.scrollHeight || 0
          );
          if (scrollH > 0) {
            setIframeHeight(scrollH + 30);
          }
        };

        updateHeight();

        // Observe dynamic height changes (e.g. image loads inside iframe)
        if (typeof ResizeObserver !== "undefined" && doc.body) {
          const observer = new ResizeObserver(updateHeight);
          observer.observe(doc.body);
        }
      }
    } catch {
      // Default height is maintained on cross-domain restriction (not expected here)
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate estimated read time
  const readingTime = (content: string): number => {
    if (!content) return 1;
    const cleanText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
    const words = cleanText.trim().split(" ").length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (loading) {
    return (
      <div className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="space-y-8 mx-auto max-w-4xl animate-pulse">
          <div className="bg-slate-200 rounded-lg w-32 h-6"></div>
          <div className="bg-slate-200 rounded-xl w-3/4 h-10"></div>
          <div className="flex gap-4">
            <div className="bg-slate-200 rounded-md w-24 h-5"></div>
            <div className="bg-slate-200 rounded-md w-24 h-5"></div>
          </div>
          <div className="bg-slate-200 rounded-2xl w-full h-72"></div>
          <div className="space-y-4 pt-6">
            <div className="bg-slate-200 rounded w-full h-4"></div>
            <div className="bg-slate-200 rounded w-5/6 h-4"></div>
            <div className="bg-slate-200 rounded w-4/6 h-4"></div>
            <div className="bg-slate-200 rounded-xl w-full h-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center bg-slate-50 px-4 py-16 min-h-screen">
        <div className="space-y-6 bg-white shadow-xl p-8 border border-slate-200/80 rounded-2xl w-full max-w-md text-center">
          <div className="flex justify-center items-center bg-red-50 shadow-inner mx-auto border border-red-100 rounded-2xl w-16 h-16 text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-bold text-slate-800 text-2xl">Post Not Found</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {error || "We couldn't retrieve the blog post you're looking for."}
            </p>
          </div>
          <div className="flex sm:flex-row flex-col justify-center gap-3 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-xl font-semibold text-slate-700 text-sm transition-colors"
            >
              Retry
            </button>
            <Link
              to="/allblogs"
              className="bg-gradient-to-r from-orange-500 to-rose-600 shadow-md hover:shadow-orange-500/25 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cleanedContent = cleanHtmlContent(blog.html_content || "");
  const isFullHtml = isFullDocument(cleanedContent);

  return (
    <div className="blog-page-css">

      {/* ── Sticky Top Nav Bar ── */}
      <div className="top-16 sm:top-20 z-30 sticky bg-white shadow-xs border-slate-200/80 border-b">
        <div className="flex justify-between items-center gap-4 mx-auto px-4 sm:px-6 py-3.5 max-w-5xl">
          <Link
            to="/allblogs"
            className="group inline-flex items-center gap-2 font-medium text-slate-600 hover:text-orange-600 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>All Blogs</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle if full document */}
            {isFullHtml && (
              <div className="hidden sm:flex items-center bg-slate-100 p-1 border border-slate-200/80 rounded-xl font-medium text-xs">
                <button
                  onClick={() => setActiveTab("rendered")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "rendered"
                      ? "bg-white text-slate-800 shadow-xs font-semibold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Rendered
                </button>
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "raw"
                      ? "bg-white text-slate-800 shadow-xs font-semibold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Source HTML
                </button>
              </div>
            )}

            {/* Edit Post */}
            <button
              onClick={() => navigate(`/update-blog/${blog.slug}`)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-rose-600 shadow-xs hover:shadow-md hover:shadow-orange-500/20 px-3.5 py-2 rounded-xl font-semibold text-white text-xs active:scale-95 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="blog-container">

        {/* ── Breadcrumb ── */}
        <nav className="blog-breadcrumb">
          <Link to="/">Home</Link>
          <span className="blog-breadcrumb-sep">›</span>
          <Link to="/allblogs">Blogs</Link>
          <span className="blog-breadcrumb-sep">›</span>
          <span className="blog-breadcrumb-current">{blog.title}</span>
        </nav>

        {/* ── Header Card ── */}
        <div className="blog-header-card">
          <p className="blog-label">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <Tag style={{ width: "0.85rem", height: "0.85rem", display: "inline" }} />
              {blog.slug}
            </span>
          </p>
          <h1 className="blog-title">{blog.title}</h1>
          {blog.description && (
            <p className="blog-subtitle">{blog.description}</p>
          )}
          <div className="blog-meta">
            {blog.date && (
              <span className="blog-meta-item">
                <Calendar style={{ width: "0.95rem", height: "0.95rem" }} />
                {blog.date}
              </span>
            )}
            <span className="blog-meta-item">
              <Clock style={{ width: "0.95rem", height: "0.95rem" }} />
              {readingTime(blog.html_content)} min read
            </span>
            {blog.id && (
              <span className="blog-meta-item" style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#94a3b8" }}>
                ID: #{blog.id}
              </span>
            )}
          </div>

          {/* Meta Keywords */}
          {blog.meta_keywords && blog.meta_keywords.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
              {blog.meta_keywords.map((kw, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    padding: "0.2rem 0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#475569",
                  }}
                >
                  #{kw.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Grid: Article + Aside ── */}
        <div className="blog-grid">

          {/* ── Article Column ── */}
          <div className="blog-article">

            {/* Thumbnail Image */}
            {blog.thumbnail_image_url && (
              <div className="blog-image-card">
                <img
                  src={blog.thumbnail_image_url}
                  alt={blog.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Content */}
            {activeTab === "raw" ? (
              /* Raw HTML View */
              <div className="blog-content-card" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid #1e293b", marginBottom: "0.75rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#94a3b8" }}>
                    <Code2 style={{ width: "1rem", height: "1rem", color: "#f97316" }} />
                    Raw HTML ({cleanedContent.length.toLocaleString()} chars)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cleanedContent);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    style={{ color: copied ? "#4ade80" : "#94a3b8", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}
                  >
                    {copied ? <><Check style={{ width: "0.9rem", height: "0.9rem", display: "inline" }} /> Copied</> : "Copy HTML"}
                  </button>
                </div>
                <pre style={{ background: "rgba(0,0,0,0.4)", padding: "1rem", borderRadius: "0.75rem", maxHeight: "700px", overflowX: "auto", fontFamily: "monospace", color: "#cbd5e1", fontSize: "0.8rem", lineHeight: 1.7, userSelect: "all" }}>
                  {cleanedContent}
                </pre>
              </div>
            ) : isFullHtml ? (
              /* Full Scraped HTML Document in iframe */
              <div className="blog-content-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.625rem 1.25rem", borderBottom: "1px solid #e2e8f0", fontSize: "0.78rem", color: "#64748b" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 500 }}>
                    <FileText style={{ width: "0.875rem", height: "0.875rem", color: "#f97316" }} />
                    Interactive Document Preview
                  </span>
                  <button
                    onClick={() => setActiveTab("raw")}
                    style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#94a3b8", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                  >
                    View Source Code
                  </button>
                </div>
                <iframe
                  ref={iframeRef}
                  srcDoc={cleanedContent}
                  title={blog.title}
                  style={{
                    border: "none",
                    width: "100%",
                    height: `${iframeHeight}px`,
                    minHeight: "650px",
                    transition: "height 0.3s",
                  }}
                  onLoad={handleIframeLoad}
                  sandbox="allow-same-origin allow-scripts allow-popups"
                />
              </div>
            ) : (
              /* Rich Text — styled with blog-prose from blog.css */
              <div className="blog-content-card">
                <article className="blog-prose" id="blog-content">
                  {parse(cleanedContent || "<p style='color:#94a3b8;font-style:italic'>No content available.</p>")}
                </article>
              </div>
            )}
          </div>

          {/* ── Aside / Sidebar ── */}
          <aside className="blog-aside">

            {/* Share Card */}
            <div className="blog-aside-card blog-share-card">
              <p style={{ margin: "0 0 0.75rem", fontWeight: 600, fontSize: "0.875rem", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Share
              </p>
              <div className="blog-share-buttons">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-share-btn"
                >
                  <Share2 style={{ width: "0.95rem", height: "0.95rem", color: "#1d9bf0" }} />
                  Twitter / X
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-share-btn"
                >
                  <ExternalLink style={{ width: "0.95rem", height: "0.95rem", color: "#0a66c2" }} />
                  LinkedIn
                </a>
                <button onClick={handleCopyLink} className="blog-share-btn">
                  {copied ? (
                    <>
                      <Check style={{ width: "0.95rem", height: "0.95rem", color: "#16a34a" }} />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Link2 style={{ width: "0.95rem", height: "0.95rem" }} />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Article Info Card */}
            <div className="blog-aside-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "1.75rem", boxShadow: "0 8px 24px -12px rgba(15,23,42,0.08)" }}>
              <p style={{ margin: "0 0 0.75rem", fontWeight: 600, fontSize: "0.875rem", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Article Info
              </p>
              <div style={{ display: "grid", gap: "0.75rem", fontSize: "0.875rem", color: "#475569" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>Read Time</span>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>{readingTime(blog.html_content)} min</span>
                </div>
                {blog.date && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Published</span>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{blog.date}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>Slug</span>
                  <span style={{ fontWeight: 600, color: "#0f172a", fontFamily: "monospace", fontSize: "0.78rem" }}>{blog.slug}</span>
                </div>
                {blog.meta_title && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <span style={{ color: "#94a3b8" }}>Meta Title</span>
                    <span style={{ fontWeight: 500, color: "#334155", fontSize: "0.8rem" }}>{blog.meta_title}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <div className="blog-cta-card blog-aside-card">
              <h3>Edit this Post</h3>
              <p>Update the title, content, thumbnail, or SEO settings for this blog post.</p>
              <button
                className="blog-cta-btn"
                onClick={() => navigate(`/update-blog/${blog.slug}`)}
              >
                ✏️ Edit Post
              </button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;