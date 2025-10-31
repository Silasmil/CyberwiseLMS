import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Applications table - for student applications
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  experienceLevel: text("experience_level").notNull(),
  reason: text("reason").notNull(),
  cvUrl: text("cv_url"),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
}).extend({
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Students table - approved users with admission numbers
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  admissionNumber: text("admission_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  experienceLevel: text("experience_level").notNull(),
  password: text("password").notNull(),
  requirePasswordChange: boolean("require_password_change").notNull().default(true),
  paymentVerified: boolean("payment_verified").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  applicationId: varchar("application_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

// Courses table
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  netacadCourseUrl: text("netacad_course_url"),
  netacadLabUrl: text("netacad_lab_url"),
  completionThreshold: integer("completion_threshold").notNull().default(80),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Modules table
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull(),
  moduleNumber: integer("module_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  objectives: text("objectives").array().notNull(),
  estimatedHours: integer("estimated_hours").notNull(),
  preludeTitle: text("prelude_title"),
  preludeDescription: text("prelude_description"),
  preludeVideoUrl: text("prelude_video_url"),
  preludeResourceUrl: text("prelude_resource_url"),
  releaseDate: timestamp("release_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
});

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

// Lessons table
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull(),
  lessonNumber: integer("lesson_number").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
}).extend({
  type: z.enum(["video", "reading", "lab", "external"]),
});

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

// Assignments table
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  maxScore: integer("max_score").notNull().default(100),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
});

export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;

// Assignment Submissions table
export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").notNull(),
  studentId: varchar("student_id").notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  status: text("status").notNull().default("submitted"),
  score: integer("score"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  gradedAt: timestamp("graded_at"),
  gradedBy: varchar("graded_by"),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
  gradedAt: true,
  gradedBy: true,
}).extend({
  status: z.enum(["submitted", "graded", "resubmit"]).optional(),
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Student Progress table
export const studentProgress = pgTable("student_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  courseId: varchar("course_id").notNull(),
  moduleId: varchar("module_id"),
  lessonId: varchar("lesson_id"),
  completed: boolean("completed").notNull().default(false),
  lastAccessedAt: timestamp("last_accessed_at").notNull().defaultNow(),
});

export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({
  id: true,
  lastAccessedAt: true,
});

export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type StudentProgress = typeof studentProgress.$inferSelect;

// Resources table
export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  moduleId: varchar("module_id"),
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
}).extend({
  type: z.enum(["netacad", "lab", "document", "video", "external"]),
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Discussion Posts table
export const discussionPosts = pgTable("discussion_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id"),
  moduleId: varchar("module_id"),
  authorId: varchar("author_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDiscussionPostSchema = createInsertSchema(discussionPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDiscussionPost = z.infer<typeof insertDiscussionPostSchema>;
export type DiscussionPost = typeof discussionPosts.$inferSelect;

// Discussion Replies table
export const discussionReplies = pgTable("discussion_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  authorId: varchar("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDiscussionReplySchema = createInsertSchema(discussionReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDiscussionReply = z.infer<typeof insertDiscussionReplySchema>;
export type DiscussionReply = typeof discussionReplies.$inferSelect;

// Certificates table
export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  courseId: varchar("course_id").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
  pdfUrl: text("pdf_url"),
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedAt: true,
});

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;

// Announcements table
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

// Login request schema
export const loginSchema = z.object({
  admissionNumber: z.string().min(1, "Admission number is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type PasswordChangeRequest = z.infer<typeof passwordChangeSchema>;
