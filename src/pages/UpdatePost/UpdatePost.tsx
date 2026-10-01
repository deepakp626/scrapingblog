import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogBySlug, updateBlogPost } from "../../api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    FileText,
    CheckCircle2,
    AlertCircle,
    Globe,
    X,
    Sparkles,
    ArrowLeft,
    Eye,
    RefreshCw,
    Code2,
    Loader2,
} from "lucide-react";
import Tiptap from "../WritePost/Tiptap";
import ThumbnailImage from "../WritePost/thumbnail_image";
import BlogPreview from "../WritePost/blogPreview";

// Helper to convert an image URL or relative path to a File object
const urlToFile = async (url: string, filename: string): Promise<File | null> => {
    try {
        if (!url || typeof url !== "string") return null;
        const fullUrl =
            url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")
                ? url
                : `${(import.meta.env.VITE_BACKEND_BASE_URL || "").replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

        const res = await fetch(fullUrl);
        if (!res.ok) return null;
        const blob = await res.blob();
        const mimeType = blob.type || "image/jpeg";
        const cleanName = filename || "thumbnail.jpg";
        return new File([blob], cleanName, { type: mimeType });
    } catch (err) {
        console.warn("Could not convert image URL to File:", err);
        return null;
    }
};

interface BlogFormData {
    slug: string;
    title: string;
    description: string;
    html_content: string;
    thumbnail_image: File | null;
    thumbnail_image_name: string;
    thumbnail_image_url: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
}

const UpdatePost: React.FC = () => {
    const { slug: slugParam } = useParams<{ slug?: string }>();

    // Input for manually fetching or changing target slug
    const [slugInput, setSlugInput] = useState<string>("");

    // Form state
    const [formData, setFormData] = useState<BlogFormData>({
        slug: "",
        title: "",
        description: "",
        html_content: "",
        thumbnail_image: null,
        thumbnail_image_name: "",
        thumbnail_image_url: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: [],
    });

    // Editor tab: visual (Tiptap) vs code (raw HTML)
    const [editorTab, setEditorTab] = useState<"visual" | "html">("visual");

    // Key to force Tiptap re-mount only when new blog is fetched
    const [editorKey, setEditorKey] = useState<number>(0);

    // Loading & status states
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

    // Settings panel state
    const [showSEO, setShowSEO] = useState<boolean>(false);
    const [keywordInput, setKeywordInput] = useState<string>("");

    // Safe helper to normalize keywords into array
    const normalizeKeywords = (raw: any): string[] => {
        if (Array.isArray(raw)) {
            return raw.map((k: any) => String(k).trim()).filter(Boolean);
        }
        if (typeof raw === "string" && raw.trim()) {
            return raw.split(",").map((k: string) => k.trim()).filter(Boolean);
        }
        return [];
    };

    // Safe fetch blog function
    const fetchBlog = async (slugToFetch?: string) => {
        const targetSlug = (typeof slugToFetch === "string" ? slugToFetch : slugInput).trim();
        if (!targetSlug) {
            setStatus({ type: "error", message: "Please provide a valid blog slug to fetch." });
            return;
        }

        try {
            setFetchLoading(true);
            setStatus(null);

            const response = await getBlogBySlug(targetSlug);
            const data = (response as any)?.data || response;

            if (!data || (!data.title && !data.slug && !data.id)) {
                throw new Error((response as any)?.message || `Blog post with slug "${targetSlug}" not found.`);
            }

            const rawContent = data.html_content || data.content || "";

            // Convert existing thumbnail URL into File object so thumbnail_image is populated
            let initialThumbnailFile: File | null = null;
            if (data.thumbnail_image_url) {
                initialThumbnailFile = await urlToFile(
                    data.thumbnail_image_url,
                    data.thumbnail_image_name || "thumbnail.jpg"
                );
            }

            setFormData({
                slug: data.slug || targetSlug,
                title: data.title || "",
                description: data.description || "",
                html_content: rawContent,
                thumbnail_image: initialThumbnailFile,
                thumbnail_image_name: data.thumbnail_image_name || (initialThumbnailFile ? initialThumbnailFile.name : ""),
                thumbnail_image_url: data.thumbnail_image_url || "",
                meta_title: data.meta_title || "",
                meta_description: data.meta_description || "",
                meta_keywords: normalizeKeywords(data.meta_keywords),
            });

            setSlugInput(data.slug || targetSlug);
            setIsLoaded(true);

            // Default to Rich Editor ("visual") upon fetching post
            setEditorTab("visual");

            // Increment key so Tiptap mounts with the newly fetched content
            setEditorKey(prev => prev + 1);

            setStatus({
                type: "success",
                message: `Loaded post: "${data.title || targetSlug}"`,
            });
        } catch (err: any) {
            console.error("fetchBlog error:", err);
            const errorMsg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.detail ||
                err.message ||
                "Failed to fetch blog post. Please check the slug.";
            setStatus({ type: "error", message: errorMsg });
        } finally {
            setFetchLoading(false);
        }
    };

    // Auto-fetch when slugParam changes in route
    useEffect(() => {
        if (slugParam && slugParam.trim()) {
            setSlugInput(slugParam.trim());
            fetchBlog(slugParam.trim());
        }
    }, [slugParam]);

    // Handle form input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle thumbnail selection
    const handleThumbnailChange = (file: File | null) => {
        setFormData(prev => ({
            ...prev,
            thumbnail_image: file,
            thumbnail_image_name: file ? file.name : prev.thumbnail_image_name,
        }));
    };

    // Remove existing thumbnail image
    const handleRemoveExistingThumbnail = () => {
        setFormData(prev => ({
            ...prev,
            thumbnail_image: null,
            thumbnail_image_name: "",
            thumbnail_image_url: "",
        }));
    };

    // Keyword management
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
        setFormData(prev => ({
            ...prev,
            meta_keywords: prev.meta_keywords.filter(t => t !== tagToRemove),
        }));
    };

        // Form submission
    const handleSubmit = async (e: FormEvent) => {
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
        if (!formData.html_content.trim()) {
            setStatus({ type: "error", message: "Blog content cannot be empty!" });
            return;
        }

        try {
            setSubmitLoading(true);
            setStatus(null);

            let currentThumbnail = formData.thumbnail_image;

            // If thumbnail_image is not yet loaded as a File, but an existing URL exists, attempt to fetch it
            if (!currentThumbnail && formData.thumbnail_image_url) {
                currentThumbnail = await urlToFile(
                    formData.thumbnail_image_url,
                    formData.thumbnail_image_name || "thumbnail.jpg"
                );
                if (currentThumbnail) {
                    setFormData(prev => ({ ...prev, thumbnail_image: currentThumbnail }));
                }
            }

            if (!currentThumbnail) {
                setStatus({
                    type: "error",
                    message: "Thumbnail image is required! Please select or upload a thumbnail image.",
                });
                return;
            }

            const response = await updateBlogPost({
                slug: formData.slug.trim(),
                title: formData.title.trim(),
                description: formData.description.trim(),
                content: formData.html_content,
                html_content: formData.html_content,
                thumbnail_image: currentThumbnail,
                thumbnail_image_name: formData.thumbnail_image_name || currentThumbnail.name,
                meta_title: formData.meta_title.trim(),
                meta_description: formData.meta_description.trim(),
                meta_keywords: formData.meta_keywords,
            });

            const resData = (response as any)?.data || response;
            if (resData?.thumbnail_image_url) {
                setFormData(prev => ({
                    ...prev,
                    thumbnail_image_url: resData.thumbnail_image_url,
                    thumbnail_image_name: resData.thumbnail_image_name || prev.thumbnail_image_name,
                }));
            }

            const successMsg =
                resData?.message ||
                (typeof resData?.detail === "string" ? resData.detail : "Blog post updated successfully!");

            setStatus({ type: "success", message: successMsg });
        } catch (err: any) {
            console.error("Update error:", err);
            let errorMsg = "Failed to update blog post.";
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data.detail === "string") {
                    errorMsg = data.detail;
                } else if (Array.isArray(data.detail)) {
                    errorMsg = data.detail.map((it: any) => it.msg || JSON.stringify(it)).join(", ");
                } else if (data.message) {
                    errorMsg = data.message;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }
            setStatus({ type: "error", message: errorMsg });
        } finally {
            setSubmitLoading(false);
        }
    };

    const isFullHtml = /<!DOCTYPE\s+html|<html[\s>]|<head[\s>]|<body[\s>]/i.test(formData.html_content);

    return (
        <div className="relative bg-slate-50/50 px-4 sm:px-6 lg:px-8 py-8 w-full min-h-[calc(100vh-64px)] overflow-x-hidden text-black">
            {/* Top Navigation & Header */}
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 mx-auto mb-6 max-w-7xl">
                <div className="flex items-center gap-3">
                    <Link
                        to="/allblogs"
                        className="inline-flex items-center gap-1.5 bg-white shadow-xs px-3.5 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:text-orange-600 text-xs transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blogs
                    </Link>
                    <h1 className="flex items-center gap-2 bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600 font-extrabold text-transparent text-2xl tracking-tight">
                        <FileText className="w-6 h-6 text-orange-500" />
                        Update Blog Post
                    </h1>
                </div>

                {formData.slug && (
                    <div className="flex items-center gap-2">
                        <Link
                            to={`/blogs/${formData.slug}`}
                            className="inline-flex items-center gap-1.5 bg-white shadow-xs px-3.5 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:text-orange-600 text-xs transition-colors"
                        >
                            <Eye className="w-4 h-4 text-slate-500" />
                            View Live Post
                        </Link>
                    </div>
                )}
            </div>

            {/* Slug Search & Fetch Bar (Always Visible at Top) */}
            <div className="bg-white shadow-xs mx-auto mb-6 p-5 border border-slate-200 rounded-2xl max-w-7xl">
                <div className="items-end gap-3 grid grid-cols-1 md:grid-cols-12">
                    <div className="space-y-1.5 md:col-span-9">
                        <label className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                            Search Post by URL Slug
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                value={slugInput}
                                onChange={(e) => setSlugInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        fetchBlog(slugInput);
                                    }
                                }}
                                placeholder="e.g. how-to-scrape-web-pages"
                                className="bg-white px-3.5 border-slate-200 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 w-full h-11 font-mono text-black text-sm placeholder-slate-400"
                            />
                            {slugInput && (
                                <button
                                    type="button"
                                    onClick={() => setSlugInput("")}
                                    className="top-1/2 right-3 absolute p-1 text-slate-400 hover:text-slate-600 -translate-y-1/2 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <Button
                            type="button"
                            onClick={() => fetchBlog(slugInput)}
                            disabled={fetchLoading || !slugInput.trim()}
                            className="flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 hover:from-orange-600 to-rose-600 hover:to-rose-700 disabled:opacity-60 shadow-md rounded-xl w-full h-11 font-semibold text-white transition-all cursor-pointer"
                        >
                            {fetchLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Fetching Post...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Fetch Post
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Notification Banner */}
            {status && (
                <div className="mx-auto mb-6 max-w-7xl">
                    <div
                        className={`p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 shadow-sm ${status.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : status.type === "info"
                                ? "bg-sky-50 border-sky-200 text-sky-800"
                                : "bg-rose-50 border-rose-200 text-rose-800"
                            }`}
                    >
                        {status.type === "success" ? (
                            <CheckCircle2 className="mt-0.5 w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="mt-0.5 w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm capitalize">{status.type}</h4>
                            <p className="opacity-90 mt-1 text-xs break-words">{status.message}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setStatus(null)}
                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Edit Form */}
            <form onSubmit={handleSubmit} className="items-start gap-8 grid grid-cols-1 lg:grid-cols-12 mx-auto max-w-7xl">
                {/* Left Side: Main Editor & Core Fields */}
                <div className="space-y-6 lg:col-span-8 bg-white shadow-sm p-6 sm:p-8 border border-slate-200 rounded-2xl">
                    {/* Header indicator */}
                    <div className="flex justify-between items-center pb-4 border-slate-100 border-b">
                        <div>
                            <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Editing Post</span>
                            <h3 className="font-bold text-slate-800 text-base">
                                {formData.title || (isLoaded ? "Untitled Post" : "No post loaded yet")}
                            </h3>
                        </div>
                        {formData.slug && (
                            <span className="bg-slate-100 px-2.5 py-1 border border-slate-200 rounded-lg font-mono text-slate-700 text-xs">
                                /{formData.slug}
                            </span>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* URL Slug */}
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                Blog Slug (Unique Identifier)
                            </label>
                            <Input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                // onChange={handleChange}
                                placeholder="unique-post-slug"
                                className="bg-slate-50 border-slate-200 w-full font-mono text-black text-xs"
                                readOnly
                            />
                        </div>

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                Title <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter post title..."
                                className="w-full font-medium"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                Short Description <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Summary or description of this blog post..."
                                className="bg-white px-3.5 py-2.5 border border-slate-200 focus:border-orange-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 w-full text-black text-sm resize-none placeholder-slate-400"
                            />
                        </div>

                        {/* Content Editor Section */}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center">
                                <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                    Blog Content <span className="text-rose-500">*</span>
                                </label>

                                {/* Toggle between Rich Text and HTML Source */}
                                <div className="flex items-center bg-slate-100 p-0.5 border border-slate-200 rounded-lg text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setEditorTab("visual")}
                                        className={`px-3 py-1 rounded-md font-medium transition-all ${editorTab === "visual"
                                            ? "bg-white text-slate-900 shadow-xs font-semibold"
                                            : "text-slate-600 hover:text-slate-900"
                                            }`}
                                    >
                                        Rich Editor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditorTab("html")}
                                        className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${editorTab === "html"
                                            ? "bg-white text-slate-900 shadow-xs font-semibold"
                                            : "text-slate-600 hover:text-slate-900"
                                            }`}
                                    >
                                        <Code2 className="w-3.5 h-3.5" />
                                        HTML Source
                                    </button>
                                </div>
                            </div>

                            {/* Alert if content is full HTML document */}
                            {isFullHtml && editorTab === "visual" && (
                                <div className="flex items-center gap-2 bg-amber-50 p-2.5 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>
                                        This post contains a complete HTML document (e.g. scraped page). For best results, edit directly in <strong>HTML Source</strong> mode.
                                    </span>
                                </div>
                            )}

                            {editorTab === "visual" ? (
                                <div className="bg-white px-4 py-3 border border-slate-200 focus-within:border-orange-500/50 rounded-xl min-h-[350px] overflow-hidden text-black transition-colors">
                                    <Tiptap
                                        key={editorKey}
                                        content={formData.html_content}
                                        onChange={(html) => setFormData(prev => ({ ...prev, html_content: html }))}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <textarea
                                        value={formData.html_content}
                                        onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
                                        rows={18}
                                        placeholder="Paste or edit HTML content here..."
                                        className="bg-slate-900 p-4 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-full font-mono text-slate-100 text-xs resize-y"
                                    />
                                </div>
                            )}

                            {/* Live Preview */}
                            <div className="pt-4">
                                <h4 className="mb-3 font-bold text-slate-500 text-xs uppercase tracking-wider">Live Content Preview</h4>
                                <BlogPreview htmlContent={formData.html_content} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Fixed in place Post Settings Panel (Non-draggable, Clean Sidebar) */}
                <div className="top-6 sticky space-y-6 lg:col-span-4">
                    <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-2xl w-full overflow-hidden text-black">
                        {/* Panel Header */}
                        <div className="flex justify-between items-center bg-slate-50 px-5 py-4 border-slate-100 border-b">
                            <div className="flex items-center gap-2">
                                <span className="bg-orange-500 rounded-full w-2.5 h-2.5 animate-pulse" />
                                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Post Settings</span>
                            </div>
                            <span className="bg-white px-2 py-0.5 border border-slate-200 rounded font-medium text-[10px] text-slate-500">
                                SEO & Media
                            </span>
                        </div>

                        <div className="space-y-5 p-5">
                            {/* Thumbnail Image */}
                            <div className="space-y-2">
                                <ThumbnailImage
                                    value={formData.thumbnail_image}
                                    onChange={handleThumbnailChange}
                                    existingUrl={formData.thumbnail_image_url}
                                    onRemoveExisting={handleRemoveExistingThumbnail}
                                />
                                {formData.thumbnail_image ? (
                                    <p className="font-mono text-[11px] text-emerald-600 truncate">
                                        ✓ Ready: {formData.thumbnail_image_name || formData.thumbnail_image.name}
                                    </p>
                                ) : formData.thumbnail_image_name ? (
                                    <p className="font-mono text-[11px] text-slate-500 truncate">
                                        Current: {formData.thumbnail_image_name}
                                    </p>
                                ) : null}
                            </div>

                            {/* SEO Metadata Collapsible */}
                            <div className="bg-slate-50/50 border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setShowSEO(!showSEO)}
                                    className="flex justify-between items-center hover:bg-slate-100 px-4 py-3 w-full font-bold text-slate-700 text-xs uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-orange-500" />
                                        SEO / Metadata
                                    </span>
                                    <span className="font-semibold text-[11px] text-slate-500">{showSEO ? "Hide" : "Show"}</span>
                                </button>

                                {showSEO && (
                                    <div className="space-y-4 bg-slate-50/30 p-4 border-slate-200 border-t">
                                        {/* Meta Title */}
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                                                Meta Title
                                            </label>
                                            <Input
                                                type="text"
                                                name="meta_title"
                                                value={formData.meta_title}
                                                onChange={handleChange}
                                                placeholder="SEO title tag"
                                                className="bg-white px-3 border-slate-200 h-9 text-xs"
                                            />
                                        </div>

                                        {/* Meta Description */}
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                                                Meta Description
                                            </label>
                                            <textarea
                                                name="meta_description"
                                                rows={2}
                                                value={formData.meta_description}
                                                onChange={handleChange}
                                                placeholder="SEO description tag..."
                                                className="bg-white px-3 py-2 border border-slate-200 focus:border-orange-500 rounded-lg outline-none w-full text-xs resize-none placeholder-slate-400"
                                            />
                                        </div>

                                        {/* Meta Keywords */}
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                                                Meta Keywords
                                            </label>
                                            <Input
                                                type="text"
                                                value={keywordInput}
                                                onChange={e => setKeywordInput(e.target.value)}
                                                onKeyDown={handleKeywordKeyDown}
                                                placeholder="Type keyword & press Enter"
                                                className="bg-white px-3 border-slate-200 h-9 text-xs"
                                            />
                                            {formData.meta_keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1.5">
                                                    {formData.meta_keywords.map((tag, idx) => (
                                                        <span
                                                            key={`${tag}-${idx}`}
                                                            className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 border border-slate-200 rounded font-medium text-[10px] text-slate-700"
                                                        >
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeKeyword(tag)}
                                                                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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

                            {/* ONLY ONE Single, High-Visibility Update Post Button */}
                            <Button
                                type="submit"
                                disabled={submitLoading || !formData.title.trim()}
                                className="flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 hover:from-orange-600 to-rose-600 hover:to-rose-700 disabled:opacity-60 shadow-md hover:shadow-orange-500/20 py-3 rounded-xl w-full h-11 font-semibold text-white transition-all cursor-pointer"
                            >
                                {submitLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Updating Post...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Update Post
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdatePost;