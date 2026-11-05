export interface Teacher {
  id: string;
  name: string;
  salutation: string;
  subject: string;
  department: string;
  specialQuality: string;
  memory: string;
  lesson: string;
  message: string;
  quote?: string;
  photo?: string;
  qualities?: string[];
  signature?: string;
}

export interface TeacherValidationResult {
  valid: boolean;
  errors: string[];
}

export interface TeacherApiResponse {
  success: boolean;
  teacher?: Teacher;
  teachers?: TeacherListItem[];
  error?: string;
  message?: string;
}

export interface TeacherListItem {
  id: string;
  name: string;
  salutation?: string;
  subject?: string;
  department?: string;
  specialQuality?: string;
  hasMessage?: boolean;
  hasPhoto?: boolean;
  photo?: string;
}
