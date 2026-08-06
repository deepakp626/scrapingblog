import React, { useState, useRef, useEffect } from "react";
import { DraggableCore } from "react-draggable";
import {
  Sparkles,
  Settings,
  Globe,
  Plus,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
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
    html_content: "",
    thumbnail_image: null,
    meta_title: "",
    meta_description: "",
    meta_keywords: []
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [showSEO, setShowSEO] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
      const response = await createBlog(formData);
      console.log("Blog creation response:", response);
      setStatus({ type: "success", message: "Your blog post was successfully published!" });

      // Reset form upon success
      setFormData({
        slug: "",
        title: "",
        description: "",
        html_content: "",
        thumbnail_image: null,
        meta_title: "",
        meta_description: "",
        meta_keywords: []
      });
    } catch (err: any) {
      console.error("Error creating blog:", err);
      setStatus({
        type: "error",
        message: err.detail || "An error occurred while publishing the blog."
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
    <div className="w-full min-h-[calc(100vh-64px)] bg-white text-black py-10 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side: Editor & Core Inputs */}
        <div className="lg:col-span-8 space-y-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-500" />
              Write New Blog
            </h2>
            <p className="text-sm ">
              Create and style your article content below. Use the floating settings panel to add a thumbnail and SEO metadata.
            </p>
          </div>

          {/* Success/Error Alerts */}
          {status && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 ${status.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-55 border-rose-200 text-rose-800"
              }`}>
              {status.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-semibold">{status.type === "success" ? "Success!" : "Error"}</h4>
                <p className="text-xs mt-1 opacity-90">{status.message}</p>
              </div>
            </div>
          )}

          {/* Title & Slug inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold  uppercase tracking-wider">URL Slug</label>
              <Input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="url-friendly-slug"
                className="bg-white border-slate-200 text-black placeholder-slate-400 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 h-10 px-3.5 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider">Blog Title</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter an eye-catching title..."
                className="bg-white border-slate-200 text-black placeholder-slate-400 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 h-10 px-3.5"
              />
            </div>



          </div>

          <div>
                        <div className="space-y-2">
              <label className="text-xs font-semibold  uppercase tracking-wider">Blog Description</label>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Blog Description"
                className="bg-white border-slate-200 text-black placeholder-slate-400 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 h-10 px-3.5 font-mono text-sm"
              />
            </div>
          </div>

          {/* Tiptap Rich Text Editor */}
          <div className="space-y-2">
            <label className="text-xs font-semibold  uppercase tracking-wider">Content</label>
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden min-h-[300px] text-black px-4 py-3 focus-within:border-orange-500/50 transition-colors">
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
        <div className="lg:col-span-4 relative min-h-96">
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
              className="lg:fixed lg:top-24 lg:right-10 w-full lg:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col text-black"
            >
              {/* Drag Handle Header */}
              <div className="panel-drag-handle px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-move select-none group">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Post Settings</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600 transition-colors">
                  <GripHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Panel Content (Scrollable if content overflows) */}
              <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">

                {/* Thumbnail Image component */}
                <ThumbnailImage
                  value={formData.thumbnail_image}
                  onChange={handleThumbnailChange}
                />

                {/* Short Description */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-550 uppercase tracking-wider">Short Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a quick summary of the post..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black transition-colors placeholder-slate-450 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                  />
                </div>

                {/* Collapsible SEO Metadata */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setShowSEO(!showSEO)}
                    className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-orange-500" />
                      SEO / Metadata
                    </span>
                    <span className="text-slate-550">{showSEO ? "Hide" : "Show"}</span>
                  </button>

                  {showSEO && (
                    <div className="p-4 border-t border-slate-200 space-y-4 bg-slate-50/30">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta Title</label>
                        <Input
                          type="text"
                          name="meta_title"
                          value={formData.meta_title}
                          onChange={handleChange}
                          placeholder="SEO title tag"
                          className="bg-white border-slate-200 text-black placeholder-slate-450 h-9 px-3 text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta Description</label>
                        <textarea
                          name="meta_description"
                          rows={2}
                          value={formData.meta_description}
                          onChange={handleChange}
                          placeholder="SEO description tag..."
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-black transition-colors placeholder-slate-450 outline-none focus:border-orange-500 resize-none"
                        />
                      </div>

                      {/* Keyword Tag Input */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider">Meta Keywords</label>
                        <Input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyDown={handleKeywordKeyDown}
                          placeholder="Type keyword & press Enter"
                          className="bg-white border-slate-200 text-black placeholder-slate-450 h-9 px-3 text-xs"
                        />
                        {/* Display Keyword Tags */}
                        {formData.meta_keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {formData.meta_keywords.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700"
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

                {/* Publish CTA Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 active:scale-[0.98] h-10 cursor-pointer flex items-center justify-center gap-1.5"
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