
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Monitor } from "lucide-react";

interface ZoomIntegrationProps {
  isConnected: boolean;
  onConnect: () => void;
}

const ZoomIntegration: React.FC<ZoomIntegrationProps> = ({ isConnected, onConnect }) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-lg flex items-center">
          <Video className="h-5 w-5 mr-2 text-interview-blue" />
          Zoom Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isConnected ? (
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="h-12 w-12 rounded-full bg-interview-green/20 flex items-center justify-center">
              <Monitor className="h-6 w-6 text-interview-green" />
            </div>
            <p className="font-medium">Connected to Zoom</p>
            <p className="text-sm text-muted-foreground">
              You can now practice your interviews through your Zoom meeting
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Connect to Zoom to enable audio integration for your mock interviews
            </p>
            <Button 
              onClick={onConnect}
              className="bg-[#0E72ED] hover:bg-[#0E72ED]/90 text-white"
            >
              <Video className="mr-2 h-4 w-4" />
              Connect to Zoom
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ZoomIntegration;
