import apiClient from "./instance";

// blog crud operation 

export const BlogAPIURL = {
    createBlog: "/createBlog",
    getAllBlogs: "/getAllBlogs",
    getBlogBySlug: "/getBlogBySlug",
    updateBlog: "/updateBlog",
    deleteBlog: "/deleteBlog",
    getPaginatedBlog: "/getPaginatedBlog"
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
    formData.append("content", data.content);
    formData.append("html_content", data.html_content);
    
    if (data.thumbnail_image) {
        formData.append("thumbnail_image", data.thumbnail_image);
        formData.append("thumbnail_image_name", data.thumbnail_image.name);
    } else {
        formData.append("thumbnail_image_name", "");
    }
    
    formData.append("meta_title", data.meta_title);
    formData.append("meta_description", data.meta_description);
    formData.append("meta_keywords", data.meta_keywords.join(","));
    
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



interface updateBlogData {
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
export const updateBlogPost = async (data: updateBlogData) => {
    const result = await apiClient.put(`${BlogAPIURL.updateBlog}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return result;
};


export const getBlogBySlug = async (slug: string) => {
    const response = await apiClient.get(`${BlogAPIURL.getBlogBySlug}`,{params:{slug:slug}});
    return response.data;
};