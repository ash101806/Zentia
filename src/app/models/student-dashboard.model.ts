export interface StudentUpcomingExam {
  id: string;
  title: string;
  course: string;
  scheduledDate: string;
  timeLimitSeconds: number;
  status: 'SCHEDULED';
}

export interface StudentPastExam {
  id: string;
  title: string;
  course: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  status: 'COMPLETED';
}

export interface StudentDashboardResponse {
  upcomingExams: StudentUpcomingExam[];
  pastExams: StudentPastExam[];
}
