import React, { useState, useRef } from "react";
import { DraggableCore } from "react-draggable";
import {
  Sparkles,
  Globe,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info,
  GripHorizontal
} from "lucide-react";
import BlogPreview from "./blogPreview";

import Tiptap from "./Tiptap";
import ThumbnailImage from "./thumbnail_image";
import { createBlog } from "../../api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateBlogData {
  slug: string;
  title: string;
  description: string;
  content?: string;
  html_content: string;
  thumbnail_image: File | null;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
}

const WritePost: React.FC = () => {
  const [formData, setFormData] = useState<CreateBlogData>({
    slug: "",
    title: "",
    description: "",
    content: "",
    html_content: "",
    thumbnail_image: null,
    meta_title: "",
    meta_description: "",
    meta_keywords: []
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [showSEO, setShowSEO] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Position state for the draggable floating settings panel
  const [panelPos, setPanelPos] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters except space and hyphen
      .replace(/[\s_]+/g, "-")    // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, "");   // Remove leading/trailing hyphens
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      // slug: generateSlug(title)
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value;
    setFormData(prev => ({
      ...prev,
      slug,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      thumbnail_image: file
    }));
  };

  // Keyword tag-input handlers
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const tag = keywordInput.trim().toLowerCase();
      if (tag && !formData.meta_keywords.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          meta_keywords: [...prev.meta_keywords, tag]
        }));
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      meta_keywords: prev.meta_keywords.filter(t => t !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setStatus({ type: "error", message: "Blog title is required!" });
      return;
    }
    if (!formData.slug.trim()) {
      setStatus({ type: "error", message: "URL slug is required!" });
      return;
    }
    if (!formData.description.trim()) {
      setStatus({ type: "error", message: "Blog description is required!" });
      return;
    }
    if (!formData.thumbnail_image) {
      setStatus({ type: "error", message: "Thumbnail image is required!" });
      return;
    }
    if (!formData.html_content) {
      setStatus({ type: "error", message: "Blog content is required!" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await createBlog({
        ...formData,
        content: formData.content || formData.html_content
      });
      console.log("Blog creation response:", response);

      const resData = response?.data;
      if (
        resData?.detail &&
        (resData?.error ||
          resData.detail.toLowerCase().includes("already exists") ||
          resData.detail.toLowerCase().includes("error"))
      ) {
        setStatus({
          type: "error",
          message: resData.detail
        });
        return;
      }

      const successMsg =
        resData?.message ||
        (typeof resData?.detail === "string"
          ? resData.detail
          : "Your blog post was successfully published!");

      setStatus({ type: "success", message: successMsg });

      // Reset form upon success
      setFormData({
        slug: "",
        title: "",
        description: "",
        content: "",
        html_content: "",
        thumbnail_image: null,
        meta_title: "",
        meta_description: "",
        meta_keywords: []
      });
    } catch (err: any) {
      console.error("Error creating blog:", err);
      let errorMsg = "An error occurred while publishing the blog.";

      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          // FastAPI 422 validation errors array
          errorMsg = data.detail
            .map((item: any) => {
              if (typeof item === "string") return item;
              const field = item.loc ? item.loc[item.loc.length - 1] : "";
              return field ? `${field}: ${item.msg}` : item.msg || JSON.stringify(item);
            })
            .join(", ");
        } else if (data.message) {
          errorMsg = data.message;
        } else if (typeof data === "string") {
          errorMsg = data;
        }
      } else if (err.detail) {
        errorMsg = err.detail;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setStatus({
        type: "error",
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  // Floating panel drag tracker
  const handleDrag = (_e: any, data: any) => {
    setPanelPos(prev => ({
      x: prev.x + data.deltaX,
      y: prev.y + data.deltaY
    }));
  };

  return (
    <div className="relative bg-white px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[calc(100vh-64px)] overflow-x-hidden text-black">
      <form onSubmit={handleSubmit} className="items-start gap-8 grid grid-cols-1 lg:grid-cols-12 mx-auto max-w-7xl">

        {/* Left Side: Editor & Core Inputs */}
        <div className="space-y-6 lg:col-span-8 bg-white shadow-sm p-6 sm:p-8 border border-slate-200 rounded-2xl">
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 font-extrabold text-transparent text-2xl tracking-tight">
              <FileText className="w-6 h-6 text-orange-500" />
              Write New Blog
            </h2>
            <p className="text-sm">
              Create and style your article content below. Use the floating settings panel to add a thumbnail and SEO metadata.
            </p>
          </div>

          {/* Success/Error Alerts */}
          {status && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 shadow-sm ${
                status.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : status.type === "info"
                  ? "bg-sky-50 border-sky-200 text-sky-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="mt-0.5 w-5 h-5 text-emerald-600 shrink-0" />
              ) : status.type === "info" ? (
                <Info className="mt-0.5 w-5 h-5 text-sky-600 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">
                  {status.type === "success" ? "Success!" : status.type === "info" ? "Note" : "Error"}
                </h4>
                <p className="opacity-90 mt-1 text-xs break-words leading-relaxed">{status.message}</p>
              </div>
              <button
                type="button"
                onClick={() => setStatus(null)}
                className="-mt-1 -mr-1 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Dismiss message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Title & Slug inputs */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-xs uppercase tracking-wider">URL Slug</label>
                {formData.title.trim() && !formData.slug && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }))}
                    className="font-medium text-[11px] text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Generate from title
                  </button>
                )}
              </div>
              <Input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="url-friendly-slug"
                className={`bg-white text-black placeholder-slate-400 focus-visible:ring-2 h-10 px-3.5 font-mono text-sm transition-colors ${
                  status?.type === "error" && status.message.toLowerCase().includes("slug")
                    ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                    : "border-slate-200 focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
                }`}
              />
              {status?.type === "error" && status.message.toLowerCase().includes("slug") && (
                <p className="flex items-center gap-1.5 pt-0.5 font-medium text-rose-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{status.message}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-xs uppercase tracking-wider">Blog Title</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter an eye-catching title..."
                className="bg-white px-3.5 border-slate-200 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 h-10 text-black placeholder-slate-400"
              />
            </div>



          </div>

          <div>
                        <div className="space-y-2">
              <label className="font-semibold text-xs uppercase tracking-wider">Blog Description</label>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Blog Description"
                className="bg-white px-3.5 border-slate-200 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 h-10 font-mono text-black text-sm placeholder-slate-400"
              />
            </div>
          </div>

          {/* Tiptap Rich Text Editor */}
          <div className="space-y-2">
            <label className="font-semibold text-xs uppercase tracking-wider">Content</label>
            <div className="bg-white px-4 py-3 border border-slate-200 focus-within:border-orange-500/50 rounded-xl min-h-[300px] overflow-hidden text-black transition-colors">
              <Tiptap
                content={formData.content}
                onChange={(htmlContent) => setFormData(prev => ({
                  ...prev,
                  content: htmlContent,
                  html_content: htmlContent
                }))}
              />
            </div>

            {/* Blog Preview */}
            <BlogPreview htmlContent={formData.html_content} />
          </div>
        </div>

        {/* Right Side: Draggable Floating Settings Panel */}
        <div className="relative lg:col-span-4 min-h-96">
          <DraggableCore
            nodeRef={panelRef}
            onDrag={handleDrag}
            handle=".panel-drag-handle"
          >
            <div
              ref={panelRef}
              style={{
                transform: `translate(${panelPos.x}px, ${panelPos.y}px)`
              }}
              className="lg:top-24 lg:right-10 z-40 lg:fixed flex flex-col bg-white shadow-2xl border border-slate-200 rounded-2xl w-full lg:w-96 overflow-hidden text-black"
            >
              {/* Drag Handle Header */}
              <div className="group flex justify-between items-center bg-slate-50 px-5 py-3.5 border-slate-100 border-b cursor-move select-none panel-drag-handle">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 rounded-full w-2.5 h-2.5 animate-pulse"></span>
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Post Settings</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600 transition-colors">
                  <GripHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Panel Content (Scrollable if content overflows) */}
              <div className="space-y-5 p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">

                {/* Thumbnail Image component */}
                <ThumbnailImage
                  value={formData.thumbnail_image}
                  onChange={handleThumbnailChange}
                />

                {/* Short Description */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-550 text-xs uppercase tracking-wider">Short Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a quick summary of the post..."
                    className="bg-white px-3 py-2 border border-slate-200 focus:border-orange-500 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 w-full text-black text-sm transition-colors resize-none placeholder-slate-450"
                  />
                </div>

                {/* Collapsible SEO Metadata */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowSEO(!showSEO)}
                    className="flex justify-between items-center hover:bg-slate-100 px-4 py-3 w-full font-bold text-slate-700 text-xs uppercase tracking-wider transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-orange-500" />
                      SEO / Metadata
                    </span>
                    <span className="text-slate-550">{showSEO ? "Hide" : "Show"}</span>
                  </button>

                  {showSEO && (
                    <div className="space-y-4 bg-slate-50/30 p-4 border-slate-200 border-t">
                      <div className="space-y-2">
                        <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Meta Title</label>
                        <Input
                          type="text"
                          name="meta_title"
                          value={formData.meta_title}
                          onChange={handleChange}
                          placeholder="SEO title tag"
                          className="bg-white px-3 border-slate-200 h-9 text-black text-xs placeholder-slate-450"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Meta Description</label>
                        <textarea
                          name="meta_description"
                          rows={2}
                          value={formData.meta_description}
                          onChange={handleChange}
                          placeholder="SEO description tag..."
                          className="bg-white px-3 py-2 border border-slate-200 focus:border-orange-500 rounded-lg outline-none w-full text-black text-xs transition-colors resize-none placeholder-slate-450"
                        />
                      </div>

                      {/* Keyword Tag Input */}
                      <div className="space-y-2">
                        <label className="font-bold text-[10px] text-slate-550 uppercase tracking-wider">Meta Keywords</label>
                        <Input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyDown={handleKeywordKeyDown}
                          placeholder="Type keyword & press Enter"
                          className="bg-white px-3 border-slate-200 h-9 text-black text-xs placeholder-slate-450"
                        />
                        {/* Display Keyword Tags */}
                        {formData.meta_keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {formData.meta_keywords.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 border border-slate-200 rounded font-medium text-[10px] text-slate-700"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeKeyword(tag)}
                                  className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Message in Settings Panel */}
                {status && (
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs transition-all duration-200 shadow-sm ${
                      status.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : status.type === "info"
                        ? "bg-sky-50 border-sky-200 text-sky-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0" />
                    ) : status.type === "info" ? (
                      <Info className="mt-0.5 w-4 h-4 text-sky-600 shrink-0" />
                    ) : (
                      <AlertCircle className="mt-0.5 w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="block mb-0.5 font-semibold">
                        {status.type === "success" ? "Success!" : status.type === "info" ? "Note" : "Error"}
                      </span>
                      <p className="opacity-90 break-words leading-snug">{status.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStatus(null)}
                      className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Dismiss message"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Publish CTA Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center items-center gap-1.5 bg-gradient-to-r from-orange-500 hover:from-orange-600 to-rose-600 hover:to-rose-700 shadow-lg hover:shadow-orange-500/25 py-2.5 rounded-xl w-full h-10 font-semibold text-white active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? "Publishing..." : "Publish Blog"}
                </Button>
              </div>
            </div>
          </DraggableCore>
        </div>

      </form>
    </div>
  );
};

export default WritePost;