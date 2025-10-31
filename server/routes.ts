import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, insertUserSchema, insertCourseSchema, insertModuleSchema, insertLessonSchema, insertAssignmentSchema, insertSubmissionSchema, insertDiscussionPostSchema, insertDiscussionReplySchema, insertResourceSchema, insertAnnouncementSchema } from "@shared/schema";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

declare module "express-session" {
  interface SessionData {
    userId: string;
    mustChangePassword?: boolean;
  }
}

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// Email sending utility (placeholder - would use real service in production)
async function sendEmail(to: string, subject: string, body: string) {
  console.log(`[EMAIL] To: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body: ${body}`);
  // In production, use SendGrid, AWS SES, or similar
}

// File upload configuration
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word documents are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "cyberwise-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  // Serve uploaded files (admin only - for reviewing applicant CVs)
  app.get("/uploads/:filename", requireAdmin, (req, res) => {
    const filename = path.basename(req.params.filename); // Prevent path traversal
    const filePath = path.join(uploadDir, filename);
    
    // Verify the resolved path is within uploadDir
    const realPath = fs.realpathSync.native ? path.resolve(filePath) : filePath;
    if (!realPath.startsWith(path.resolve(uploadDir))) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  // ============= PUBLIC ROUTES =============

  // Submit application (with optional CV upload)
  app.post("/api/applications", upload.single("cv"), async (req, res) => {
    try {
      // Add CV URL if file was uploaded
      const applicationData = {
        ...req.body,
        cvUrl: req.file ? `/uploads/${req.file.filename}` : req.body.cvUrl || "",
      };

      const data = insertApplicationSchema.parse(applicationData);

      // Check for duplicate email
      const existing = await storage.getApplicationByEmail(data.email);
      if (existing) {
        // Delete uploaded file if validation fails
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: "An application with this email already exists" });
      }

      const application = await storage.createApplication(data);

      // Send confirmation email
      await sendEmail(
        data.email,
        "Application Received - Cyberwise Ethical Hacking Bootcamp",
        `Dear ${data.fullName},\n\nThank you for applying to the Cyberwise Ethical Hacking Bootcamp. Your application has been received and is under review.\n\nYou will be notified once a decision has been made.\n\nBest regards,\nCyberwise Team\nEmail: miltonsilas564@gmail.com\nPhone: +254 713 121 435`
      );

      res.json(application);
    } catch (error) {
      // Delete uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid application data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { admissionNumber, password } = req.body;

      if (!admissionNumber || !password) {
        return res.status(400).json({ error: "Admission number and password required" });
      }

      const user = await storage.getUserByAdmissionNumber(admissionNumber);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.mustChangePassword = user.mustChangePassword || false;

      res.json({
        user: {
          id: user.id,
          admissionNumber: user.admissionNumber,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        mustChangePassword: user.mustChangePassword || false,
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Change password
  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Both current and new password required" });
      }

      if (!PASSWORD_REGEX.test(newPassword)) {
        return res.status(400).json({
          error: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character",
        });
      }

      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, {
        password: hashedPassword,
        mustChangePassword: false,
      });

      req.session.mustChangePassword = false;

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        admissionNumber: user.admissionNumber,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword || false,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // ============= STUDENT ROUTES =============

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const submissions = await storage.getSubmissionsByStudent(userId);
      const certificates = await storage.getCertificatesByStudent(userId);

      res.json({
        activeCourses: 0, // Would calculate from enrollments
        completedModules: 0, // Would calculate from progress
        pendingAssignments: submissions.filter(s => s.status === "submitted").length,
        certificates: certificates.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Courses
  app.get("/api/courses", requireAuth, async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Modules
  app.get("/api/courses/:courseId/modules", requireAuth, async (req, res) => {
    try {
      const modules = await storage.getModulesByCourse(req.params.courseId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });

  app.get("/api/modules/:id", requireAuth, async (req, res) => {
    try {
      const module = await storage.getModule(req.params.id);
      if (!module) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch module" });
    }
  });

  // Lessons
  app.get("/api/modules/:moduleId/lessons", requireAuth, async (req, res) => {
    try {
      const lessons = await storage.getLessonsByModule(req.params.moduleId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  // Assignments
  app.get("/api/modules/:moduleId/assignments", requireAuth, async (req, res) => {
    try {
      const assignments = await storage.getAssignmentsByModule(req.params.moduleId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  app.get("/api/assignments/:id", requireAuth, async (req, res) => {
    try {
      const assignment = await storage.getAssignment(req.params.id);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assignment" });
    }
  });

  // Submit assignment
  app.post("/api/assignments/:id/submit", requireAuth, async (req, res) => {
    try {
      const data = insertSubmissionSchema.parse({
        ...req.body,
        assignmentId: req.params.id,
        studentId: req.session.userId!,
      });

      const submission = await storage.createSubmission(data);
      res.json(submission);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid submission data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit assignment" });
    }
  });

  // Resources
  app.get("/api/resources", requireAuth, async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Discussions
  app.get("/api/discussions", requireAuth, async (req, res) => {
    try {
      const posts = await storage.getAllDiscussionPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discussions" });
    }
  });

  app.post("/api/discussions", requireAuth, async (req, res) => {
    try {
      const data = insertDiscussionPostSchema.parse({
        ...req.body,
        authorId: req.session.userId!,
      });

      const post = await storage.createDiscussionPost(data);
      res.json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid discussion data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create discussion" });
    }
  });

  app.get("/api/discussions/:id/replies", requireAuth, async (req, res) => {
    try {
      const replies = await storage.getRepliesByPost(req.params.id);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch replies" });
    }
  });

  app.post("/api/discussions/:id/replies", requireAuth, async (req, res) => {
    try {
      const data = insertDiscussionReplySchema.parse({
        ...req.body,
        postId: req.params.id,
        authorId: req.session.userId!,
      });

      const reply = await storage.createDiscussionReply(data);
      res.json(reply);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid reply data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create reply" });
    }
  });

  // Certificates
  app.get("/api/certificates", requireAuth, async (req, res) => {
    try {
      const certificates = await storage.getCertificatesByStudent(req.session.userId!);
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch certificates" });
    }
  });

  // Announcements
  app.get("/api/announcements", requireAuth, async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  // ============= ADMIN ROUTES =============

  // Applications management
  app.get("/api/admin/applications", requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.post("/api/admin/applications/:id/approve", requireAdmin, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (application.status !== "pending") {
        return res.status(400).json({ error: "Application already processed" });
      }

      // Generate admission number
      const admissionNumber = await storage.getNextAdmissionNumber();

      // Create default password
      const defaultPassword = "Hacker@2025";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create user account
      const user = await storage.createUser({
        admissionNumber,
        fullName: application.fullName,
        email: application.email,
        password: hashedPassword,
        role: "student",
        mustChangePassword: true,
      });

      // Update application
      await storage.updateApplication(application.id, {
        status: "approved",
        admissionNumber,
      });

      // Send approval email with credentials
      await sendEmail(
        application.email,
        "Welcome to Cyberwise Ethical Hacking Bootcamp!",
        `Dear ${application.fullName},\n\nCongratulations! Your application has been approved.\n\nYour login credentials:\nAdmission Number: ${admissionNumber}\nPassword: ${defaultPassword}\n\nIMPORTANT: You will be required to change your password on first login.\n\nLogin at: ${process.env.BASE_URL || "http://localhost:5000"}/login\n\nBest regards,\nCyberwise Team\nEmail: miltonsilas564@gmail.com\nPhone: +254 713 121 435`
      );

      res.json({ message: "Application approved", admissionNumber });
    } catch (error) {
      res.status(500).json({ error: "Failed to approve application" });
    }
  });

  app.post("/api/admin/applications/:id/reject", requireAdmin, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (application.status !== "pending") {
        return res.status(400).json({ error: "Application already processed" });
      }

      await storage.updateApplication(application.id, {
        status: "rejected",
      });

      // Send rejection email
      await sendEmail(
        application.email,
        "Application Status - Cyberwise Ethical Hacking Bootcamp",
        `Dear ${application.fullName},\n\nThank you for your interest in the Cyberwise Ethical Hacking Bootcamp. Unfortunately, we are unable to accept your application at this time.\n\nWe encourage you to apply again in the future.\n\nBest regards,\nCyberwise Team\nEmail: miltonsilas564@gmail.com\nPhone: +254 713 121 435`
      );

      res.json({ message: "Application rejected" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reject application" });
    }
  });

  // Course management
  app.post("/api/admin/courses", requireAdmin, async (req, res) => {
    try {
      const data = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(data);
      res.json(course);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid course data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create course" });
    }
  });

  app.patch("/api/admin/courses/:id", requireAdmin, async (req, res) => {
    try {
      const course = await storage.updateCourse(req.params.id, req.body);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to update course" });
    }
  });

  app.delete("/api/admin/courses/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteCourse(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete course" });
    }
  });

  // Module management
  app.post("/api/admin/modules", requireAdmin, async (req, res) => {
    try {
      const data = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(data);
      res.json(module);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid module data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create module" });
    }
  });

  app.patch("/api/admin/modules/:id", requireAdmin, async (req, res) => {
    try {
      const module = await storage.updateModule(req.params.id, req.body);
      if (!module) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: "Failed to update module" });
    }
  });

  app.delete("/api/admin/modules/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteModule(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.json({ message: "Module deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete module" });
    }
  });

  // Lesson management
  app.post("/api/admin/lessons", requireAdmin, async (req, res) => {
    try {
      const data = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(data);
      res.json(lesson);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid lesson data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create lesson" });
    }
  });

  app.patch("/api/admin/lessons/:id", requireAdmin, async (req, res) => {
    try {
      const lesson = await storage.updateLesson(req.params.id, req.body);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Failed to update lesson" });
    }
  });

  app.delete("/api/admin/lessons/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteLesson(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete lesson" });
    }
  });

  // Assignment management
  app.post("/api/admin/assignments", requireAdmin, async (req, res) => {
    try {
      const data = insertAssignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment(data);
      res.json(assignment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid assignment data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  app.patch("/api/admin/assignments/:id", requireAdmin, async (req, res) => {
    try {
      const assignment = await storage.updateAssignment(req.params.id, req.body);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update assignment" });
    }
  });

  // Grade submission
  app.patch("/api/admin/submissions/:id/grade", requireAdmin, async (req, res) => {
    try {
      const { score, feedback } = req.body;
      const submission = await storage.updateSubmission(req.params.id, {
        score,
        feedback,
        status: "graded",
        gradedAt: new Date().toISOString(),
      });

      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to grade submission" });
    }
  });

  // Resource management
  app.post("/api/admin/resources", requireAdmin, async (req, res) => {
    try {
      const data = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(data);
      res.json(resource);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid resource data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create resource" });
    }
  });

  app.patch("/api/admin/resources/:id", requireAdmin, async (req, res) => {
    try {
      const resource = await storage.updateResource(req.params.id, req.body);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: "Failed to update resource" });
    }
  });

  app.delete("/api/admin/resources/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteResource(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json({ message: "Resource deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete resource" });
    }
  });

  // Announcement management
  app.post("/api/admin/announcements", requireAdmin, async (req, res) => {
    try {
      const data = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(data);
      res.json(announcement);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid announcement data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  app.patch("/api/admin/announcements/:id", requireAdmin, async (req, res) => {
    try {
      const announcement = await storage.updateAnnouncement(req.params.id, req.body);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });

  app.delete("/api/admin/announcements/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteAnnouncement(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // Students management
  app.get("/api/admin/students", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const students = users.filter(u => u.role === "student");
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.patch("/api/admin/students/:id/reset-password", requireAdmin, async (req, res) => {
    try {
      const defaultPassword = "Hacker@2025";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const user = await storage.updateUser(req.params.id, {
        password: hashedPassword,
        mustChangePassword: true,
      });

      if (!user) {
        return res.status(404).json({ error: "Student not found" });
      }

      await sendEmail(
        user.email,
        "Password Reset - Cyberwise Ethical Hacking Bootcamp",
        `Dear ${user.fullName},\n\nYour password has been reset by an administrator.\n\nNew Password: ${defaultPassword}\n\nPlease log in and change your password immediately.\n\nBest regards,\nCyberwise Team`
      );

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
