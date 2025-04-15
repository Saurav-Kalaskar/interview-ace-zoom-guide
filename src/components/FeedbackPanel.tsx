
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, FileText, RefreshCcw } from "lucide-react";

interface FeedbackMetric {
  name: string;
  score: number;
  description: string;
}

interface FeedbackData {
  overallScore: number;
  metrics: FeedbackMetric[];
  strengths: string[];
  improvements: string[];
  summary: string;
}

interface FeedbackPanelProps {
  feedback: FeedbackData;
  onRestart: () => void;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback, onRestart }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-interview-green";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-interview-green";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-interview-navy text-white rounded-t-lg">
        <CardTitle className="text-2xl font-semibold flex items-center">
          <BadgeCheck className="mr-2 h-6 w-6" />
          Interview Feedback
        </CardTitle>
        <CardDescription className="text-interview-gray">
          AI-powered analysis of your interview performance
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col items-center text-center border-b pb-6">
          <h3 className="text-2xl font-bold mb-1">Overall Performance</h3>
          <div className={`text-4xl font-bold ${getScoreColor(feedback.overallScore)}`}>
            {feedback.overallScore}/100
          </div>
          <p className="text-muted-foreground mt-2 max-w-md">
            {feedback.summary}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              {feedback.metrics.map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{metric.name}</span>
                    <span className={`font-semibold ${getScoreColor(metric.score)}`}>
                      {metric.score}%
                    </span>
                  </div>
                  <Progress 
                    value={metric.score} 
                    className={`h-2 ${getProgressColor(metric.score)}`} 
                  />
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center text-interview-green">
                <BadgeCheck className="mr-2 h-5 w-5" />
                Strengths
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {feedback.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center text-yellow-500">
                Areas for Improvement
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {feedback.improvements.map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-6 flex justify-between bg-secondary/30">
        <Button variant="outline" className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          Save Report
        </Button>
        <Button 
          onClick={onRestart} 
          className="bg-interview-blue hover:bg-interview-blue/90"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Practice Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedbackPanel;
