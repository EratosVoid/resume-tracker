"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
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
} from "lucide-react";

export default function ResumeUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Mock analysis result for demo
  const mockAnalysis = {
    overallScore: 78,
    sections: {
      formatting: { score: 85, feedback: "Well-structured and easy to read" },
      content: {
        score: 75,
        feedback:
          "Good experience details, could add more quantified achievements",
      },
      keywords: { score: 70, feedback: "Missing some key industry terms" },
      atsCompatibility: {
        score: 82,
        feedback: "Compatible with most ATS systems",
      },
    },
    improvements: [
      "Add quantified achievements with specific numbers and percentages",
      "Include more industry-specific keywords for your target role",
      "Consider adding a professional summary section",
      "Optimize bullet points for better readability",
    ],
    matchedSkills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    missingSkills: ["TypeScript", "Docker", "Kubernetes", "GraphQL"],
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event?.target?.files?.[0] as any;
    if (!file) return;

    setUploadedFile(file);
    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      onOpen();
    }, 3000);
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
    <div className="min-h-screen bg-default-50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-default-200">
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
                <div className="border-2 border-dashed border-default-300 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                      <FileTextIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Drop your resume here
                      </h3>
                      <p className="text-default-600 mb-4">
                        or click to browse files
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload">
                        <Button
                          color="primary"
                          className="cursor-pointer"
                          startContent={<UploadIcon className="h-4 w-4" />}
                        >
                          Choose File
                        </Button>
                      </label>
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
                      value={75}
                      color="primary"
                      className="max-w-md mx-auto"
                      showValueLabel={true}
                    />
                  </div>
                  <div className="text-sm text-default-500">
                    File: {uploadedFile?.name || "No file selected"}
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
            </ModalHeader>
            <ModalBody className="space-y-6">
              {analysis && (
                <>
                  {/* Overall Score */}
                  <Card>
                    <CardBody className="text-center p-6">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {analysis?.overallScore}%
                      </div>
                      <Chip
                        color={getScoreColor(analysis?.overallScore)}
                        variant="flat"
                        size="lg"
                      >
                        {getScoreLabel(analysis?.overallScore)}
                      </Chip>
                      <p className="text-default-600 mt-2">
                        Overall ATS Compatibility Score
                      </p>
                    </CardBody>
                  </Card>

                  {/* Section Scores */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Detailed Breakdown
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(analysis.sections).map(
                        ([key, section]: any) => (
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
                                  color={getScoreColor(section?.score)}
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
                        {analysis?.matchedSkills.map(
                          (skill: any, index: any) => (
                            <Chip
                              key={index}
                              color="success"
                              variant="flat"
                              size="sm"
                            >
                              {skill}
                            </Chip>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <AlertCircleIcon className="h-5 w-5 text-warning mr-2" />
                        Suggested Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis?.missingSkills.map(
                          (skill: any, index: any) => (
                            <Chip
                              key={index}
                              color="warning"
                              variant="flat"
                              size="sm"
                            >
                              {skill}
                            </Chip>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Improvements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Improvement Suggestions
                    </h3>
                    <div className="space-y-3">
                      {analysis?.improvements.map(
                        (improvement: any, index: any) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg"
                          >
                            <div className="p-1 bg-primary/10 rounded-full mt-0.5">
                              <SparklesIcon className="h-3 w-3 text-primary" />
                            </div>
                            <p className="text-sm">{improvement}</p>
                          </div>
                        )
                      )}
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
