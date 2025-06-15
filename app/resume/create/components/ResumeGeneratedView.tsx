"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Progress,
} from "@heroui/react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  FileTextIcon,
  UserIcon,
  DownloadIcon,
  ShareIcon,
  EditIcon,
  SparklesIcon,
  TrendingUpIcon,
  AwardIcon,
  BrainIcon,
} from "lucide-react";

interface ResumeData {
  success: boolean;
  resume: {
    personalInfo: any;
    summary: string;
    experience: any[];
    education: any[];
    skills: string[];
    projects: any[];
    achievements: any[];
  };
  atsScore: number;
  downloadUrl?: string;
  metadata: {
    generatedAt: string;
    mode: string;
    validated: number;
    totalSections: number;
  };
}

interface ResumeGeneratedViewProps {
  resumeData: ResumeData;
  onBack: () => void;
  onEdit: () => void;
  creationMode: "form" | "chat";
  structuredData?: any; // The original form/chat data
}

export default function ResumeGeneratedView({
  resumeData,
  onBack,
  onEdit,
  creationMode,
  structuredData,
}: ResumeGeneratedViewProps) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    success: boolean;
    shareUrl?: string;
    message?: string;
  } | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Improvement";
  };

  const handleSaveResume = async (isPublic: boolean = false) => {
    setIsSaving(true);
    try {
      console.log("session", !session);
      const response = await fetch("/api/resume/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          structuredData,
          generatedResume: resumeData.resume,
          creationMode,
          atsScore: resumeData.atsScore,
          isPublic,
          isAnonymous: !session, // Anonymous if no session, authenticated if session exists
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSaveResult({
          success: true,
          shareUrl: result.shareUrl,
          message: "Resume saved successfully!",
        });
      } else {
        setSaveResult({
          success: false,
          message: result.error || "Failed to save resume",
        });
      }
    } catch (error) {
      setSaveResult({
        success: false,
        message: "An error occurred while saving",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (saveResult?.shareUrl) {
      navigator.clipboard.writeText(saveResult.shareUrl);
      // You could add a toast notification here
    } else {
      // Save as public first, then share
      handleSaveResume(true);
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-default-50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-default-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                variant="light"
                onPress={onBack}
                startContent={<ArrowLeftIcon className="h-4 w-4" />}
              />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    Resume Generated Successfully!
                  </h1>
                  <p className="text-sm text-default-600">
                    Created via{" "}
                    {creationMode === "chat" ? "AI Conversation" : "Form Mode"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {session?.user ? (
                <>
                  <Button
                    variant="bordered"
                    startContent={<SparklesIcon className="h-4 w-4" />}
                    onPress={onEdit}
                  >
                    Create New Resume
                  </Button>
                  <Button
                    variant="bordered"
                    startContent={<ShareIcon className="h-4 w-4" />}
                    onPress={handleShare}
                    isLoading={isSaving}
                  >
                    {saveResult?.shareUrl ? "Copy Link" : "Save & Share"}
                  </Button>
                  <Button
                    color="primary"
                    startContent={<DownloadIcon className="h-4 w-4" />}
                  >
                    Download PDF
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-default-600">
                      Create an account to download and save your resume
                    </p>
                  </div>
                  <Link href="/auth/register">
                    <Button
                      color="primary"
                      size="lg"
                      startContent={<UserIcon className="h-4 w-4" />}
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-xl font-bold">Resume Preview</h2>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="bg-white dark:bg-gray-50 border rounded-lg min-h-[1000px] shadow-lg overflow-hidden relative">
                  {/* Demo Mode Badge for non-logged-in users */}
                  {!session?.user && (
                    <div className="absolute top-4 right-4 z-10">
                      <Chip
                        color="warning"
                        variant="solid"
                        size="sm"
                        startContent={<UserIcon className="h-3 w-3" />}
                      >
                        Preview Mode
                      </Chip>
                    </div>
                  )}

                  {/* Resume Paper */}
                  <div
                    className={`max-w-[8.5in] mx-auto bg-white p-12 min-h-[11in] text-gray-900 font-serif leading-relaxed ${
                      !session?.user ? "opacity-90" : ""
                    }`}
                  >
                    {/* Header Section */}
                    <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
                      <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-wide">
                        {resumeData.resume.personalInfo.fullName}
                      </h1>
                      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                        {resumeData.resume.personalInfo.email && (
                          <span className="flex items-center gap-1">
                            <span>✉</span>
                            {resumeData.resume.personalInfo.email}
                          </span>
                        )}
                        {resumeData.resume.personalInfo.phone && (
                          <span className="flex items-center gap-1">
                            <span>📞</span>
                            {resumeData.resume.personalInfo.phone}
                          </span>
                        )}
                        {resumeData.resume.personalInfo.location && (
                          <span className="flex items-center gap-1">
                            <span>📍</span>
                            {resumeData.resume.personalInfo.location}
                          </span>
                        )}
                        {resumeData.resume.personalInfo.linkedin && (
                          <a
                            href={
                              resumeData.resume.personalInfo.linkedin.startsWith(
                                "http"
                              )
                                ? resumeData.resume.personalInfo.linkedin
                                : `https://${resumeData.resume.personalInfo.linkedin}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <span>💼</span>
                            {resumeData.resume.personalInfo.linkedin
                              .replace(/^https?:\/\//, "")
                              .replace(/^www\./, "")}
                          </a>
                        )}
                        {resumeData.resume.personalInfo.portfolio && (
                          <a
                            href={
                              resumeData.resume.personalInfo.portfolio.startsWith(
                                "http"
                              )
                                ? resumeData.resume.personalInfo.portfolio
                                : `https://${resumeData.resume.personalInfo.portfolio}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <span>🌐</span>
                            {resumeData.resume.personalInfo.portfolio
                              .replace(/^https?:\/\//, "")
                              .replace(/^www\./, "")}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Professional Summary */}
                    {resumeData.resume.summary && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
                          Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-justify">
                          {resumeData.resume.summary}
                        </p>
                      </div>
                    )}

                    {/* Skills */}
                    {resumeData.resume.skills?.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
                          Core Competencies
                        </h2>
                        <div className="grid grid-cols-3 gap-2">
                          {resumeData.resume.skills.map((skill, index) => (
                            <div key={index} className="text-gray-700 text-sm">
                              • {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Professional Experience */}
                    {resumeData.resume.experience?.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
                          Professional Experience
                        </h2>
                        <div className="space-y-6">
                          {resumeData.resume.experience.map((exp, index) => (
                            <div key={index} className="relative">
                              {typeof exp === "object" && exp.company ? (
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900">
                                        {exp.title}
                                      </h3>
                                      <p className="text-gray-700 font-medium">
                                        {exp.company}
                                      </p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                      <p>
                                        {exp.startDate} - {exp.endDate}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-gray-700 mb-3 leading-relaxed">
                                    {exp.description}
                                  </p>
                                  {exp.achievements &&
                                    exp.achievements.length > 0 && (
                                      <ul className="list-none space-y-1 ml-4">
                                        {exp.achievements.map(
                                          (
                                            achievement: string,
                                            achIndex: number
                                          ) => (
                                            <li
                                              key={achIndex}
                                              className="text-gray-700 text-sm relative"
                                            >
                                              <span className="absolute -left-4 text-gray-500">
                                                ▸
                                              </span>
                                              {achievement}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                </div>
                              ) : (
                                <div className="text-gray-700 leading-relaxed">
                                  {typeof exp === "string"
                                    ? exp
                                    : exp.description || "Experience details"}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.resume.education?.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
                          Education
                        </h2>
                        <div className="space-y-4">
                          {resumeData.resume.education.map((edu, index) => (
                            <div key={index}>
                              {typeof edu === "object" && edu.school ? (
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {edu.degree} in {edu.field}
                                    </h3>
                                    <p className="text-gray-700 font-medium">
                                      {edu.school}
                                    </p>
                                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                                      {edu.honors && (
                                        <span className="font-medium text-gray-700">
                                          {edu.honors}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right text-sm text-gray-600">
                                    <p>Graduated {edu.graduationYear}</p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-700">
                                  {typeof edu === "string"
                                    ? edu
                                    : edu.description || "Education details"}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.resume.projects?.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
                          Key Projects
                        </h2>
                        <div className="space-y-4">
                          {resumeData.resume.projects.map((project, index) => (
                            <div key={index}>
                              {typeof project === "object" && project.name ? (
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {project.name}
                                  </h3>
                                  <p className="text-gray-700 mb-2 leading-relaxed">
                                    {project.description}
                                  </p>
                                  {project.technologies &&
                                    project.technologies.length > 0 && (
                                      <div className="mb-2">
                                        <span className="text-sm font-medium text-gray-600">
                                          Technologies:{" "}
                                        </span>
                                        <span className="text-sm text-gray-700">
                                          {project.technologies.join(", ")}
                                        </span>
                                      </div>
                                    )}
                                  {project.achievements &&
                                    project.achievements.length > 0 && (
                                      <ul className="list-none space-y-1 ml-4">
                                        {project.achievements.map(
                                          (
                                            achievement: string,
                                            achIndex: number
                                          ) => (
                                            <li
                                              key={achIndex}
                                              className="text-gray-700 text-sm relative"
                                            >
                                              <span className="absolute -left-4 text-gray-500">
                                                ▸
                                              </span>
                                              {achievement}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                </div>
                              ) : (
                                <p className="text-gray-700">
                                  {typeof project === "string"
                                    ? project
                                    : project.description || "Project details"}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Achievements & Awards */}
                    {resumeData.resume.achievements?.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
                          Achievements & Awards
                        </h2>
                        <div className="space-y-3">
                          {resumeData.resume.achievements.map(
                            (achievement, index) => (
                              <div key={index}>
                                {typeof achievement === "object" &&
                                achievement.title ? (
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-gray-900">
                                        {achievement.title}
                                      </h3>
                                      <p className="text-gray-700 text-sm leading-relaxed">
                                        {achievement.description}
                                      </p>
                                    </div>
                                    {achievement.date && (
                                      <div className="text-sm text-gray-600 ml-4">
                                        {achievement.date}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-gray-700">
                                    {typeof achievement === "string"
                                      ? achievement
                                      : achievement.description ||
                                        "Achievement details"}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Analytics & Actions */}
          <div className="space-y-6">
            {/* ATS Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardBody className="text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <TrendingUpIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    ATS Compatibility Score
                  </h3>
                  <div className="text-4xl font-bold mb-2">
                    <span
                      className={`text-${getScoreColor(resumeData.atsScore)}`}
                    >
                      {resumeData.atsScore}%
                    </span>
                  </div>
                  <Chip
                    color={getScoreColor(resumeData.atsScore)}
                    variant="flat"
                    size="sm"
                  >
                    {getScoreLabel(resumeData.atsScore)}
                  </Chip>
                  <Progress
                    value={resumeData.atsScore}
                    color={getScoreColor(resumeData.atsScore)}
                    className="mt-4"
                    showValueLabel={false}
                  />
                </CardBody>
              </Card>
            </motion.div>

            {/* Resume Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Resume Analytics</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {resumeData.metadata.validated}
                      </div>
                      <div className="text-sm text-default-600">
                        Validated Skills
                      </div>
                    </div>
                    <div className="text-center p-3 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">
                        {resumeData.metadata.totalSections}
                      </div>
                      <div className="text-sm text-default-600">
                        Complete Sections
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Skills Listed</span>
                      <span className="font-semibold">
                        {resumeData.resume.skills?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Creation Mode</span>
                      <span className="font-semibold capitalize">
                        {resumeData.metadata.mode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Generated</span>
                      <span className="font-semibold">
                        {new Date(
                          resumeData.metadata.generatedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BrainIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Next Steps</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  {session?.user ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <SparklesIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm">
                            Download your resume and start applying to jobs
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FileTextIcon className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                          <p className="text-sm">
                            Create multiple resume versions for different roles
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <UserIcon className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                          <p className="text-sm">
                            <strong>Create an account</strong> to unlock all
                            features and download your resume
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <SparklesIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm">
                            Save multiple resume versions and track your job
                            applications
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FileTextIcon className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                          <p className="text-sm">
                            Get ATS optimization tips and improve your score
                            over time
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardBody className="space-y-3">
                  {session?.user ? (
                    <>
                      <Button
                        color="primary"
                        className="w-full"
                        size="lg"
                        startContent={<DownloadIcon className="h-5 w-5" />}
                      >
                        Download as PDF
                      </Button>

                      <Button
                        color="secondary"
                        className="w-full"
                        startContent={<SparklesIcon className="h-5 w-5" />}
                        onPress={() => handleSaveResume(false)}
                        isLoading={isSaving}
                        isDisabled={saveResult?.success}
                      >
                        {saveResult?.success ? "Saved!" : "Save Resume"}
                      </Button>

                      <Button
                        variant="bordered"
                        className="w-full"
                        startContent={<ShareIcon className="h-5 w-5" />}
                        onPress={handleShare}
                        isLoading={isSaving}
                      >
                        {saveResult?.shareUrl
                          ? "Copy Share Link"
                          : "Save & Share"}
                      </Button>

                      {saveResult && (
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            saveResult.success
                              ? "bg-success/10 text-success border border-success/20"
                              : "bg-danger/10 text-danger border border-danger/20"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {saveResult.success ? (
                              <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            ) : (
                              <span className="text-lg">⚠️</span>
                            )}
                            <div>
                              <p>{saveResult.message}</p>
                              {saveResult.shareUrl && (
                                <p className="text-xs mt-1 opacity-80">
                                  Share URL copied to clipboard
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Disabled buttons for non-logged-in users */}
                      <Button
                        color="primary"
                        className="w-full opacity-50"
                        size="lg"
                        startContent={<DownloadIcon className="h-5 w-5" />}
                        isDisabled
                      >
                        Download as PDF
                      </Button>

                      <Button
                        color="secondary"
                        className="w-full opacity-50"
                        startContent={<SparklesIcon className="h-5 w-5" />}
                        isDisabled
                      >
                        Save Resume
                      </Button>

                      <Button
                        variant="bordered"
                        className="w-full opacity-50"
                        startContent={<ShareIcon className="h-5 w-5" />}
                        isDisabled
                      >
                        Save & Share
                      </Button>

                      {/* Call-to-action message */}
                      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <UserIcon className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-warning">
                                Account Required
                              </h4>
                              <p className="text-sm text-default-600 mt-1">
                                Create a free account to download, save, and
                                share your professional resume. You'll also be
                                able to track your progress and create multiple
                                resume versions.
                              </p>
                            </div>
                            <Link href="/auth/register" className="block">
                              <Button
                                color="warning"
                                className="w-full"
                                size="lg"
                                startContent={<UserIcon className="h-5 w-5" />}
                              >
                                Create Free Account
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </motion.div>

            {/* Achievement Badge */}
            {resumeData.atsScore >= 90 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-2 border-success/20 bg-success/5">
                  <CardBody className="text-center p-6">
                    <div className="p-3 bg-success/10 rounded-full w-fit mx-auto mb-3">
                      <AwardIcon className="h-6 w-6 text-success" />
                    </div>
                    <h4 className="font-semibold text-success mb-1">
                      Excellent Resume!
                    </h4>
                    <p className="text-sm text-success/80">
                      Your resume scored in the top 10% for ATS compatibility
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
