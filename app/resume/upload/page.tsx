"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  UploadIcon,
  FileTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  UserIcon,
  BrainIcon,
  ArrowLeftIcon,
  XIcon,
} from "lucide-react";

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

export default function ResumeUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadedFile(file);
    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      console.log("FormData entries:", Array.from(formData.entries()));

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
        // Don't set Content-Type header - let the browser set it with boundary
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
        setTimeout(() => {
          setIsAnalyzing(false);
          onOpen();
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
      setIsAnalyzing(false);
      setUploadedFile(null);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setFileInfo(null);
    setAnalysis(null);
    setIsAnalyzing(false);
    setUploadProgress(0);
    onClose();
  };

  const downloadFile = () => {
    if (fileInfo) {
      const link = document.createElement("a");
      link.href = `/api/files/${fileInfo.fileId}`;
      link.download = fileInfo.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-default-50">
      {/* Header */}
      <div className="bg-white border-b border-default-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button
                isIconOnly
                variant="light"
                startContent={<ArrowLeftIcon className="h-4 w-4" />}
              />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Upload & Score Your Resume</h1>
              <p className="text-default-600">
                Get instant AI-powered feedback and ATS compatibility score
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UploadIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Upload Your Resume
                    </h2>
                    <p className="text-default-600">
                      Support for PDF, DOCX, and TXT files
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-default-300 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                      <FileTextIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        {dragActive
                          ? "Drop your resume here"
                          : "Drop your resume here"}
                      </h3>
                      <p className="text-default-600 mb-4">
                        or click to browse files
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                      />
                      <Button
                        color="primary"
                        className="cursor-pointer"
                        startContent={<UploadIcon className="h-4 w-4" />}
                        onPress={() =>
                          document.getElementById("resume-upload")?.click()
                        }
                      >
                        Choose File
                      </Button>
                    </div>
                    <p className="text-sm text-default-500">
                      Supported formats: PDF, DOCX, TXT (Max 5MB)
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardBody className="text-center p-6">
                  <BrainIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                  <p className="text-sm text-default-600">
                    Advanced parsing using Google Gemini AI
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="text-center p-6">
                  <TrendingUpIcon className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Instant Scoring</h3>
                  <p className="text-sm text-default-600">
                    Get your ATS compatibility score in seconds
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="text-center p-6">
                  <SparklesIcon className="h-12 w-12 text-warning mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Actionable Tips</h3>
                  <p className="text-sm text-default-600">
                    Specific suggestions to improve your resume
                  </p>
                </CardBody>
              </Card>
            </div>
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <Card>
              <CardBody className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileTextIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{uploadedFile.name}</h3>
                        <p className="text-sm text-default-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={resetUpload}
                      startContent={<XIcon className="h-4 w-4" />}
                    />
                  </div>

                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                    <BrainIcon className="h-12 w-12 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Analyzing Your Resume
                    </h2>
                    <p className="text-default-600 mb-6">
                      Our AI is parsing your resume and calculating your ATS
                      score...
                    </p>
                    <Progress
                      value={uploadProgress}
                      color="primary"
                      className="max-w-md mx-auto"
                      showValueLabel={true}
                    />
                  </div>
                  <div className="text-sm text-default-500">
                    {uploadProgress < 30 && "Uploading file..."}
                    {uploadProgress >= 30 &&
                      uploadProgress < 60 &&
                      "Extracting text..."}
                    {uploadProgress >= 60 &&
                      uploadProgress < 90 &&
                      "Analyzing with AI..."}
                    {uploadProgress >= 90 && "Finalizing results..."}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ) : null}

        {/* Analysis Results Modal */}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Resume Analysis Complete
                    </h2>
                    <p className="text-default-600 text-sm">
                      Here's your detailed breakdown
                    </p>
                  </div>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={resetUpload}
                  startContent={<XIcon className="h-4 w-4" />}
                />
              </div>
            </ModalHeader>
            <ModalBody className="space-y-6">
              {analysis && (
                <>
                  {/* File Information */}
                  {fileInfo && (
                    <Card>
                      <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <FileTextIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {fileInfo.originalName}
                              </h4>
                              <p className="text-sm text-default-600">
                                {(fileInfo.fileSize / 1024 / 1024).toFixed(2)}{" "}
                                MB • Uploaded{" "}
                                {new Date(fileInfo.uploadedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="bordered"
                            onPress={downloadFile}
                            startContent={<UploadIcon className="h-4 w-4" />}
                          >
                            Download
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {/* Overall Score */}
                  <Card>
                    <CardBody className="text-center p-6">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {analysis.overallScore}%
                      </div>
                      <Chip
                        color={getScoreColor(analysis.overallScore)}
                        variant="flat"
                        size="lg"
                      >
                        {getScoreLabel(analysis.overallScore)}
                      </Chip>
                      <p className="text-default-600 mt-2">
                        Overall ATS Compatibility Score
                      </p>
                    </CardBody>
                  </Card>

                  {/* Extracted Information */}
                  {analysis.extractedInfo && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Extracted Information
                      </h3>
                      <Card>
                        <CardBody className="space-y-3">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-default-600">Name</p>
                              <p className="font-medium">
                                {analysis.extractedInfo.name || "Not found"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-default-600">Email</p>
                              <p className="font-medium">
                                {analysis.extractedInfo.email || "Not found"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-default-600">Phone</p>
                              <p className="font-medium">
                                {analysis.extractedInfo.phone || "Not found"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-default-600">
                                Location
                              </p>
                              <p className="font-medium">
                                {analysis.extractedInfo.location || "Not found"}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}

                  {/* Section Scores */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Detailed Breakdown
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(analysis.sections).map(
                        ([key, section]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 bg-default-100 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </h4>
                                <Chip
                                  color={getScoreColor(section.score)}
                                  variant="flat"
                                  size="sm"
                                >
                                  {section.score}%
                                </Chip>
                              </div>
                              <p className="text-sm text-default-600">
                                {section.feedback}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-success mr-2" />
                        Matched Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.matchedSkills.map((skill, index) => (
                          <Chip
                            key={index}
                            color="success"
                            variant="flat"
                            size="sm"
                          >
                            {skill}
                          </Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <AlertCircleIcon className="h-5 w-5 text-warning mr-2" />
                        Suggested Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.map((skill, index) => (
                          <Chip
                            key={index}
                            color="warning"
                            variant="flat"
                            size="sm"
                          >
                            {skill}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Improvements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Improvement Suggestions
                    </h3>
                    <div className="space-y-3">
                      {analysis.improvements.map((improvement, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg"
                        >
                          <div className="p-1 bg-primary/10 rounded-full mt-0.5">
                            <SparklesIcon className="h-3 w-3 text-primary" />
                          </div>
                          <p className="text-sm">{improvement}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-default-200">
                    <Link href="/resume/create" className="flex-1">
                      <Button
                        color="primary"
                        className="w-full"
                        startContent={<SparklesIcon className="h-4 w-4" />}
                      >
                        Create New Resume with AI
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="flex-1">
                      <Button
                        variant="bordered"
                        className="w-full"
                        startContent={<UserIcon className="h-4 w-4" />}
                      >
                        Save Analysis & Track Progress
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
