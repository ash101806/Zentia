export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  gradeClass?: string;
  assignedClasses?: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
