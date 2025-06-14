"use client";

import { Card, CardBody, Button, Chip, Divider } from "@heroui/react";
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
} from "lucide-react";

interface ResumeVersion {
  _id: string;
  parsedText: string;
  rawFileURL?: string;
  fileName?: string;
  fileType?: string;
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
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<EyeIcon className="h-4 w-4" />}
                      >
                        View Details
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
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<BrainIcon className="h-4 w-4" />}
                      >
                        Re-analyze
                      </Button>
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
    </div>
  );
}
