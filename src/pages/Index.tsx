
import React, { useState, useContext } from "react";
import InterviewSetup, { InterviewSetupData } from "@/components/InterviewSetup";
import InterviewQuestion from "@/components/InterviewQuestion";
import FeedbackPanel from "@/components/FeedbackPanel";
import ZoomIntegration from "@/components/ZoomIntegration";
import ApiKeyInput from "@/components/ApiKeyInput";
import ApiContext from "@/context/ApiContext";
import { 
  simulateZoomConnection,
  InterviewQuestion as IInterviewQuestion,
  FeedbackData
} from "@/services/interviewService";
import {
  generateQuestionsWithGemini,
  analyzeFeedbackWithGemini
} from "@/services/geminiService";
import { useToast } from "@/components/ui/use-toast";

enum InterviewStage {
  SETUP,
  QUESTIONS,
  FEEDBACK
}

const Index = () => {
  const [stage, setStage] = useState<InterviewStage>(InterviewStage.SETUP);
  const [setupData, setSetupData] = useState<InterviewSetupData | null>(null);
  const [questions, setQuestions] = useState<IInterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isZoomConnected, setIsZoomConnected] = useState(false);
  const { toast } = useToast();
  const { geminiApiKey, setGeminiApiKey } = useContext(ApiContext);

  const handleStartInterview = async (data: InterviewSetupData) => {
    setSetupData(data);
    
    try {
      toast({
        title: "Generating Questions",
        description: "Using AI to create custom questions based on your inputs...",
      });
      
      // Generate questions using Gemini API
      const generatedQuestions = await generateQuestionsWithGemini(data);
      setQuestions(generatedQuestions);
      
      // Reset other state
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setFeedback(null);
      
      // Move to questions stage
      setStage(InterviewStage.QUESTIONS);
      
      toast({
        title: "Interview Ready",
        description: `${data.interviewType.charAt(0).toUpperCase() + data.interviewType.slice(1)} interview for ${data.positionTitle} at ${data.company}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate interview questions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Show a processing toast when analyzing feedback
      toast({
        title: "Analyzing Responses",
        description: "Our AI is analyzing your interview performance...",
      });
      
      // If all questions are complete, generate feedback
      if (setupData) {
        analyzeFeedbackWithGemini(answers, setupData, questions)
          .then(feedbackData => {
            setFeedback(feedbackData);
            setStage(InterviewStage.FEEDBACK);
          })
          .catch(error => {
            toast({
              title: "Error",
              description: "Failed to analyze feedback. Please try again.",
              variant: "destructive",
            });
          });
      }
    }
  };

  const handleCompleteQuestion = (answer: string) => {
    // Save the answer
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);
    
    // Move to next question
    handleNextQuestion();
  };

  const handleRestartInterview = () => {
    // Go back to setup stage
    setStage(InterviewStage.SETUP);
  };

  const connectToZoom = async () => {
    // Show a loading toast
    toast({
      title: "Connecting to Zoom...",
      description: "Please wait while we establish connection.",
    });
    
    // Call the mock connection function
    const connected = await simulateZoomConnection();
    
    if (connected) {
      setIsZoomConnected(true);
      toast({
        title: "Connected to Zoom",
        description: "Your interview audio will be processed through Zoom.",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Zoom. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center">
            <span className="text-interview-blue">Interview</span>
            <span>Prep Assistant</span>
          </h1>
          <div className="text-sm text-muted-foreground">
            Zoom Hackathon Project
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-8">
          {!geminiApiKey && (
            <ApiKeyInput 
              onApiKeySubmit={setGeminiApiKey}
              isKeySet={!!geminiApiKey} 
            />
          )}

          <ZoomIntegration isConnected={isZoomConnected} onConnect={connectToZoom} />
          
          {stage === InterviewStage.SETUP && (
            <InterviewSetup onStartInterview={handleStartInterview} />
          )}
          
          {stage === InterviewStage.QUESTIONS && questions.length > 0 && (
            <InterviewQuestion
              question={questions[currentQuestionIndex].question}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              category={questions[currentQuestionIndex].category}
              onNext={handleNextQuestion}
              onComplete={handleCompleteQuestion}
            />
          )}
          
          {stage === InterviewStage.FEEDBACK && feedback && (
            <FeedbackPanel feedback={feedback} onRestart={handleRestartInterview} />
          )}
        </div>
      </main>

      <footer className="py-6 border-t bg-secondary/30 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          Interview Prep Assistant &copy; 2025 | Zoom Hackathon Project
        </div>
      </footer>
    </div>
  );
};

export default Index;
