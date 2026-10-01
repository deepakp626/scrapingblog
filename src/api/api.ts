import apiClient from "./instance";

// blog crud operation 

export const BlogAPIURL = {
    createBlog: "/api/blogs/createBlog",
    getAllBlogs: "/api/blogs/getAllBlogs",
    getBlogBySlug: "/api/blogs/getBlogBySlug",
    updateBlog: "/api/blogs/updateBlog",
    deleteBlog: "/api/blogs/deleteBlog",
    getPaginatedBlog: "/api/blogs/getPaginatedBlog"
}



interface CreateBlogData {
    slug: string;
    title: string;
    description: string;
    content: string;
    html_content: string;
    thumbnail_image: File | null;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    
}


export const createBlog = (data:CreateBlogData) => {
    
    const formData = new FormData();
    formData.append("slug", data.slug);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("content", data.content || data.html_content || "");
    formData.append("html_content", data.html_content);
    
    if (data.thumbnail_image) {
        formData.append("thumbnail_image", data.thumbnail_image);
        formData.append("thumbnail_image_name", data.thumbnail_image.name);
    } else {
        formData.append("thumbnail_image_name", "");
    }
    
    formData.append("meta_title", data.meta_title || "");
    formData.append("meta_description", data.meta_description || "");
    formData.append("meta_keywords", (data.meta_keywords || []).join(","));
    
    const result =  apiClient.post(BlogAPIURL.createBlog, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return result;

}       



interface GetPaginatedBlogsData {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}
export const getPaginatedBlogs = async (data: GetPaginatedBlogsData) => {
  const response = await apiClient.get(BlogAPIURL.getPaginatedBlog, { params: data });
  return response.data;
};



export interface updateBlogData {
    slug: string;
    title: string;
    description: string;
    content?: string;
    html_content: string;
    thumbnail_image: File | Blob | null;
    thumbnail_image_name?: string | null;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
}

export const updateBlogPost = async (data: updateBlogData) => {
    const formData = new FormData();
    formData.append("slug", data.slug);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("content", data.content || data.html_content || "");
    formData.append("html_content", data.html_content);
    
    if (data.thumbnail_image) {
        const fileName = (data.thumbnail_image instanceof File && data.thumbnail_image.name)
            ? data.thumbnail_image.name
            : data.thumbnail_image_name || "thumbnail.jpg";
        formData.append("thumbnail_image", data.thumbnail_image, fileName);
        formData.append("thumbnail_image_name", data.thumbnail_image_name || fileName);
    } else if (data.thumbnail_image_name) {
        formData.append("thumbnail_image_name", data.thumbnail_image_name);
    }
    
    formData.append("meta_title", data.meta_title || "");
    formData.append("meta_description", data.meta_description || "");
    formData.append("meta_keywords", (data.meta_keywords || []).join(","));

    const result = await apiClient.put(BlogAPIURL.updateBlog, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return result;
};


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

export interface SingleBlogResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: SingleBlogData;
}

export const getBlogBySlug = async (slug: string): Promise<SingleBlogResponse> => {
    const response = await apiClient.get(`${BlogAPIURL.getBlogBySlug}`, { params: { slug } });
    return response.data;
};


export interface DeleteBlogResponse {
    success: boolean;
    status_code: number;
    message: string;
    data: {
        slug: string;
    };
}

export const deleteBlog = async (slug: string): Promise<DeleteBlogResponse> => {
    const response = await apiClient.delete(BlogAPIURL.deleteBlog, {
        params: { slug }
    });
    return response.data;
};

export const deleteBlogBySlug = deleteBlog;