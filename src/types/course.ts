export type LessonId =
  | 'start'
  | 'lesson-1'
  | 'lesson-2'
  | 'lesson-3'
  | 'lesson-4'
  | 'lesson-5'
  | 'lesson-6'
  | 'lesson-7';

export interface QuizOption {
  label: string;
  isCorrect?: boolean;
}

export interface QuizData {
  question: string;
  explain: string;
  options: QuizOption[];
}

export interface LessonMeta {
  id: LessonId;
  number: string;
  shortTitle: string;
  fullTitle: string;
  subtitle?: string;
  duration: string;
  summary: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  source: string;
  want: string;
  status: 'New' | 'Talking' | 'Paid';
  followUpDate: string;
}

export interface ContentIdeaSlot {
  id: string;
  week: number;
  day: 'Mon · Teach' | 'Wed · Show' | 'Fri · Prove / Offer';
  idea: string;
}

export interface OfferDraft {
  who: string;
  result: string;
  what: string;
  platforms: string[];
}

export interface GoalDraft {
  product: string;
  goal: string;
}

export interface ProfileBioDraft {
  businessName: string;
  location: string;
  deliveryPromise: string;
  whatsappPhone: string;
  whatsappGreeting: string;
}

export interface ReplyVariables {
  price: string;
  deliveryTime: string;
}

export interface WeeklyReviewDraft {
  bestPosts: string;
  weakPosts: string;
  commonPattern: string;
  nextWeekChange: string;
}

export interface CourseBackupPayload {
  course: string;
  author: string;
  exportedAt: string;
  completedSections: LessonId[];
  checklist: Record<string, boolean>;
  notes: Record<string, string>;
  quizzes: Record<string, number>;
  goalDraft?: GoalDraft;
  offerDraft?: OfferDraft;
  profileBioDraft?: ProfileBioDraft;
  contentIdeas?: ContentIdeaSlot[];
  replyVariables?: ReplyVariables;
  leads?: LeadRecord[];
  weeklyReview?: WeeklyReviewDraft;
  planStartDate?: string;
}
