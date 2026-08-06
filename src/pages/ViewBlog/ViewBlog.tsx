import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogBySlug } from "../../api/api";
import parse from "html-react-parser";

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

const ViewBlog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError("");
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (err: any) {
        setError(err.message || "Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center mt-10">Blog not found.</div>;
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
      <p className="text-gray-500 mb-4">{blog.date}</p>
      {blog.thumbnail_image_url && (
        <img
          src={blog.thumbnail_image_url}
          alt={blog.title}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}
      <article className="prose lg:prose-xl" id="blog-content">
        {parse(blog.html_content)}
      </article>
    </section>
  );
};

export default ViewBlog;
