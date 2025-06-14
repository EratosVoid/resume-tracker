"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";

// Import our new components
import UploadZone from "./components/UploadZone";
import AnalysisProgress from "./components/AnalysisProgress";
import AnalysisResults from "./components/AnalysisResults";
import FeatureCards from "./components/FeatureCards";

interface FileInfo {
  fileId: string;
  filePath: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

interface AnalysisResult {
  overallScore: number;
  tone: {
    category: string;
    reasoning: string;
  };
  sections: {
    formatting: { score: number; feedback: string };
    content: { score: number; feedback: string };
    keywords: { score: number; feedback: string };
    atsCompatibility: { score: number; feedback: string };
  };
  extractedInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experience: string;
    education: string;
    skills: string[];
  };
  improvements: string[];
  matchedSkills: string[];
  missingSkills: string[];
}

type UploadState = "idle" | "uploading" | "analyzing" | "complete";

export default function ResumeUploadPage() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "image/jpeg",
      "image/png",
      "image/jpg"
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, TXT, or image file (JPG, PNG)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadedFile(file);
    setUploadState("uploading");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
        setFileInfo(data.fileInfo);

        // Small delay for better UX
        setTimeout(() => {
          setUploadState("complete");
        }, 500);

        toast.success("Resume analyzed successfully!");
      } else {
        throw new Error(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze resume"
      );
      resetUpload();
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setFileInfo(null);
    setAnalysis(null);
    setUploadState("idle");
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-default-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                isIconOnly
                variant="light"
                startContent={<ArrowLeftIcon className="h-4 w-4" />}
              />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Resume Analysis
              </h1>
              <p className="text-default-600">
                Get instant AI-powered feedback and ATS compatibility score
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {uploadState === "idle" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Upload Zone */}
              <div className="max-w-3xl mx-auto">
                <UploadZone
                  onFileUpload={handleFileUpload}
                  isUploading={uploadState !== "idle"}
                />
              </div>

              {/* Features Section */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Why Choose Our AI Analysis?
                  </h2>
                  <p className="text-default-600 max-w-2xl mx-auto">
                    Our advanced AI technology provides comprehensive resume
                    analysis to help you stand out in today's competitive job
                    market.
                  </p>
                </div>
                <FeatureCards />
              </div>
            </motion.div>
          )}

          {(uploadState === "uploading" || uploadState === "analyzing") &&
            uploadedFile && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <AnalysisProgress
                  fileName={uploadedFile.name}
                  fileSize={uploadedFile.size}
                  progress={uploadProgress}
                  onCancel={resetUpload}
                />
              </motion.div>
            )}

          {uploadState === "complete" && analysis && uploadedFile && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <AnalysisResults
                analysis={analysis}
                fileName={uploadedFile.name}
                onStartOver={resetUpload}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
