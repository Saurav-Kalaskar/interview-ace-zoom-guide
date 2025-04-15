
import { InterviewSetupData } from "../components/InterviewSetup";

// Mock interview questions data
const behavioralQuestions = [
  "Tell me about a time when you had to work with a difficult team member. How did you handle it?",
  "Describe a situation where you had to meet a tight deadline. How did you manage your time?",
  "Tell me about a time when you had to adapt to a significant change at work or school.",
  "Describe a project where you demonstrated leadership skills.",
  "Tell me about a time when you failed. What did you learn from the experience?",
  "Describe a situation where you had to make an important decision with limited information."
];

const technicalQuestions = [
  "Explain how you would design a scalable web application architecture.",
  "How would you optimize a slow database query?",
  "Explain the concept of asynchronous programming and when you would use it.",
  "What strategies would you use to ensure your code is maintainable and easy to understand?",
  "How would you approach debugging a complex issue in production?",
  "Describe your experience with version control systems and your workflow."
];

interface FeedbackMetric {
  name: string;
  score: number;
  description: string;
}

export interface FeedbackData {
  overallScore: number;
  metrics: FeedbackMetric[];
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface InterviewQuestion {
  question: string;
  category: string;
}

// Mock service functions
export const generateInterviewQuestions = (setupData: InterviewSetupData): InterviewQuestion[] => {
  // In a real implementation, this would call an API with Gemini AI
  const questionPool = setupData.interviewType === "behavioral" ? behavioralQuestions : technicalQuestions;
  const categories = ["Problem Solving", "Teamwork", "Leadership", "Technical Skills", "Communication", "Adaptability"];
  
  // Generate 5 questions (in a real implementation, this would be based on the resume and job description)
  return questionPool.slice(0, 5).map((question, index) => ({
    question,
    category: categories[index % categories.length]
  }));
};

export const analyzeFeedback = (answers: string[]): FeedbackData => {
  // In a real implementation, this would process the answers with Gemini AI
  
  // Generate mock feedback data
  return {
    overallScore: 78,
    metrics: [
      {
        name: "Clarity",
        score: 82,
        description: "How clearly you articulated your thoughts and ideas."
      },
      {
        name: "Relevance",
        score: 75,
        description: "How well your answers addressed the questions asked."
      },
      {
        name: "Structure",
        score: 70,
        description: "How well-organized your responses were."
      },
      {
        name: "Examples",
        score: 85,
        description: "How effectively you supported your answers with examples."
      }
    ],
    strengths: [
      "Strong use of specific examples to illustrate points",
      "Clear articulation of complex ideas",
      "Effective communication of technical concepts",
      "Good demonstration of problem-solving approach"
    ],
    improvements: [
      "Consider using the STAR method more consistently in responses",
      "Try to be more concise in your answers",
      "Include more quantifiable results in your examples",
      "Focus on highlighting leadership experiences"
    ],
    summary: "Overall, you demonstrated good communication skills and provided relevant examples. With some improvements in response structure and conciseness, you can make your interview answers even more effective."
  };
};

export const simulateZoomConnection = (): Promise<boolean> => {
  // Mock implementation - would actually connect to Zoom SDK
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};
