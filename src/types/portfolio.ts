export interface StudentProfile {
  studentNo: string;
  studentName: string;
  department: string;
  schoolName: string;
  teacherName: string;
  academicYear: string;
  portfolioMotto: string;
  coverNotes: string;
  coverThemeId: string; // Theme ID for unique cover design
  customCoverImage?: string; // Student custom cover image
}

export type FieldInputType = 'text' | 'number' | 'textarea' | 'select';

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldInputType;
  placeholder?: string;
  options?: string[];
  fullWidth?: boolean;
  unitSuffix?: string;
}

export interface UnitDefinition {
  id: number;
  code: string;
  title: string;
  moduleGroup: string;
  icon: string;
  themeColor: string;
  accentHex: string;
  accentDarkHex: string;
  softHex: string;
  brief: string;
  goal: string;
  photoGuide: string;
  standardSteps: string[]; // Standard step-by-step procedure
  fields: FieldDefinition[];
  keyQuestions: string[];
  flapTitle: string;
  flapHint: string;
  flapContent: {
    secretTip: string;
    sciencePrinciple: string;
    goldenRule: string;
  };
}

export interface CoachFeedback {
  positives: string[];
  causes: string[];
  fixes: string[];
  question: string;
  mission: string;
}

export interface UnitLog {
  unitId: number;
  date: string;
  photoDataUrl?: string;
  photoName?: string;
  procedureNotes?: string; // Student's step-by-step method and notes
  dynamicData: Record<string, string>;
  satisfaction: number;
  strength: string;
  reflection: string;
  improvement: string;
  coachGrade?: string;
  coachScore?: number;
  coachMetrics?: {
    process: number;
    outcome?: number;
    cause: number;
    reflection: number;
  };
  coachFeedback?: CoachFeedback;
  isCompleted: boolean;
  lastUpdated: string;
  syncedToGoogleSheets?: boolean;
  syncedAt?: string;
}

export interface PortfolioData {
  version: string;
  student: StudentProfile;
  units: Record<number, UnitLog>;
  finalSummary?: {
    overallReflection: string;
    favoriteUnit: number;
    skillsMastered: string[];
    teacherEvaluationNotes?: string;
  };
  bookmarkedPages: number[];
  googleSheetsWebhookUrl?: string;
}
