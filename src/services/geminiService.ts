
import { InterviewSetupData } from "../components/InterviewSetup";
import { InterviewQuestion, FeedbackData } from "./interviewService";

interface GeminiRequestOptions {
  model: string;
  contents: {
    role: "user" | "model";
    parts: {
      text: string;
    }[];
  }[];
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
    topP: number;
    topK: number;
  };
}

/**
 * Get the Gemini API key from localStorage
 */
const getApiKey = (): string => {
  const apiKey = localStorage.getItem("geminiApiKey");
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please add your API key in the settings.");
  }
  return apiKey;
};

/**
 * Generate interview questions based on job description, resume, and skills
 */
export const generateQuestionsWithGemini = async (
  setupData: InterviewSetupData
): Promise<InterviewQuestion[]> => {
  try {
    const apiKey = getApiKey();
    const prompt = createQuestionGenerationPrompt(setupData);
    
    // In a real implementation, we would call the Gemini API
    // For now, we'll just return mock data
    console.log("Generating questions with prompt:", prompt);
    
    // For development/demo purposes, use the mock implementation
    const { generateInterviewQuestions } = await import("./interviewService");
    return generateInterviewQuestions(setupData);
    
    // Uncomment this to use the real Gemini API in production:
    /*
    const options: GeminiRequestOptions = {
      model: "gemini-1.0-pro",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40
      }
    };
    
    const response = await callGeminiAPI(apiKey, options);
    return parseQuestionsFromResponse(response, setupData.interviewType);
    */
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate interview questions");
  }
};

/**
 * Analyze user's interview answers and provide feedback
 */
export const analyzeFeedbackWithGemini = async (
  answers: string[],
  setupData: InterviewSetupData,
  questions: InterviewQuestion[]
): Promise<FeedbackData> => {
  try {
    const apiKey = getApiKey();
    const prompt = createFeedbackAnalysisPrompt(questions, answers, setupData);
    
    // Log the prompt for debugging
    console.log("Analyzing feedback with prompt:", prompt);
    
    // For development/demo purposes, use the mock implementation
    const { analyzeFeedback } = await import("./interviewService");
    return analyzeFeedback(answers);
    
    // Uncomment this to use the real Gemini API in production:
    /*
    const options: GeminiRequestOptions = {
      model: "gemini-1.0-pro",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40
      }
    };
    
    const response = await callGeminiAPI(apiKey, options);
    return parseFeedbackFromResponse(response);
    */
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    throw new Error("Failed to generate interview feedback");
  }
};

/**
 * Function to make actual calls to the Gemini API
 */
const callGeminiAPI = async (apiKey: string, options: GeminiRequestOptions) => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(options),
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

/**
 * Helper function to parse questions from the Gemini API response
 */
const parseQuestionsFromResponse = (response: any, interviewType: string): InterviewQuestion[] => {
  // This is a simplified parser - would be more robust in production
  try {
    const text = response.candidates[0].content.parts[0].text;
    
    // Split text into question sections and parse them
    const questions = text.split(/\d+\.\s/).filter(Boolean).map(questionText => {
      // Extract category using regex
      const categoryMatch = questionText.match(/Category:\s*([\w\s]+)/i);
      const category = categoryMatch ? categoryMatch[1].trim() : "General";
      
      // Clean up the question text
      let question = questionText
        .replace(/Category:\s*[\w\s]+/i, '')
        .trim();
      
      return {
        question,
        category
      };
    });
    
    return questions.slice(0, 5); // Ensure we return at most 5 questions
  } catch (error) {
    console.error("Error parsing questions from response:", error);
    throw error;
  }
};

/**
 * Helper function to parse feedback from the Gemini API response
 */
const parseFeedbackFromResponse = (response: any): FeedbackData => {
  // This is a simplified parser - would be more robust in production
  try {
    const text = response.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) ||
                      text.match(/{[\s\S]*}/);
    
    if (jsonMatch) {
      try {
        const feedbackData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return feedbackData;
      } catch (jsonError) {
        console.error("Error parsing JSON from response:", jsonError);
      }
    }
    
    // Fallback: Use mock data
    const { analyzeFeedback } = require("./interviewService");
    return analyzeFeedback([]);
  } catch (error) {
    console.error("Error parsing feedback from response:", error);
    throw error;
  }
};

/**
 * Helper function to create a prompt for generating interview questions
 */
export const createQuestionGenerationPrompt = (setupData: InterviewSetupData): string => {
  const { interviewType, jobDescription, positionTitle, company, topSkills } = setupData;
  
  return `
    Act as an experienced interviewer for a ${positionTitle} position at ${company}.
    Generate 5 realistic ${interviewType} interview questions based on the following:
    
    Job Description:
    ${jobDescription}
    
    Key Skills:
    ${topSkills.join(", ")}
    
    The questions should be challenging but fair. For each question, also provide the category
    it belongs to (e.g., Problem Solving, Technical Skills, Leadership, etc.).
    
    Format your response as follows:
    
    1. [Question]
    Category: [Category]
    
    2. [Question]
    Category: [Category]
    
    And so on...
  `;
};

/**
 * Helper function to create a prompt for analyzing interview responses
 */
export const createFeedbackAnalysisPrompt = (
  questions: InterviewQuestion[],
  answers: string[],
  setupData: InterviewSetupData
): string => {
  const questionsAndAnswers = questions.map((q, i) => 
    `Question (${q.category}): ${q.question}\nAnswer: ${answers[i] || "No response provided."}`
  ).join("\n\n");
  
  return `
    Act as an expert interview coach analyzing responses for a ${setupData.positionTitle} position.
    
    Candidate is interviewing for: ${setupData.positionTitle} at ${setupData.company}
    
    Review the following interview questions and answers:
    
    ${questionsAndAnswers}
    
    Provide a comprehensive analysis including:
    1. Overall score from 0-100
    2. Specific metrics (Clarity, Relevance, Structure, Examples) scored from 0-100
    3. Key strengths (at least 3)
    4. Areas for improvement (at least 3)
    5. A brief summary of overall performance
    
    Format your response as a JSON object like this:
    
    ```json
    {
      "overallScore": 80,
      "metrics": [
        {"name": "Clarity", "score": 85, "description": "How clearly you articulated your thoughts"},
        {"name": "Relevance", "score": 75, "description": "How well your answers addressed the questions"}
      ],
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
      "summary": "Overall summary of performance and key recommendations"
    }
    ```
  `;
};
