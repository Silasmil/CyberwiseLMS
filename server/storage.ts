import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  Application,
  InsertApplication,
  Course,
  InsertCourse,
  Module,
  InsertModule,
  Lesson,
  InsertLesson,
  Assignment,
  InsertAssignment,
  Submission,
  InsertSubmission,
  DiscussionPost,
  InsertDiscussionPost,
  DiscussionReply,
  InsertDiscussionReply,
  Certificate,
  InsertCertificate,
  Resource,
  InsertResource,
  Announcement,
  InsertAnnouncement,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByAdmissionNumber(admissionNumber: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Application operations
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationByEmail(email: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, application: Partial<Application>): Promise<Application | undefined>;
  getAllApplications(): Promise<Application[]>;
  getNextAdmissionNumber(): Promise<string>;

  // Course operations
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<boolean>;
  getAllCourses(): Promise<Course[]>;

  // Module operations
  getModule(id: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, module: Partial<Module>): Promise<Module | undefined>;
  deleteModule(id: string): Promise<boolean>;
  getModulesByCourse(courseId: string): Promise<Module[]>;

  // Lesson operations
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson | undefined>;
  deleteLesson(id: string): Promise<boolean>;
  getLessonsByModule(moduleId: string): Promise<Lesson[]>;

  // Assignment operations
  getAssignment(id: string): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, assignment: Partial<Assignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: string): Promise<boolean>;
  getAssignmentsByModule(moduleId: string): Promise<Assignment[]>;

  // Submission operations
  getSubmission(id: string): Promise<Submission | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmission(id: string, submission: Partial<Submission>): Promise<Submission | undefined>;
  getSubmissionsByStudent(studentId: string): Promise<Submission[]>;
  getSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string): Promise<Submission | undefined>;

  // Discussion operations
  getDiscussionPost(id: string): Promise<DiscussionPost | undefined>;
  createDiscussionPost(post: InsertDiscussionPost): Promise<DiscussionPost>;
  updateDiscussionPost(id: string, post: Partial<DiscussionPost>): Promise<DiscussionPost | undefined>;
  deleteDiscussionPost(id: string): Promise<boolean>;
  getAllDiscussionPosts(): Promise<DiscussionPost[]>;

  getDiscussionReply(id: string): Promise<DiscussionReply | undefined>;
  createDiscussionReply(reply: InsertDiscussionReply): Promise<DiscussionReply>;
  updateDiscussionReply(id: string, reply: Partial<DiscussionReply>): Promise<DiscussionReply | undefined>;
  deleteDiscussionReply(id: string): Promise<boolean>;
  getRepliesByPost(postId: string): Promise<DiscussionReply[]>;

  // Certificate operations
  getCertificate(id: string): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  getCertificatesByStudent(studentId: string): Promise<Certificate[]>;

  // Resource operations
  getResource(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<Resource>): Promise<Resource | undefined>;
  deleteResource(id: string): Promise<boolean>;
  getAllResources(): Promise<Resource[]>;

  // Announcement operations
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, announcement: Partial<Announcement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<boolean>;
  getAllAnnouncements(): Promise<Announcement[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private applications: Map<string, Application>;
  private courses: Map<string, Course>;
  private modules: Map<string, Module>;
  private lessons: Map<string, Lesson>;
  private assignments: Map<string, Assignment>;
  private submissions: Map<string, Submission>;
  private discussionPosts: Map<string, DiscussionPost>;
  private discussionReplies: Map<string, DiscussionReply>;
  private certificates: Map<string, Certificate>;
  private resources: Map<string, Resource>;
  private announcements: Map<string, Announcement>;
  private admissionNumberCounter: number;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.courses = new Map();
    this.modules = new Map();
    this.lessons = new Map();
    this.assignments = new Map();
    this.submissions = new Map();
    this.discussionPosts = new Map();
    this.discussionReplies = new Map();
    this.certificates = new Map();
    this.resources = new Map();
    this.announcements = new Map();
    this.admissionNumberCounter = 1;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByAdmissionNumber(admissionNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.admissionNumber === admissionNumber
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Application operations
  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationByEmail(email: string): Promise<Application | undefined> {
    return Array.from(this.applications.values()).find(
      (app) => app.email === email
    );
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = {
      ...insertApplication,
      id,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    const updated = { ...application, ...updates };
    this.applications.set(id, updated);
    return updated;
  }

  async getAllApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getNextAdmissionNumber(): Promise<string> {
    const number = this.admissionNumberCounter.toString().padStart(3, "0");
    this.admissionNumberCounter++;
    return `CYBERWISE${number}`;
  }

  // Course operations
  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      ...insertCourse,
      id,
      createdAt: new Date().toISOString(),
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    const updated = { ...course, ...updates };
    this.courses.set(id, updated);
    return updated;
  }

  async deleteCourse(id: string): Promise<boolean> {
    return this.courses.delete(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  // Module operations
  async getModule(id: string): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = randomUUID();
    const module: Module = {
      ...insertModule,
      id,
      createdAt: new Date().toISOString(),
    };
    this.modules.set(id, module);
    return module;
  }

  async updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined> {
    const module = this.modules.get(id);
    if (!module) return undefined;
    const updated = { ...module, ...updates };
    this.modules.set(id, updated);
    return updated;
  }

  async deleteModule(id: string): Promise<boolean> {
    return this.modules.delete(id);
  }

  async getModulesByCourse(courseId: string): Promise<Module[]> {
    return Array.from(this.modules.values()).filter(
      (module) => module.courseId === courseId
    ).sort((a, b) => a.moduleNumber - b.moduleNumber);
  }

  // Lesson operations
  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const lesson: Lesson = {
      ...insertLesson,
      id,
      createdAt: new Date().toISOString(),
    };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson | undefined> {
    const lesson = this.lessons.get(id);
    if (!lesson) return undefined;
    const updated = { ...lesson, ...updates };
    this.lessons.set(id, updated);
    return updated;
  }

  async deleteLesson(id: string): Promise<boolean> {
    return this.lessons.delete(id);
  }

  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(
      (lesson) => lesson.moduleId === moduleId
    ).sort((a, b) => a.lessonNumber - b.lessonNumber);
  }

  // Assignment operations
  async getAssignment(id: string): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const id = randomUUID();
    const assignment: Assignment = {
      ...insertAssignment,
      id,
      createdAt: new Date().toISOString(),
    };
    this.assignments.set(id, assignment);
    return assignment;
  }

  async updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment | undefined> {
    const assignment = this.assignments.get(id);
    if (!assignment) return undefined;
    const updated = { ...assignment, ...updates };
    this.assignments.set(id, updated);
    return updated;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    return this.assignments.delete(id);
  }

  async getAssignmentsByModule(moduleId: string): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(
      (assignment) => assignment.moduleId === moduleId
    );
  }

  // Submission operations
  async getSubmission(id: string): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = {
      ...insertSubmission,
      id,
      status: "submitted",
      submittedAt: new Date().toISOString(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async updateSubmission(id: string, updates: Partial<Submission>): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;
    const updated = { ...submission, ...updates };
    this.submissions.set(id, updated);
    return updated;
  }

  async getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.studentId === studentId
    );
  }

  async getSubmissionByAssignmentAndStudent(
    assignmentId: string,
    studentId: string
  ): Promise<Submission | undefined> {
    return Array.from(this.submissions.values()).find(
      (submission) => submission.assignmentId === assignmentId && submission.studentId === studentId
    );
  }

  // Discussion operations
  async getDiscussionPost(id: string): Promise<DiscussionPost | undefined> {
    return this.discussionPosts.get(id);
  }

  async createDiscussionPost(insertPost: InsertDiscussionPost): Promise<DiscussionPost> {
    const id = randomUUID();
    const post: DiscussionPost = {
      ...insertPost,
      id,
      createdAt: new Date().toISOString(),
    };
    this.discussionPosts.set(id, post);
    return post;
  }

  async updateDiscussionPost(id: string, updates: Partial<DiscussionPost>): Promise<DiscussionPost | undefined> {
    const post = this.discussionPosts.get(id);
    if (!post) return undefined;
    const updated = { ...post, ...updates };
    this.discussionPosts.set(id, updated);
    return updated;
  }

  async deleteDiscussionPost(id: string): Promise<boolean> {
    return this.discussionPosts.delete(id);
  }

  async getAllDiscussionPosts(): Promise<DiscussionPost[]> {
    return Array.from(this.discussionPosts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getDiscussionReply(id: string): Promise<DiscussionReply | undefined> {
    return this.discussionReplies.get(id);
  }

  async createDiscussionReply(insertReply: InsertDiscussionReply): Promise<DiscussionReply> {
    const id = randomUUID();
    const reply: DiscussionReply = {
      ...insertReply,
      id,
      createdAt: new Date().toISOString(),
    };
    this.discussionReplies.set(id, reply);
    return reply;
  }

  async updateDiscussionReply(id: string, updates: Partial<DiscussionReply>): Promise<DiscussionReply | undefined> {
    const reply = this.discussionReplies.get(id);
    if (!reply) return undefined;
    const updated = { ...reply, ...updates };
    this.discussionReplies.set(id, updated);
    return updated;
  }

  async deleteDiscussionReply(id: string): Promise<boolean> {
    return this.discussionReplies.delete(id);
  }

  async getRepliesByPost(postId: string): Promise<DiscussionReply[]> {
    return Array.from(this.discussionReplies.values()).filter(
      (reply) => reply.postId === postId
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Certificate operations
  async getCertificate(id: string): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const id = randomUUID();
    const certificate: Certificate = {
      ...insertCertificate,
      id,
      issuedAt: new Date().toISOString(),
    };
    this.certificates.set(id, certificate);
    return certificate;
  }

  async getCertificatesByStudent(studentId: string): Promise<Certificate[]> {
    return Array.from(this.certificates.values()).filter(
      (cert) => cert.studentId === studentId
    );
  }

  // Resource operations
  async getResource(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = {
      ...insertResource,
      id,
      createdAt: new Date().toISOString(),
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: string, updates: Partial<Resource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    const updated = { ...resource, ...updates };
    this.resources.set(id, updated);
    return updated;
  }

  async deleteResource(id: string): Promise<boolean> {
    return this.resources.delete(id);
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  // Announcement operations
  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = randomUUID();
    const announcement: Announcement = {
      ...insertAnnouncement,
      id,
      createdAt: new Date().toISOString(),
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (!announcement) return undefined;
    const updated = { ...announcement, ...updates };
    this.announcements.set(id, updated);
    return updated;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    return this.announcements.delete(id);
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
