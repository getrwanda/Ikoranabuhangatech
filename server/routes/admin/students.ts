import { Router } from "express";
import { requireAuth } from "../../auth";
import { storage } from "../../storage";
import { insertStudentSchema, insertMentorMatchSchema } from "@shared/schema";
import { logActivity } from "../../utils";

const router = Router();

// === Students ===

// Get all students
router.get("/", requireAuth, async (req, res) => {
  try {
    const students = await storage.getStudents();
    res.json({ success: true, data: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
});

// Get student by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const student = await storage.getStudent(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student" });
  }
});

// Create student
router.post("/", requireAuth, async (req, res) => {
  try {
    const validatedData = insertStudentSchema.parse(req.body);
    const student = await storage.createStudent(validatedData);
    await logActivity(req, "create_student", "student", student.id, { name: student.name });
    res.json({ success: true, data: student });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(400).json({ success: false, message: "Failed to create student" });
  }
});

// Update student
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const student = await storage.updateStudent(id, req.body);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    await logActivity(req, "update_student", "student", student.id, { name: student.name });
    res.json({ success: true, data: student });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(400).json({ success: false, message: "Failed to update student" });
  }
});

// Delete student
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteStudent(id);
    await logActivity(req, "delete_student", "student", id);
    res.json({ success: true, message: "Student deleted" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ success: false, message: "Failed to delete student" });
  }
});

// === Mentor Matches ===

// Get all mentor matches
router.get("/mentor-matches", requireAuth, async (req, res) => {
  try {
    const matches = await storage.getMentorMatches();
    res.json({ success: true, data: matches });
  } catch (error) {
    console.error("Error fetching mentor matches:", error);
    res.status(500).json({ success: false, message: "Failed to fetch mentor matches" });
  }
});

// Get mentor match by ID
router.get("/mentor-matches/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const match = await storage.getMentorMatch(id);
    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }
    res.json({ success: true, data: match });
  } catch (error) {
    console.error("Error fetching mentor match:", error);
    res.status(500).json({ success: false, message: "Failed to fetch mentor match" });
  }
});

// Create mentor match
router.post("/mentor-matches", requireAuth, async (req, res) => {
  try {
    const validatedData = insertMentorMatchSchema.parse(req.body);
    const match = await storage.createMentorMatch(validatedData);
    res.json({ success: true, data: match });
  } catch (error) {
    console.error("Error creating mentor match:", error);
    res.status(400).json({ success: false, message: "Failed to create mentor match" });
  }
});

// Update mentor match
router.patch("/mentor-matches/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertMentorMatchSchema.partial().parse(req.body);
    const match = await storage.updateMentorMatch(id, validatedData);
    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }
    res.json({ success: true, data: match });
  } catch (error) {
    console.error("Error updating mentor match:", error);
    res.status(400).json({ success: false, message: "Failed to update mentor match" });
  }
});

// Delete mentor match
router.delete("/mentor-matches/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteMentorMatch(id);
    res.json({ success: true, message: "Mentor match deleted" });
  } catch (error) {
    console.error("Error deleting mentor match:", error);
    res.status(500).json({ success: false, message: "Failed to delete mentor match" });
  }
});

export default router;
