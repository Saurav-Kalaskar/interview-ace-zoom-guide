
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeUpload from "./ResumeUpload";
import { ChevronRight, Briefcase, FileText, List, User } from "lucide-react";

interface InterviewSetupProps {
  onStartInterview: (setupData: InterviewSetupData) => void;
}

export interface InterviewSetupData {
  interviewType: "behavioral" | "technical";
  resumeFile: File | null;
  jobDescription: string;
  topSkills: string[];
  positionTitle: string;
  company: string;
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartInterview }) => {
  const [setupData, setSetupData] = useState<InterviewSetupData>({
    interviewType: "behavioral",
    resumeFile: null,
    jobDescription: "",
    topSkills: [""],
    positionTitle: "",
    company: "",
  });

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...setupData.topSkills];
    updatedSkills[index] = value;
    setSetupData({ ...setupData, topSkills: updatedSkills });
  };

  const addSkill = () => {
    if (setupData.topSkills.length < 5) {
      setSetupData({ ...setupData, topSkills: [...setupData.topSkills, ""] });
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = setupData.topSkills.filter((_, i) => i !== index);
    setSetupData({ ...setupData, topSkills: updatedSkills });
  };

  const handleResumeUpload = (file: File) => {
    setSetupData({ ...setupData, resumeFile: file });
  };

  const handleStartInterview = () => {
    // Filter out empty skills
    const filteredSkills = setupData.topSkills.filter(skill => skill.trim() !== "");
    onStartInterview({
      ...setupData,
      topSkills: filteredSkills
    });
  };

  const isSetupComplete = () => {
    return (
      setupData.jobDescription.trim() !== "" &&
      setupData.positionTitle.trim() !== "" &&
      setupData.company.trim() !== "" &&
      setupData.topSkills.some(skill => skill.trim() !== "")
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-interview-navy text-white rounded-t-lg">
        <CardTitle className="text-2xl font-semibold">Interview Setup</CardTitle>
        <CardDescription className="text-interview-gray">
          Configure your mock interview session
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basics">
              <User className="mr-2 h-4 w-4" />
              Basics
            </TabsTrigger>
            <TabsTrigger value="resume">
              <FileText className="mr-2 h-4 w-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="skills">
              <List className="mr-2 h-4 w-4" />
              Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <div className="space-y-4">
              <div>
                <Label htmlFor="interview-type" className="text-lg font-medium">Interview Type</Label>
                <RadioGroup
                  value={setupData.interviewType}
                  onValueChange={(value) => setSetupData({ ...setupData, interviewType: value as "behavioral" | "technical" })}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="behavioral" id="behavioral" />
                    <Label htmlFor="behavioral">Behavioral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="technical" />
                    <Label htmlFor="technical">Technical</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position-title" className="text-lg font-medium">Position Title</Label>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
                  <Input
                    id="position-title"
                    placeholder="e.g. Software Engineer, Product Manager"
                    value={setupData.positionTitle}
                    onChange={(e) => setSetupData({ ...setupData, positionTitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-lg font-medium">Company</Label>
                <Input
                  id="company"
                  placeholder="e.g. Google, Amazon, Startup"
                  value={setupData.company}
                  onChange={(e) => setSetupData({ ...setupData, company: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-description" className="text-lg font-medium">Job Description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here..."
                  className="min-h-[120px]"
                  value={setupData.jobDescription}
                  onChange={(e) => setSetupData({ ...setupData, jobDescription: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resume">
            <ResumeUpload onFileUpload={handleResumeUpload} />
            {setupData.resumeFile && (
              <div className="mt-4 p-3 bg-interview-gray/30 rounded flex items-center justify-between">
                <span className="text-sm font-medium truncate">{setupData.resumeFile.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSetupData({...setupData, resumeFile: null})}
                >
                  Remove
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="skills">
            <div className="space-y-4">
              <Label className="text-lg font-medium">Your Top Skills (Up to 5)</Label>
              <p className="text-sm text-muted-foreground">
                List the skills you want to highlight during the interview
              </p>
              
              {setupData.topSkills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Skill ${index + 1}`}
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                  />
                  {setupData.topSkills.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeSkill(index)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              
              {setupData.topSkills.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addSkill}
                >
                  Add Another Skill
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t p-6 bg-secondary/50">
        <div className="text-sm text-muted-foreground">
          {isSetupComplete() 
            ? "Ready to start your interview practice!" 
            : "Fill in the required fields to continue"}
        </div>
        <Button 
          onClick={handleStartInterview}
          disabled={!isSetupComplete()}
          className="bg-interview-blue hover:bg-interview-blue/90"
        >
          Start Interview
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewSetup;
