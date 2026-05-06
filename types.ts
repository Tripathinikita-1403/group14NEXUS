
import type React from 'react';

export interface Aspirant {
  name: string;
  avatarUrl: string;
  rank: Rank;
  badges: Badge[];
  level: number;
  xp: number;
  xpToNextLevel: number;
  context: UserContext;
}

export interface UserContext {
    category: 'SCHOOL' | 'COLLEGE' | 'COMPETITIVE';
    subCategory: string; // Board (CBSE), Degree (BTech), or Exam Group (Defence)
    detail: string; // Grade (Class 10), Course (CSE), or Specific Exam (UPSC)
    label: string; // Display string "CBSE Class 10"
}

export interface Rank {
  name:string;
  icon: React.ReactElement;
}

export interface Badge {
  name: string;
  description: string;
  icon: React.ReactElement;
}

export interface SyllabusNode {
  id: string;
  group: string;
  label: string;
  level: number;
  completed?: boolean;
}

export interface SyllabusLink {
  source: string;
  target: string;
}

export interface Suggestion {
  textToHighlight: string;
  suggestion: string;
}

export interface AIFeedback {
    structure: string;
    content: string;
    clarity: string;
    score: number;
    suggestions: Suggestion[];
}

export enum View {
  Nexus = 'NEXUS',
  Constellation = 'CONSTELLATION',
  MainsManifest = 'MAINS_MANIFEST',
  SimuLab = 'SIMULAB',
  CombatZone = 'COMBAT_ZONE',
  StrategicCommand = 'STRATEGIC_COMMAND',
  StudyVault = 'STUDY_VAULT',
  NeuralMentor = 'NEURAL_MENTOR',
  VirtualLab = 'VIRTUAL_LAB',
  MentorshipHub = 'MENTORSHIP_HUB',
}

export enum AuthenticationStatus {
  LANDING,
  IDENTIFICATION,
  LOGIN,
  PROFILE_SETUP,
  AUTHENTICATED,
  ADMIN_DASHBOARD,
  ADMIN_LOGIN,
}

export type UserRole = 'student' | 'admin';

export interface NexusFeatureStatus {
    enabled: boolean;
    locked: boolean;
}

export interface NexusConfig {
    features: Record<string, NexusFeatureStatus>;
}

export interface NexusModule {
    id: string;
    title: string;
    description: string;
    icon: React.ReactElement;
    view: keyof typeof View;
}

export interface StudyTopic {
    id: string;
    title: string;
    subtopics?: StudyTopic[];
}

export interface StudyContent {
    title: string;
    overview: string;
    keyPoints: string[];
    examContext: string;
    flashcards: { question: string; answer: string }[];
}

export interface PracticeQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswerId: number;
    explanation: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}
