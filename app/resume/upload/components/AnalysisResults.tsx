"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
} from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  SparklesIcon,
  UserIcon,
  TrendingUpIcon,
  FileTextIcon,
  RefreshCwIcon,
} from "lucide-react";

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

interface AnalysisResultsProps {
  analysis: AnalysisResult;
  fileName: string;
  onStartOver: () => void;
}

export default function AnalysisResults({
  analysis,
  fileName,
  onStartOver,
}: AnalysisResultsProps) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header with Overall Score */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircleIcon className="h-6 w-6 text-success" />
                  <h1 className="text-2xl font-bold">Analysis Complete!</h1>
                </div>
                <p className="text-default-600">
                  Here's your detailed resume analysis for{" "}
                  <span className="font-medium">{fileName}</span>
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-primary mb-2">
                  {analysis.overallScore}
                </div>
                <Chip
                  color={getScoreColor(analysis.overallScore)}
                  variant="flat"
                  size="lg"
                  className="font-semibold"
                >
                  {getScoreLabel(analysis.overallScore)}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Extracted Information */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Extracted Information</h2>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-default-600 mb-1">Name</p>
                  <p className="font-medium">
                    {analysis.extractedInfo.name || "Not found"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-default-600 mb-1">Email</p>
                  <p className="font-medium">
                    {analysis.extractedInfo.email || "Not found"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-default-600 mb-1">Phone</p>
                  <p className="font-medium">
                    {analysis.extractedInfo.phone || "Not found"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-default-600 mb-1">Location</p>
                  <p className="font-medium">
                    {analysis.extractedInfo.location || "Not found"}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Section Scores */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Detailed Breakdown</h2>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(analysis.sections).map(([key, section]) => (
                <div
                  key={key}
                  className="p-4 bg-default-50 rounded-lg border border-default-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <Chip
                      color={getScoreColor(section.score)}
                      variant="flat"
                      size="sm"
                      className="font-semibold"
                    >
                      {section.score}%
                    </Chip>
                  </div>
                  <p className="text-sm text-default-600">{section.feedback}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Skills Analysis */}
      <motion.div variants={itemVariants}>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-success" />
                <h3 className="text-lg font-semibold">Matched Skills</h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedSkills.length > 0 ? (
                  analysis.matchedSkills.map((skill, index) => (
                    <Chip key={index} color="success" variant="flat" size="sm">
                      {skill}
                    </Chip>
                  ))
                ) : (
                  <p className="text-default-500 text-sm">No skills detected</p>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircleIcon className="h-5 w-5 text-warning" />
                <h3 className="text-lg font-semibold">Suggested Skills</h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((skill, index) => (
                    <Chip key={index} color="warning" variant="flat" size="sm">
                      {skill}
                    </Chip>
                  ))
                ) : (
                  <p className="text-default-500 text-sm">
                    No suggestions available
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </motion.div>

      {/* Improvement Suggestions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Improvement Suggestions</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {analysis.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <div className="p-1 bg-primary/20 rounded-full mt-1">
                    <SparklesIcon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm leading-relaxed">{improvement}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardBody className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/resume/create" className="flex-1">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full font-semibold"
                  startContent={<SparklesIcon className="h-5 w-5" />}
                >
                  Create New Resume with AI
                </Button>
              </Link>
              <Link href="/auth/register" className="flex-1">
                <Button
                  variant="bordered"
                  size="lg"
                  className="w-full font-semibold"
                  startContent={<UserIcon className="h-5 w-5" />}
                >
                  Save Analysis & Track Progress
                </Button>
              </Link>
              <Button
                variant="light"
                size="lg"
                onPress={onStartOver}
                startContent={<RefreshCwIcon className="h-5 w-5" />}
              >
                Analyze Another Resume
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
}
