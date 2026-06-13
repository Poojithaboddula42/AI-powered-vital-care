export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface VitalMeasurement {
  heartRate: number;
  systolicBp: number;
  diastolicBp: number;
  spo2: number;
  glucose: number;
  temperature: number;
  status?: string;
  recordedAt?: string;
}

export interface PatientProfile {
  name?: string;
  age?: number;
  gender?: string;
  conditions?: string[];
  location?: string;
}

export interface HealthInsightInput {
  vitals: VitalMeasurement;
  recentMeasurements: VitalMeasurement[];
}

export interface HealthInsightOutput {
  summary: string;
  keyObservations: string[];
  recommendations: string[];
  confidence: number;
  fallback?: boolean;
}

export interface EmergencyAssessmentInput {
  currentVitals: VitalMeasurement;
  profile: PatientProfile;
  historicalTrends: VitalMeasurement[];
}

export interface EmergencyAssessmentOutput {
  severity: SeverityLevel;
  riskScore: number;
  explanation: string;
  recommendedAction: string;
  confidence: number;
  fallback?: boolean;
}

export interface DoctorSummaryInput {
  patientHistory: {
    name: string;
    conditions?: string[];
    recentVitals: VitalMeasurement[];
  };
  alerts: Array<{ type: string; severity: string; message: string; createdAt?: string }>;
  previousAssessments?: string[];
}

export interface DoctorSummaryOutput {
  clinicalSummary: string;
  criticalAlerts: string[];
  importantObservations: string[];
  confidence: number;
  fallback?: boolean;
}

export interface SchemeRecommendationInput {
  age: number;
  gender: string;
  incomeCategory: string;
  healthConditions: string[];
  location: string;
  availableSchemes?: Array<{ title: string; description: string; eligibility: string }>;
}

export interface SchemeRecommendation {
  scheme: string;
  eligibilityReason: string;
  benefits: string;
  score: number;
}

export interface SchemeRecommendationOutput {
  recommendations: SchemeRecommendation[];
  confidence: number;
  fallback?: boolean;
}

export interface HospitalRecommendationInput {
  condition: string;
  severity: SeverityLevel;
  location: string;
  requiredSpecialty: string;
  availableHospitals?: Array<{
    name: string;
    city: string;
    specialties: string[];
    emergencyAvailable?: boolean;
    availableBeds?: number;
  }>;
}

export interface HospitalRecommendation {
  name: string;
  specialtyMatch: string;
  reason: string;
  score: number;
}

export interface HospitalRecommendationOutput {
  hospitals: HospitalRecommendation[];
  confidence: number;
  fallback?: boolean;
}

export interface GeminiStructuredRequest {
  systemPrompt: string;
  userPrompt: string;
  serviceName: string;
}
