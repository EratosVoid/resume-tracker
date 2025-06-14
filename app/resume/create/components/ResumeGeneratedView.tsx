"use client";

import { motion } from "framer-motion";
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
}

export default function ResumeGeneratedView({
  resumeData,
  onBack,
  onEdit,
  creationMode,
}: ResumeGeneratedViewProps) {
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
              <Button
                variant="bordered"
                startContent={<EditIcon className="h-4 w-4" />}
                onPress={onEdit}
              >
                Edit Resume
              </Button>
              <Button
                color="primary"
                startContent={<DownloadIcon className="h-4 w-4" />}
              >
                Download PDF
              </Button>
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
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="bordered"
                      startContent={<ShareIcon className="h-4 w-4" />}
                    >
                      Share
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      startContent={<DownloadIcon className="h-4 w-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="bg-white dark:bg-gray-900 border rounded-lg p-8 min-h-[800px] shadow-sm space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {resumeData.resume.personalInfo.fullName}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-default-600 mb-4">
                      {resumeData.resume.personalInfo.email && (
                        <span>{resumeData.resume.personalInfo.email}</span>
                      )}
                      {resumeData.resume.personalInfo.phone && (
                        <span>{resumeData.resume.personalInfo.phone}</span>
                      )}
                      {resumeData.resume.personalInfo.location && (
                        <span>{resumeData.resume.personalInfo.location}</span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {resumeData.resume.summary && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Professional Summary
                      </h3>
                      <p className="text-default-700">
                        {resumeData.resume.summary}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.resume.skills?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.resume.skills.map((skill, index) => (
                          <Chip key={index} variant="flat" size="sm">
                            {skill}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.resume.experience?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Experience</h3>
                      <div className="space-y-3">
                        {resumeData.resume.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-primary/20 pl-4"
                          >
                            <p className="text-default-700">
                              {typeof exp === "string"
                                ? exp
                                : exp.description || "Experience details"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {resumeData.resume.education?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Education</h3>
                      <div className="space-y-2">
                        {resumeData.resume.education.map((edu, index) => (
                          <p key={index} className="text-default-700">
                            {typeof edu === "string"
                              ? edu
                              : edu.description || "Education details"}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.resume.projects?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Projects</h3>
                      <div className="space-y-2">
                        {resumeData.resume.projects.map((project, index) => (
                          <p key={index} className="text-default-700">
                            {typeof project === "string"
                              ? project
                              : project.description || "Project details"}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {resumeData.resume.achievements?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Achievements
                      </h3>
                      <div className="space-y-2">
                        {resumeData.resume.achievements.map(
                          (achievement, index) => (
                            <p key={index} className="text-default-700">
                              {typeof achievement === "string"
                                ? achievement
                                : achievement.description ||
                                  "Achievement details"}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}
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
                        <UserIcon className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">
                          Create an account to save multiple resume versions
                        </p>
                      </div>
                    </div>
                  </div>
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
                  <Button
                    color="primary"
                    className="w-full"
                    size="lg"
                    startContent={<DownloadIcon className="h-5 w-5" />}
                  >
                    Download as PDF
                  </Button>

                  <Button
                    variant="bordered"
                    className="w-full"
                    startContent={<ShareIcon className="h-5 w-5" />}
                  >
                    Share Resume Link
                  </Button>

                  <Divider />

                  <Link href="/applicant" className="w-full">
                    <Button
                      variant="bordered"
                      className="w-full"
                      startContent={<UserIcon className="h-5 w-5" />}
                    >
                      View My Dashboard
                    </Button>
                  </Link>

                  <Button
                    variant="light"
                    className="w-full"
                    startContent={<EditIcon className="h-5 w-5" />}
                    onPress={onEdit}
                  >
                    Edit This Resume
                  </Button>
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
