export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number; // em minutos
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  instructor: string;
  published: boolean;
  modules: CourseModule[];
  requirements?: string[];
  tags?: string[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  duration: number;
  videoUrl?: string;
  content?: string;
  order: number;
  type: 'video' | 'text' | 'quiz' | 'exercise';
  completed?: boolean;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  lessonId: string;
  title: string;
  type: 'pdf' | 'link' | 'image' | 'document';
  url: string;
  description?: string;
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  startDate: string;
  lastAccess: string;
  completedLessons: string[]; // array de lessonIds
  currentLesson?: string;
  completed: boolean;
  completionDate?: string;
  certificateUrl?: string;
} 