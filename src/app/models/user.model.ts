export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}
