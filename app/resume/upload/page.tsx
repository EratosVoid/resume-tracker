"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
import { Input, Textarea } from "@heroui/react";

// Import our new components
import UploadZone from "./components/UploadZone";
import AnalysisProgress from "./components/AnalysisProgress";
import AnalysisResults from "./components/AnalysisResults";
import FeatureCards from "./components/FeatureCards";

interface JobContext {
  role?: string;
  description?: string;
}

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
    experience: { score: number; feedback: string };
    education: { score: number; feedback: string };
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
  const [jobContext, setJobContext] = useState<JobContext>({});

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, TXT, or image file (JPG, PNG)");
      return;
    }

    // Check for DOC files specifically and show helpful message
    if (file.type === "application/msword") {
      toast.error(
        "DOC files are not supported. Please convert to DOCX, PDF, or TXT format."
      );
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
      if (jobContext.role) formData.append("jobRole", jobContext.role);
      if (jobContext.description)
        formData.append("jobDescription", jobContext.description);

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
    setJobContext({});
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
              className="space-y-8"
            >
              {/* Main Content - Two Column Layout */}
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                  {/* Left Column - Job Context (Optional) */}
                  <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 p-8 rounded-3xl border border-primary/10 backdrop-blur-sm shadow-xl shadow-primary/5 h-full flex flex-col min-h-[600px]">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <div className="text-left">
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Job-Specific Analysis
                          </h2>
                          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-semibold">
                            OPTIONAL
                          </span>
                        </div>
                      </div>
                      <p className="text-default-600 text-base">
                        For targeted feedback, tell us about the job you're
                        applying for
                      </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6 flex-1">
                      <Input
                        label="Job Role/Title"
                        placeholder="e.g., Senior Software Engineer, Product Manager"
                        value={jobContext.role || ""}
                        onChange={(e) =>
                          setJobContext((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-base",
                          inputWrapper:
                            "bg-white/80 dark:bg-gray-800/80 border-2 border-primary/20 hover:border-primary/40 focus-within:border-primary shadow-sm",
                          label: "text-default-700 font-medium",
                        }}
                        startContent={
                          <div className="text-primary text-lg">💼</div>
                        }
                      />

                      <Textarea
                        label="Job Description"
                        placeholder="Paste the job requirements, responsibilities, and qualifications..."
                        value={jobContext.description || ""}
                        onChange={(e) =>
                          setJobContext((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        variant="bordered"
                        size="lg"
                        minRows={4}
                        classNames={{
                          input: "text-base",
                          inputWrapper:
                            "bg-white/80 dark:bg-gray-800/80 border-2 border-primary/20 hover:border-primary/40 focus-within:border-primary shadow-sm",
                          label: "text-default-700 font-medium",
                        }}
                      />
                    </div>

                    {/* Benefits Section */}
                    <div className="mt-8 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-default-200/50 backdrop-blur-sm">
                      <h3 className="text-center font-semibold text-default-700 mb-4">
                        ✨ Enhanced Analysis Features
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-success/10 rounded-xl border border-success/20">
                          <div className="text-2xl mb-2">🎯</div>
                          <p className="font-semibold text-success text-sm">
                            Keyword Match
                          </p>
                          <p className="text-xs text-default-600 mt-1">
                            Precise targeting
                          </p>
                        </div>
                        <div className="text-center p-3 bg-primary/10 rounded-xl border border-primary/20">
                          <div className="text-2xl mb-2">📊</div>
                          <p className="font-semibold text-primary text-sm">
                            ATS Score
                          </p>
                          <p className="text-xs text-default-600 mt-1">
                            System compatibility
                          </p>
                        </div>
                        <div className="text-center p-3 bg-secondary/10 rounded-xl border border-secondary/20">
                          <div className="text-2xl mb-2">💡</div>
                          <p className="font-semibold text-secondary text-sm">
                            Custom Tips
                          </p>
                          <p className="text-xs text-default-600 mt-1">
                            Tailored advice
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Upload Zone */}
                  <div className="bg-gradient-to-br from-gray-50/80 to-white/90 dark:from-gray-900/80 dark:to-gray-800/80 p-8 rounded-3xl border border-default-200 backdrop-blur-sm shadow-xl shadow-default/5 h-full flex flex-col min-h-[600px]">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-success to-primary rounded-2xl shadow-lg">
                          <span className="text-2xl">📄</span>
                        </div>
                        <div className="text-left">
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                            Upload Your Resume
                          </h2>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                            REQUIRED
                          </span>
                        </div>
                      </div>
                      <p className="text-default-600 text-base">
                        Get instant AI-powered feedback and ATS compatibility
                        score
                      </p>

                      {(jobContext.role || jobContext.description) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-2xl border border-success/20"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-success text-xl">✅</span>
                            <p className="text-success font-semibold">
                              Ready for {jobContext.role || "role-specific"}{" "}
                              analysis!
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Upload Zone - Centered */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-full">
                        <UploadZone
                          onFileUpload={handleFileUpload}
                          isUploading={uploadState !== "idle"}
                        />
                      </div>
                    </div>

                    {/* Supported Formats */}
                    <div className="mt-6 p-4 bg-default-50 dark:bg-gray-800/50 rounded-2xl border border-default-200/50">
                      <h4 className="text-center font-semibold text-default-700 mb-3">
                        📋 Supported Formats
                      </h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["PDF", "DOCX", "TXT", "JPG", "PNG"].map((format) => (
                          <span
                            key={format}
                            className="px-3 py-1 bg-white dark:bg-gray-700 border border-default-200 rounded-lg text-sm font-medium text-default-600"
                          >
                            {format}
                          </span>
                        ))}
                      </div>
                      <p className="text-center text-xs text-default-500 mt-2">
                        Maximum file size: 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section - More Compact */}
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">
                    Why Choose Our AI Analysis?
                  </h2>
                  <p className="text-default-600">
                    Advanced AI technology for comprehensive resume feedback
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
