"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { UploadIcon, FileTextIcon } from "lucide-react";

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function UploadZone({
  onFileUpload,
  isUploading,
}: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UploadIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Upload Your Resume</h2>
            <p className="text-default-600">
              Support for PDF, DOCX, and TXT files
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-default-300 hover:border-primary/50 hover:bg-default-50"
          } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-6">
            <div className="p-6 bg-primary/10 rounded-full w-fit mx-auto">
              <FileTextIcon className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3">
                {dragActive ? "Drop your resume here" : "Drop your resume here"}
              </h3>
              <p className="text-default-600 mb-6">
                or click to browse files from your computer
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
                disabled={isUploading}
              />
              <Button
                color="primary"
                size="lg"
                className="cursor-pointer px-8"
                startContent={<UploadIcon className="h-5 w-5" />}
                onPress={() =>
                  document.getElementById("resume-upload")?.click()
                }
                isDisabled={isUploading}
                isLoading={isUploading}
              >
                {isUploading ? "Uploading..." : "Choose File"}
              </Button>
            </div>
            <div className="text-sm text-default-500 space-y-1">
              <p>Supported formats: PDF, DOCX, TXT, PNG, JPG</p>
              <p>Maximum file size: 5MB</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
