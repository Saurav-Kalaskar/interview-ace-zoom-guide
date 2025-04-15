
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, SkipForward, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface InterviewQuestionProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  category?: string;
  onNext: () => void;
  onComplete: (answer: string) => void;
}

const InterviewQuestion: React.FC<InterviewQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  category,
  onNext,
  onComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setProgress((120 - (timeLeft - 1)) / 120 * 100);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRecording, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording simulation
      setIsRecording(true);
      setAnswer("Recording simulation is active. In a real implementation, this would capture audio from the Zoom SDK.");
    } else {
      // Stop recording and submit answer
      setIsRecording(false);
      onComplete(answer);
    }
  };

  const skipQuestion = () => {
    setIsRecording(false);
    onNext();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="border-b bg-card">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Question {questionNumber} of {totalQuestions}</span>
            <CardTitle className="text-xl font-medium mt-1">Interview Question</CardTitle>
          </div>
          {category && <Badge variant="outline">{category}</Badge>}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="bg-secondary/50 p-4 rounded-lg mb-6">
          <p className="text-lg font-medium">{question}</p>
        </div>

        <div className="space-y-4">
          {isRecording ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                <div className="recording-indicator" />
                <span className="text-sm font-medium">Recording...</span>
              </div>
              
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Time remaining</span>
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <p className="text-sm text-center text-muted-foreground">
                Answer the question clearly and concisely. Try to structure your response with an example.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <Timer className="h-10 w-10 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                Click the microphone button below when you're ready to answer.
                <br />You'll have 2 minutes to respond.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t p-6 flex justify-between bg-secondary/30">
        <Button 
          variant="outline" 
          onClick={skipQuestion}
          disabled={isRecording}
        >
          <SkipForward className="h-4 w-4 mr-2" />
          Skip
        </Button>
        <Button 
          variant={isRecording ? "destructive" : "default"}
          className={isRecording ? "" : "bg-interview-blue hover:bg-interview-blue/90"}
          onClick={toggleRecording}
        >
          {isRecording ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewQuestion;
