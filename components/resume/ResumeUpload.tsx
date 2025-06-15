"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Switch,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { UploadIcon, FileIcon, CheckIcon, XIcon } from "lucide-react";

interface ResumeUploadProps {
  jobSlug: string;
  jobTitle: string;
  onSubmissionComplete?: (result: any) => void;
}

interface FormData {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeText: string;
  createProfile: boolean;
}

interface UploadedFile {
  file: File;
  url?: string;
  parsed?: boolean;
  text?: string;
}

export default function ResumeUpload({
  jobSlug,
  jobTitle,
  onSubmissionComplete,
}: ResumeUploadProps) {
  const [formData, setFormData] = useState<FormData>({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    resumeText: "",
    createProfile: false,
  });

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, TXT or image (JPG, PNG) file");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadedFile({ file });
    setUploadProgress(10);

    try {
      let text = "";

      // Handle different file types
      if (file.type === "text/plain") {
        text = await file.text();
      } else if (file.type === "application/pdf") {
        // PDF parsing logic
        text = "PDF content parsed...";
        toast.success("PDF parsing is simulated in this demo");
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // DOCX parsing logic
        text = "DOCX content parsed...";
        toast.success("DOCX parsing is simulated in this demo");
      } else if (file.type.startsWith("image/")) {
        // Handle image files
        const imageUrl = URL.createObjectURL(file);
        // You might want to use OCR here in a real implementation
        text = `Image uploaded: ${file.name}`;
        setUploadedFile((prev) =>
          prev ? { ...prev, parsed: true, text, url: imageUrl } : null
        );
        toast.success("Image uploaded successfully");
      }

      setUploadProgress(100);
      setUploadedFile((prev) =>
        prev ? { ...prev, parsed: true, text } : null
      );
      setFormData((prev) => ({ ...prev, resumeText: text }));
      toast.success("File processed successfully!");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file");
      setUploadedFile(null);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: false,
  });

  const handleInputChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSwitchChange = (field: keyof FormData) => (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.applicantName || !formData.applicantEmail) {
      toast.error("Please fill in required fields");
      return;
    }

    if (!formData.resumeText) {
      toast.error("Please upload a resume or paste resume text");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobSlug,
          applicantName: formData.applicantName,
          applicantEmail: formData.applicantEmail,
          applicantPhone: formData.applicantPhone,
          resumeText: formData.resumeText,
          fileName: uploadedFile?.file.name,
          fileType: uploadedFile?.file.type,
          createProfile: formData.createProfile,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setAnalysisResult(result);
      toast.success("Application submitted successfully!");
      onOpen(); // Show results modal

      if (onSubmissionComplete) {
        onSubmissionComplete(result);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    setUploadProgress(0);
    setFormData((prev) => ({ ...prev, resumeText: "" }));
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Apply for {jobTitle}</h3>
            <p className="text-small text-default-500">
              Upload your resume or paste your resume text below
            </p>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Upload Area */}
            <div className="space-y-4">
              <div className="text-sm font-medium">Resume Upload</div>

              {!uploadedFile && (
                <motion.div
                  {...(getRootProps() as any)}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-default-300 hover:border-primary/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input {...getInputProps()} />
                  <UploadIcon className="mx-auto h-12 w-12 text-default-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      {isDragActive
                        ? "Drop your resume here"
                        : "Upload your resume"}
                    </p>
                    <p className="text-small text-default-500">
                      Drag and drop or click to select PDF, DOCX, TXT, PNG or
                      JPG files (max 5MB)
                    </p>
                  </div>
                </motion.div>
              )}

              {uploadedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {uploadedFile.file.name}
                      </span>
                      {uploadedFile.parsed && (
                        <CheckIcon className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={removeFile}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  {uploadedFile.file.type.startsWith("image/") &&
                    uploadedFile.url && (
                      <div className="mt-2 mb-4">
                        <img
                          src={uploadedFile.url}
                          alt="Uploaded resume"
                          className="max-h-40 rounded-md mx-auto"
                        />
                      </div>
                    )}

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <Progress value={uploadProgress} className="mb-2" />
                  )}

                  <p className="text-small text-default-500">
                    {uploadedFile.parsed
                      ? "File processed successfully"
                      : "Processing..."}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Resume Text Area */}
            <div className="space-y-2">
              <Textarea
                label="Resume Text"
                placeholder="Or paste your resume text here..."
                value={formData.resumeText}
                onChange={handleInputChange("resumeText")}
                minRows={6}
                description="You can either upload a file above or paste your resume text here"
              />
            </div>

            {/* Applicant Information */}
            <div className="space-y-4">
              <div className="text-sm font-medium">Contact Information</div>

              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.applicantName}
                onChange={handleInputChange("applicantName")}
                isRequired
              />

              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                value={formData.applicantEmail}
                onChange={handleInputChange("applicantEmail")}
                isRequired
              />

              <Input
                label="Phone Number"
                placeholder="Enter your phone number (optional)"
                value={formData.applicantPhone}
                onChange={handleInputChange("applicantPhone")}
              />
            </div>

            {/* Profile Creation Option */}
            <Switch
              isSelected={formData.createProfile}
              onValueChange={handleSwitchChange("createProfile")}
            >
              Create a profile to track my applications
            </Switch>

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Analyzing Resume..." : "Submit Application"}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Results Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h3>Application Results</h3>
          </ModalHeader>
          <ModalBody>
            {analysisResult && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {analysisResult.submission.atsScore}%
                  </div>
                  <p className="text-default-600">ATS Match Score</p>
                </div>

                {analysisResult.submission.analysis && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-2">Skills Matched</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.submission.analysis.skillsMatched.map(
                          (skill: string, index: number) => (
                            <div
                              key={index}
                              className="bg-success/20 text-success px-2 py-1 rounded text-sm"
                            >
                              {skill}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Skills Missing</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.submission.analysis.skillsMissing.map(
                          (skill: string, index: number) => (
                            <div
                              key={index}
                              className="bg-warning/20 text-warning px-2 py-1 rounded text-sm"
                            >
                              {skill}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Strengths</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.submission.analysis.strengthsIdentified.map(
                          (strength: string, index: number) => (
                            <li key={index} className="text-sm">
                              {strength}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">
                        Improvement Suggestions
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.submission.analysis.improvementSuggestions.map(
                          (suggestion: string, index: number) => (
                            <li key={index} className="text-sm">
                              {suggestion}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
