
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
  isKeySet: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit, isKeySet }) => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key",
        variant: "destructive",
      });
      return;
    }
    
    // Store in localStorage for convenience
    localStorage.setItem("geminiApiKey", apiKey);
    
    // Call the callback
    onApiKeySubmit(apiKey);
    
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved for this session",
    });
    
    // Clear the input
    setApiKey("");
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md mb-6">
      <CardHeader className="border-b">
        <CardTitle className="text-lg flex items-center">
          <Key className="h-5 w-5 mr-2 text-interview-blue" />
          Google Gemini API Setup
        </CardTitle>
        <CardDescription>
          Configure your API key to enable AI interview features
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {isKeySet ? (
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="h-12 w-12 rounded-full bg-interview-green/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-interview-green" />
            </div>
            <p className="font-medium">API Key Configured</p>
            <p className="text-sm text-muted-foreground">
              Your API key has been saved for this session
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter your Google Gemini API key to enable the AI interview features.
                You can get an API key from the <a href="https://ai.google.dev/tutorials/setup" target="_blank" rel="noopener noreferrer" className="text-interview-blue hover:underline">Google AI Studio</a>.
              </p>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter your Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
              <Button type="submit" className="w-full bg-interview-blue hover:bg-interview-blue/90">
                Save API Key
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
