import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getBlogBySlug, updateBlogPost } from "../../api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DraggableCore } from "react-draggable";
import {
    FileText,
    CheckCircle2,
    AlertCircle,
    GripHorizontal,
    Globe,
    X,
    Sparkles,
} from "lucide-react";
import Tiptap from "../WritePost/Tiptap";
import ThumbnailImage from "../WritePost/thumbnail_image";
import BlogPreview from "../WritePost/blogPreview";
import { useNavigate, useParams } from "react-router-dom";

interface BlogData {
    slug: string;
    title: string;
    description: string;
    html_content: string;
    thumbnail_image: File | null;
    thumbnail_image_name:string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
}

const UpdatePost: React.FC = () => {
    const navigate = useNavigate();
const { slug: slugParam } = useParams<{ slug?: string }>();  
    const [slug, setSlug] = useState("");
    const [formData, setFormData] = useState<BlogData>({
        slug: "",
        title: "",
        description: "",
        html_content: "",
        thumbnail_image: null,
        thumbnail_image_name:"",
        meta_title: "",
        meta_description: "",
        meta_keywords: [],
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [showSEO, setShowSEO] = useState(false);
    const [panelPos, setPanelPos] = useState({ x: 0, y: 0 });
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [keywordInput, setKeywordInput] = useState("");

    const fetchBlog = async (slugToFetch?: string) => {
        const targetSlug = slugToFetch || slug;
        if (!targetSlug) return;
        try {
            setLoading(true);
            setStatus(null);
            const data = await getBlogBySlug(targetSlug);
            setFormData({
                slug: data.slug ?? targetSlug,
                title: data.title ?? "",
                description: data.description ?? "",
                html_content: data.html_content ?? "",
                thumbnail_image: null,
                thumbnail_image_name: data.thumbnail_image_name ?? "",
                meta_title: data.meta_title ?? "",
                meta_description: data.meta_description ?? "",
                meta_keywords: data.meta_keywords ?? [],
            });
        } catch (err: any) {
            setStatus({ type: "error", message: err.detail || "Failed to fetch blog post. Check slug." });
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
  if (slugParam) {
    setSlug(slugParam);
    fetchBlog(slugParam);
  }
}, [slugParam]);

    const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "meta_keywords") {
            setFormData(prev => ({ ...prev, meta_keywords: value.split(",").map(k => k.trim()) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value } as any));
        }
    };

    const handleThumbnailChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, thumbnail_image: file }));
    };

    const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            const tag = keywordInput.trim().toLowerCase();
            if (tag && !formData.meta_keywords.includes(tag)) {
                setFormData(prev => ({ ...prev, meta_keywords: [...prev.meta_keywords, tag] }));
            }
            setKeywordInput("");
        }
    };

    const removeKeyword = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, meta_keywords: prev.meta_keywords.filter(t => t !== tagToRemove) }));
    };

    const handleDrag = (_e: any, data: any) => {
        setPanelPos(prev => ({ x: prev.x + data.deltaX, y: prev.y + data.deltaY }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setStatus(null);
            await updateBlogPost({
                slug: formData.slug,
                title: formData.title,
                description: formData.description,
                html_content: formData.html_content,
                thumbnail_image: formData.thumbnail_image,
                thumbnail_image_name:formData.thumbnail_image_name,
                meta_title: formData.meta_title,
                meta_description: formData.meta_description,
                meta_keywords: formData.meta_keywords,
            });
            console.log("hhihihi update success")
            setStatus({ type: "success", message: "Blog post updated successfully!" });
        } catch (err: any) {
            console.log("hhihihi update error",err)

            setStatus({ type: "error", message: err.detail || "Failed to update blog post." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-64px)] bg-white text-black py-10 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
            <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-500" /> Update Blog Post
            </h2>


<div className="max-w-4xl mt-6">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* URL Slug - 75% */}
    <div className="space-y-2 md:col-span-3">
      <label className="text-xs font-semibold uppercase tracking-wider">
        URL Slug
      </label>
      <Input
        type="text"
        name="slug"
        value={slug}
        onChange={handleSlugChange}
        placeholder="url-friendly-slug"
        className="w-full bg-white border-slate-200 text-black placeholder-slate-400 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 h-10 px-3.5 font-mono text-sm"
      />
    </div>

    {/* Fetch Button - 25% */}
    <div className="flex items-end md:col-span-1">
      <Button
        type="button"
        onClick={fetchBlog}
        disabled={loading}
        className="w-full h-10 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all shadow-lg"
      >
        {loading ? "Loading..." : "Fetch"}
      </Button>
    </div>
  </div>
</div>

            {status && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 mt-4 transition-all duration-300 ${status.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
                    {status.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                    <div>
                        <h4 className="text-sm font-semibold">{status.type === "success" ? "Success!" : "Error"}</h4>
                        <p className="text-xs mt-1 opacity-90">{status.message}</p>
                    </div>
                </div>
            )}

            {formData && (
                <form onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
                    {/* Left side */}
                    <div className="lg:col-span-8 space-y-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <div className="space-y-4">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider">Title</label>
                                <Input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full" />
                            </div>
                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Blog description"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black placeholder-slate-450 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                                />
                            </div>
                            {/* Content Editor */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider">Content</label>
                                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden min-h-[300px] text-black px-4 py-3 focus-within:border-orange-500/50 transition-colors">
                                    <Tiptap
                                        content={formData.html_content}
                                        onChange={html => setFormData(prev => ({ ...prev, html_content: html }))}
                                    />
                                </div>
                                <BlogPreview htmlContent={formData.html_content} />
                            </div>
                        </div>
                    </div>

                    {/* Right side: Floating settings panel */}
                    <div className="lg:col-span-4 relative min-h-96">
                        <DraggableCore nodeRef={panelRef} onDrag={handleDrag} handle=".panel-drag-handle">
                            <div
                                ref={panelRef}
                                style={{ transform: `translate(${panelPos.x}px, ${panelPos.y}px)` }}
                                className="lg:fixed lg:top-24 lg:right-10 w-full lg:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col text-black"
                            >
                                {/* Drag Handle Header */}
                                <div className="panel-drag-handle px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-move select-none group">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Post Settings</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600 transition-colors">
                                        <GripHorizontal className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                    {/* Thumbnail */}
                                    <ThumbnailImage value={formData.thumbnail_image} onChange={handleThumbnailChange} />
                                    {/* Short Description */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-550 uppercase tracking-wider">Short Description</label>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Provide a quick summary of the post..."
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black placeholder-slate-450 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                                        />
                                    </div>
                                    {/* SEO Metadata */}
                                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                                        <button
                                            type="button"
                                            onClick={() => setShowSEO(!showSEO)}
                                            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider hover:bg-slate-100 transition-colors"
                                        >
                                            <span className="flex items-center gap-1.5">
                                                <Globe className="w-3.5 h-3.5 text-orange-500" /> SEO / Metadata
                                            </span>
                                            <span className="text-slate-550">{showSEO ? "Hide" : "Show"}</span>
                                        </button>
                                        {showSEO && (
                                            <>
                                
                                            <div className="p-4 border-t border-slate-200 space-y-4 bg-slate-50/30">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta Title</label>
                                                    <Input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} placeholder="SEO title tag" className="bg-white border-slate-200 h-9 px-3 text-xs" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta Description</label>
                                                    <textarea
                                                        name="meta_description"
                                                        rows={2}
                                                        value={formData.meta_description}
                                                        onChange={handleChange}
                                                        placeholder="SEO description tag..."
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs placeholder-slate-450 focus:border-orange-500 resize-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider">Meta Keywords</label>
                                                    <Input
                                                        type="text"
                                                        value={keywordInput}
                                                        onChange={e => setKeywordInput(e.target.value)}
                                                        onKeyDown={handleKeywordKeyDown}
                                                        placeholder="Type keyword & press Enter"
                                                        className="bg-white border-slate-200 h-9 px-3 text-xs"
                                                    />
                                                    {formData.meta_keywords.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                                                            {formData.meta_keywords.map(tag => (
                                                                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700">
                                                                    {tag}
                                                                    <button type="button" onClick={() => removeKeyword(tag)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div >
                                                     <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg">
                                                    {loading ? "Updating..." : "Update Post"}
                                                    <Sparkles className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DraggableCore>
                        <Button type="submit" disabled={loading} className="mt-6 w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg">
                          {loading ? "Updating..." : "Update Post"}
                          <Sparkles className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdatePost;