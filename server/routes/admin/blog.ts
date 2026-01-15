import { Router } from "express";
import { requireAuth } from "../../auth";
import { storage } from "../../storage";
import { insertBlogPostSchema } from "@shared/schema";
import { logActivity } from "../../utils";

const router = Router();

// Get all blog posts (admin)
router.get("/", requireAuth, async (req, res) => {
  try {
    const posts = await storage.getAllBlogPosts();
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching all blog posts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch blog posts" });
  }
});

// Get blog post by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await storage.getBlogPostById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ success: false, message: "Failed to fetch blog post" });
  }
});

// Create blog post
router.post("/", requireAuth, async (req, res) => {
  try {
    const validatedData = insertBlogPostSchema.parse(req.body);
    const post = await storage.createBlogPost(validatedData);
    await logActivity(req, "create_blog_post", "blog_post", post.id, { title: post.title });
    res.json({ success: true, data: post });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(400).json({ success: false, message: "Failed to create blog post" });
  }
});

// Update blog post
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await storage.updateBlogPost(id, req.body);
    if (!post) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }
    await logActivity(req, "update_blog_post", "blog_post", post.id, { title: post.title });
    res.json({ success: true, data: post });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(400).json({ success: false, message: "Failed to update blog post" });
  }
});

// Delete blog post
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteBlogPost(id);
    await logActivity(req, "delete_blog_post", "blog_post", id);
    res.json({ success: true, message: "Blog post deleted" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ success: false, message: "Failed to delete blog post" });
  }
});

export default router;
