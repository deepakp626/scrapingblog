// src/pages/bloglist/bloglist.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPaginatedBlogs } from "../../api/api";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";

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
      // await deleteBlog(slug);
      fetchBlogs();
    } catch (err) {
      console.error(err);
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
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-10">
        All Blogs
      </h1>

      {blogs.length === 0 ? (
        <div>No Blogs Found</div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {blogs.map((blog) => (
              <div
                key={blog.id}
                className=" bg-white rounded-xl shadow border overflow-hidden"
              >
                {/* Three-dot menu icon positioned absolutely on top-right of the card */}



                <img
                  src={blog.thumbnail_image_url}
                  alt={blog.title}
                  className="w-full h-52 object-cover"
                />

                <div className="relative p-5">

                  <div className="absolute top-3 right-3 z-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-9 w-9 flex items-center justify-center rounded-full bg-white/90 shadow hover:bg-gray-100">
                          <MoreVertical className="h-5 w-5" />
                        </button>
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
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(blog.slug)}
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h2 className="text-xl font-bold mb-2">
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 mb-4">
                    {blog.description}
                  </p>

                  <p className="text-sm text-gray-400 mb-4">
                    {blog.date}
                  </p>

                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-orange-500 font-semibold"
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
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
            >
              Previous
            </button>

            <span>
              Page {pagination?.page} of {pagination?.total_pages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination?.has_next}
              className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-40"
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