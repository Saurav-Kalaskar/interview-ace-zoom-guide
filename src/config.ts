
// Application configuration

interface AppConfig {
  /**
   * Whether to use Java backend API instead of client-side Gemini API
   */
  useBackend: boolean;
  
  /**
   * Backend API base URL
   */
  backendUrl: string;
  
  /**
   * Maximum number of questions to ask in an interview
   */
  maxQuestions: number;
  
  /**
   * Default question time limit in seconds
   */
  defaultQuestionTimeLimit: number;
}

const config: AppConfig = {
  // Toggle to true to use backend, false to use client-side Gemini
  useBackend: true,
  
  // Backend API URL - update this to your actual Spring Boot backend URL
  backendUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-production-backend.com/api'
    : 'http://localhost:8080/api',
    
  // Interview configuration
  maxQuestions: 10,
  defaultQuestionTimeLimit: 120
};

export default config;
