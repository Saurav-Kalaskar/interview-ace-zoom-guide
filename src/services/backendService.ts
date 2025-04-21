import { InterviewSetupData } from "@/components/InterviewSetup";
import { InterviewQuestion, FeedbackData } from "@/services/interviewService";
import config from "@/config";

// Use the backend URL from config
const API_BASE_URL = config.backendUrl;

/**
 * Fetch interview questions from Java backend based on company and job details
 */
export const fetchCompanySpecificQuestions = async (
  setupData: InterviewSetupData
): Promise<InterviewQuestion[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company: setupData.company,
        positionTitle: setupData.positionTitle,
        interviewType: setupData.interviewType,
        skills: setupData.topSkills,
        // Add other data as needed by your backend
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching company-specific questions:', error);
    throw new Error('Failed to fetch interview questions from backend');
  }
};

/**
 * Submit interview answers for analysis and get feedback from backend
 */
export const submitInterviewAnswers = async (
  answers: string[],
  setupData: InterviewSetupData,
  questions: InterviewQuestion[]
): Promise<FeedbackData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers,
        company: setupData.company,
        positionTitle: setupData.positionTitle,
        interviewType: setupData.interviewType,
        questions: questions.map(q => q.question),
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting interview feedback:', error);
    throw new Error('Failed to analyze interview responses');
  }
};

/**
 * Upload resume to backend for analysis
 */
export const uploadResumeToBackend = async (
  file: File,
  jobDescription: string
): Promise<{ status: string; message: string }> => {
  try {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend returned status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload and analyze resume');
  }
};

/**
 * Fetch company information from backend
 */
export const fetchCompanyInfo = async (companyName: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/companies?name=${encodeURIComponent(companyName)}`
    );

    if (!response.ok) {
      throw new Error(`Backend returned status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching company information:', error);
    return null;
  }
};
