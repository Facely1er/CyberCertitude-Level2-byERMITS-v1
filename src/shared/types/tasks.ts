interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assessmentId?: string;
  questionId?: string;
  recommendationId?: string;
  tags: string[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[];
  progress: number;
}

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled' | 'blocked';
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
type TaskType = 'assessment' | 'remediation' | 'documentation' | 'review' | 'training' | 'audit';

interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

interface TaskComment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  mentions: string[];
}

interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  type?: TaskType[];
  assignedTo?: string[];
  dueDateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}