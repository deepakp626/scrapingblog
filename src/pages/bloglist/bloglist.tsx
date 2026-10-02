import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPaginatedBlogs, deleteBlog } from "../../api/api";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Pencil, Trash2, Eye, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";

interface Blog {
  id: number;
  slug: string;
  title: string;
  description: string;
  html_content: string;
  date: string;
  thumbnail_image_url: string;
  thumbnail_image_name: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

interface PaginatedResponse {
  data: Blog[];
  pagination: Pagination;
}

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response: PaginatedResponse = await getPaginatedBlogs({
        page,
        limit,
      });
      // console.log("response data",response.data)
      setBlogs(Array.isArray(response.data) ? response.data : []);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slug: string) => {
    console.log("edit", slug)
    navigate(`/update-blog/${slug}`)

  }

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      setDeletingSlug(slug);
      setFeedback(null);
      const res = await deleteBlog(slug);
      setFeedback({
        type: "success",
        message: res?.message || `Blog '${slug}' deleted successfully.`,
      });

      // If the current page only has 1 blog left and page > 1, go back one page
      if (blogs.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchBlogs();
      }
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to delete blog post.";
      setFeedback({
        type: "error",
        message: errMsg,
      });
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleView = (slug: string) => {
    navigate(`/blogs/${slug}`)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <section className="mx-auto px-6 py-10 max-w-7xl">
      <h1 className="mb-6 font-bold text-4xl">
        All Blogs
      </h1>

      {feedback && (
        <div
          role="alert"
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between transition-all duration-300 shadow-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="font-medium text-sm">{feedback.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {blogs.length === 0 ? (
        <div>No Blogs Found</div>
      ) : (
        <>
          <div className="gap-8 grid md:grid-cols-2 lg:grid-cols-3">

            {blogs.map((blog) => (
              <div
                key={blog.id}
                className={`bg-white rounded-xl shadow border overflow-hidden transition-all duration-200 ${
                  deletingSlug === blog.slug ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {/* Three-dot menu icon positioned absolutely on top-right of the card */}

                <img
                  src={blog.thumbnail_image_url}
                  alt={blog.title}
                  className="w-full h-52 object-cover"
                />

                <div className="relative p-5">

                  <div className="top-3 right-3 z-20 absolute">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex justify-center items-center bg-white/90 hover:bg-gray-100 shadow rounded-full w-9 h-9">
                        <MoreVertical className="w-5 h-5" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">

                        <DropdownMenuItem
                          onClick={() => handleEdit(blog.slug)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleView(blog.slug)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 w-4 h-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(blog.slug)}
                          disabled={deletingSlug === blog.slug}
                          className="flex items-center text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          {deletingSlug === blog.slug ? (
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 w-4 h-4" />
                          )}
                          {deletingSlug === blog.slug ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h2 className="mb-2 font-bold text-xl">
                    {blog.title}
                  </h2>

                  <p className="mb-4 text-gray-600">
                    {blog.description}
                  </p>

                  <p className="mb-4 text-gray-400 text-sm">
                    {blog.date}
                  </p>

                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="font-semibold text-orange-500"
                  >
                    Read More →
                  </Link>

                </div>
              </div>
            ))}

          </div>

          {/* Pagination */}

          <div className="flex justify-center items-center gap-5 mt-10">

            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination?.has_previous}
              className="bg-gray-300 disabled:opacity-40 px-4 py-2 rounded"
            >
              Previous
            </button>

            <span>
              Page {pagination?.page} of {pagination?.total_pages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination?.has_next}
              className="bg-orange-500 disabled:opacity-40 px-4 py-2 rounded text-white"
            >
              Next
            </button>

          </div>
        </>
      )}
    </section>
  );
};

export default BlogList;