export interface NavLink {
  to: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface CourseWithProgress {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string | null;
  progress: number;
}

export interface ModuleWithDetails {
  id: string;
  courseId: string;
  moduleNumber: number;
  title: string;
  description: string;
  objectives: string[];
  estimatedHours: number;
  preludeTitle: string | null;
  preludeDescription: string | null;
  preludeVideoUrl: string | null;
  preludeResourceUrl: string | null;
  releaseDate: string;
  isUnlocked: boolean;
  lessons: any[];
  assignments: any[];
}

export interface DashboardStats {
  activeCourses: number;
  completedModules: number;
  pendingAssignments: number;
  certificates: number;
}
