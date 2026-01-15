import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Get published blog posts
router.get("/published", async (req, res) => {
  try {
    const posts = await storage.getPublishedBlogPosts();
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching published blog posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog posts"
    });
  }
});

// Get posts by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await storage.getBlogPostsByCategory(category);
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching blog posts by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog posts"
    });
  }
});

// Get post by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await storage.getBlogPostBySlug(slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found"
      });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog post"
    });
  }
});

export default router;
