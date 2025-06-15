"use client";

import {
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
  Textarea,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  UploadIcon,
  SparklesIcon,
  CalendarIcon,
  TrendingUpIcon,
  DownloadIcon,
  EyeIcon,
  ClockIcon,
  BrainIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ShareIcon,
  ExternalLinkIcon,
  XIcon,
  UserIcon,
  StarIcon,
  TargetIcon,
  BookOpenIcon,
  LightbulbIcon,
} from "lucide-react";
import { useState } from "react";

interface DetailedAnalysis {
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
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: string;
  education: string;
  skills: string[];
  improvements: string[];
  matchedSkills: string[];
  missingSkills: string[];
}

interface ResumeVersion {
  _id: string;
  parsedText: string;
  rawFileURL?: string;
  fileName?: string;
  fileType?: string;
  shareableId?: string;
  // Add detailed analysis data for uploaded resumes
  detailedAnalysis?: DetailedAnalysis;
  atsScores: Array<{
    jobId: string;
    jobTitle: string;
    score: number;
    keywordsMatched: string[];
    skillsMatched: string[];
    createdAt: string;
  }>;
  createdAt: string;
  type: "uploaded" | "created";
}

interface ResumeTimelineProps {
  resumeVersions: ResumeVersion[];
}

export default function ResumeTimeline({
  resumeVersions,
}: ResumeTimelineProps) {
  const [selectedResume, setSelectedResume] = useState<ResumeVersion | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      year: date.getFullYear(),
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  const getHighestScore = (atsScores: any[]) => {
    if (atsScores.length === 0) return null;
    return atsScores.reduce((highest, current) =>
      current.score > highest.score ? current : highest
    );
  };

  const handleViewShareLink = (shareableId: string) => {
    const shareUrl = `${window.location.origin}/resume/share/${shareableId}`;
    window.open(shareUrl, "_blank");
  };

  const handleViewDetails = (
    detailedAnalysis: DetailedAnalysis,
    resume: ResumeVersion
  ) => {
    setSelectedResume({ ...resume, detailedAnalysis });
    setIsDetailModalOpen(true);
  };

  const parseDetailedAnalysis = (
    parsedText: string,
    atsScores: any[]
  ): DetailedAnalysis | null => {
    try {
      const parsed = JSON.parse(parsedText);
      // Check if it has the expected structure for detailed analysis
      if (parsed.tone && parsed.sections && parsed.improvements) {
        // If overallScore is missing, use the highest ATS score
        if (!parsed.overallScore) {
          const highestScore = getHighestScore(atsScores);
          parsed.overallScore = highestScore?.score || 0;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Resume Timeline</h2>
        <p className="text-default-600">
          Your resume journey and performance evolution
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/20"></div>

        {resumeVersions.map((resume, index) => {
          const formattedDate = formatDate(resume.createdAt);
          const highestScore = getHighestScore(resume.atsScores);
          const isLatest = index === 0;
          const detailedAnalysis = parseDetailedAnalysis(
            resume.parsedText,
            resume.atsScores
          );

          return (
            <motion.div
              key={resume._id}
              variants={itemVariants}
              className="relative flex items-start gap-6 pb-8"
            >
              {/* Timeline dot */}
              <div className="relative z-10">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isLatest
                      ? "bg-gradient-to-br from-primary to-secondary shadow-lg"
                      : "bg-white dark:bg-gray-800 border-2 border-default-200"
                  }`}
                >
                  {resume.type === "uploaded" ? (
                    <UploadIcon
                      className={`h-6 w-6 ${
                        isLatest ? "text-white" : "text-primary"
                      }`}
                    />
                  ) : (
                    <SparklesIcon
                      className={`h-6 w-6 ${
                        isLatest ? "text-white" : "text-secondary"
                      }`}
                    />
                  )}
                </div>
                {isLatest && (
                  <div className="absolute -top-2 -right-2">
                    <Chip
                      size="sm"
                      color="success"
                      variant="solid"
                      className="text-xs font-semibold"
                    >
                      Latest
                    </Chip>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <Card
                  className={`${
                    isLatest
                      ? "ring-2 ring-primary/20 shadow-lg"
                      : "hover:shadow-md"
                  } transition-all duration-300`}
                >
                  <CardBody className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">
                              {resume.fileName || "AI-Generated Resume"}
                            </h3>
                            <Chip
                              size="sm"
                              color={
                                resume.type === "uploaded"
                                  ? "primary"
                                  : "secondary"
                              }
                              variant="flat"
                            >
                              {resume.type === "uploaded"
                                ? "Uploaded"
                                : "Created"}
                            </Chip>
                            {resume.shareableId && !resume.fileType && (
                              <Chip
                                size="sm"
                                color="success"
                                variant="flat"
                                startContent={<ShareIcon className="h-3 w-3" />}
                              >
                                Public
                              </Chip>
                            )}
                            {detailedAnalysis && (
                              <Chip
                                size="sm"
                                color="secondary"
                                variant="flat"
                                startContent={<BrainIcon className="h-3 w-3" />}
                              >
                                AI Analyzed
                              </Chip>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-default-600">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {formattedDate.date}, {formattedDate.year}
                            </span>
                            <span>•</span>
                            <ClockIcon className="h-4 w-4" />
                            <span>{formattedDate.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Score Display */}
                      {highestScore && (
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">
                              {highestScore.score}%
                            </div>
                            <Chip
                              color={getScoreColor(highestScore.score)}
                              variant="flat"
                              size="sm"
                            >
                              {getScoreLabel(highestScore.score)}
                            </Chip>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ATS Scores */}
                    {resume.atsScores.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <TrendingUpIcon className="h-4 w-4" />
                          ATS Performance
                        </h4>
                        <div className="space-y-2">
                          {resume.atsScores.map((score, scoreIndex) => (
                            <div
                              key={scoreIndex}
                              className="flex items-center justify-between p-3 bg-default-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {score.jobTitle}
                                </p>
                                <p className="text-xs text-default-600">
                                  {formatDate(score.createdAt).date},{" "}
                                  {formatDate(score.createdAt).year}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">
                                  {score.score}%
                                </div>
                                <div className="text-xs text-default-600">
                                  {score.skillsMatched?.length || 0} skills
                                  matched
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Matched */}
                    {highestScore &&
                      highestScore.skillsMatched &&
                      highestScore.skillsMatched.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <CheckCircleIcon className="h-4 w-4 text-success" />
                            Top Matched Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {highestScore.skillsMatched
                              .slice(0, 6)
                              .map((skill: string, skillIndex: number) => (
                                <Chip
                                  key={skillIndex}
                                  size="sm"
                                  color="success"
                                  variant="flat"
                                >
                                  {skill}
                                </Chip>
                              ))}
                            {highestScore.skillsMatched.length > 6 && (
                              <Chip size="sm" variant="flat">
                                +{highestScore.skillsMatched.length - 6} more
                              </Chip>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-default-200">
                      {resume.shareableId && !resume.fileType && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          startContent={
                            <ExternalLinkIcon className="h-4 w-4" />
                          }
                          onPress={() =>
                            handleViewShareLink(resume.shareableId!)
                          }
                        >
                          View Share Link
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<EyeIcon className="h-4 w-4" />}
                        onPress={() =>
                          handleViewDetails(detailedAnalysis!, resume)
                        }
                        isDisabled={!resume.fileType}
                      >
                        {resume.type === "uploaded" && resume.fileType
                          ? "View Details"
                          : "View Details"}
                      </Button>
                      {resume.rawFileURL && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="secondary"
                          startContent={<DownloadIcon className="h-4 w-4" />}
                        >
                          Download
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </motion.div>
          );
        })}

        {/* Timeline end */}
        <motion.div
          variants={itemVariants}
          className="relative flex items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-default-200 to-default-300 flex items-center justify-center">
            <CalendarIcon className="h-6 w-6 text-default-500" />
          </div>
          <div className="flex-1">
            <Card className="border-2 border-dashed border-default-200">
              <CardBody className="text-center py-8">
                <p className="text-default-600 mb-4">
                  This is where your resume journey began
                </p>
                <p className="text-sm text-default-500">
                  Keep building and improving your resumes to climb the
                  timeline!
                </p>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </motion.div>

      {/* Detailed Analysis Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                    <BrainIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedResume?.fileName || "Resume Analysis"}
                    </h3>
                    <p className="text-sm text-default-600 font-normal">
                      Detailed AI-powered feedback and insights
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedResume &&
                  (() => {
                    // const analysis = parseDetailedAnalysis(
                    //   selectedResume.parsedText,
                    //   selectedResume.atsScores
                    // );

                    if (!selectedResume.detailedAnalysis) {
                      return (
                        <div className="text-center py-8">
                          <AlertCircleIcon className="h-12 w-12 text-warning mx-auto mb-4" />
                          <h4 className="text-lg font-semibold mb-2">
                            No Detailed Analysis Available
                          </h4>
                          <p className="text-default-600">
                            This resume doesn't have detailed AI analysis data.
                            Only uploaded resumes with AI analysis show detailed
                            feedback.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-6">
                        {/* Overall Score Section */}
                        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                          <CardBody className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-lg font-semibold mb-2">
                                  Overall ATS Score
                                </h4>
                                <p className="text-default-600">
                                  Your resume's compatibility with Applicant
                                  Tracking Systems
                                </p>
                              </div>
                              <div className="text-center">
                                <div className="text-5xl font-black text-primary mb-2">
                                  {
                                    selectedResume.detailedAnalysis
                                      ?.overallScore
                                  }
                                </div>
                                <Chip
                                  color={getScoreColor(
                                    selectedResume.detailedAnalysis
                                      ?.overallScore
                                  )}
                                  variant="flat"
                                  size="lg"
                                  className="font-semibold"
                                >
                                  {getScoreLabel(
                                    selectedResume.detailedAnalysis
                                      ?.overallScore
                                  )}
                                </Chip>
                              </div>
                            </div>
                          </CardBody>
                        </Card>

                        {/* Section Scores */}
                        <Card>
                          <CardBody className="p-6">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <TargetIcon className="h-5 w-5" />
                              Section Breakdown
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {Object.entries(
                                selectedResume.detailedAnalysis?.sections
                              ).map(([key, section]) => (
                                <div key={key} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    <Chip
                                      color={getScoreColor(section.score)}
                                      variant="flat"
                                      size="sm"
                                    >
                                      {section.score}%
                                    </Chip>
                                  </div>
                                  <Progress
                                    value={section.score}
                                    color={getScoreColor(section.score)}
                                    size="sm"
                                    className="mb-2"
                                  />
                                  <p className="text-sm text-default-600">
                                    {section.feedback}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </CardBody>
                        </Card>

                        {/* Resume Tone */}
                        <Card>
                          <CardBody className="p-6">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <FileTextIcon className="h-5 w-5" />
                              Resume Tone Analysis
                            </h4>
                            <div className="flex items-start gap-4">
                              <Chip
                                color="secondary"
                                variant="flat"
                                size="lg"
                                className="font-semibold"
                              >
                                {selectedResume.detailedAnalysis?.tone.category}
                              </Chip>
                              <p className="text-default-600 flex-1">
                                {
                                  selectedResume.detailedAnalysis?.tone
                                    .reasoning
                                }
                              </p>
                            </div>
                          </CardBody>
                        </Card>

                        {/* Skills Analysis */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Matched Skills */}
                          {selectedResume.detailedAnalysis?.matchedSkills
                            .length > 0 && (
                            <Card>
                              <CardBody className="p-6">
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-success">
                                  <CheckCircleIcon className="h-5 w-5" />
                                  Matched Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedResume.detailedAnalysis?.matchedSkills.map(
                                    (skill, index) => (
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
                              </CardBody>
                            </Card>
                          )}

                          {/* Missing Skills */}
                          {selectedResume.detailedAnalysis?.missingSkills
                            .length > 0 && (
                            <Card>
                              <CardBody className="p-6">
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-warning">
                                  <AlertCircleIcon className="h-5 w-5" />
                                  Suggested Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedResume.detailedAnalysis?.missingSkills.map(
                                    (skill, index) => (
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
                              </CardBody>
                            </Card>
                          )}
                        </div>

                        {/* Improvement Suggestions */}
                        {selectedResume.detailedAnalysis?.improvements.length >
                          0 && (
                          <Card>
                            <CardBody className="p-6">
                              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <LightbulbIcon className="h-5 w-5 text-warning" />
                                Improvement Suggestions
                              </h4>
                              <div className="space-y-3">
                                {selectedResume.detailedAnalysis?.improvements.map(
                                  (improvement, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20"
                                    >
                                      <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-warning">
                                          {index + 1}
                                        </span>
                                      </div>
                                      <p className="text-sm text-default-700">
                                        {improvement}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        )}

                        {/* Extracted Information */}
                        <Card>
                          <CardBody className="p-6">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <UserIcon className="h-5 w-5" />
                              Extracted Information
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-medium text-default-600">
                                    Name
                                  </label>
                                  <p className="text-sm bg-default-50 p-2 rounded">
                                    {selectedResume.detailedAnalysis?.name ||
                                      "Not specified"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-default-600">
                                    Email
                                  </label>
                                  <p className="text-sm bg-default-50 p-2 rounded">
                                    {selectedResume.detailedAnalysis?.email ||
                                      "Not specified"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-default-600">
                                    Phone
                                  </label>
                                  <p className="text-sm bg-default-50 p-2 rounded">
                                    {selectedResume.detailedAnalysis?.phone ||
                                      "Not specified"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-default-600">
                                    Location
                                  </label>
                                  <p className="text-sm bg-default-50 p-2 rounded">
                                    {selectedResume.detailedAnalysis
                                      ?.location || "Not specified"}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-medium text-default-600">
                                    Professional Summary
                                  </label>
                                  <p className="text-sm bg-default-50 p-2 rounded max-h-20 overflow-y-auto">
                                    {selectedResume.detailedAnalysis?.summary ||
                                      "Not provided"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-default-600">
                                    Technical Skills
                                  </label>
                                  <div className="bg-default-50 p-2 rounded">
                                    {selectedResume.detailedAnalysis?.skills
                                      .length > 0 ? (
                                      <div className="flex flex-wrap gap-1">
                                        {selectedResume.detailedAnalysis?.skills.map(
                                          (skill, index) => (
                                            <Chip
                                              key={index}
                                              size="sm"
                                              variant="flat"
                                              color="primary"
                                            >
                                              {skill}
                                            </Chip>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-default-500">
                                        No skills extracted
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    );
                  })()}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
