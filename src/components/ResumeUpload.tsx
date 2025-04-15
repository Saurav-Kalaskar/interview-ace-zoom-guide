
import React, { useState, useRef } from "react";
import { FileUp, Check } from "lucide-react";

interface ResumeUploadProps {
  onFileUpload: (file: File) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    // Check if file is PDF or DOC/DOCX
    const fileType = file.type;
    if (
      fileType === "application/pdf" || 
      fileType === "application/msword" || 
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setFileName(file.name);
      onFileUpload(file);
    } else {
      alert("Please upload a PDF or Word document");
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`resume-drop-area ${isDragging ? "active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
        <FileUp className={`mx-auto h-12 w-12 mb-4 ${fileName ? "text-interview-green" : "text-interview-blue"}`} />
        {fileName ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center text-interview-green mb-2">
              <Check className="mr-2 h-5 w-5" />
              <span className="font-medium">Resume uploaded</span>
            </div>
            <p className="text-sm text-muted-foreground">{fileName}</p>
            <p className="text-xs text-muted-foreground mt-4">Click or drag to replace</p>
          </div>
        ) : (
          <>
            <h3 className="font-medium text-lg mb-2">Upload your resume</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your resume here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX</p>
          </>
        )}
      </div>

      <div className="text-sm text-center text-muted-foreground">
        Your resume will help generate more relevant interview questions
      </div>
    </div>
  );
};

export default ResumeUpload;
