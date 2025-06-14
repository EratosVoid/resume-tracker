"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
} from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileTextIcon,
  UploadIcon,
  SparklesIcon,
  CalendarIcon,
  TrendingUpIcon,
  DownloadIcon,
  EyeIcon,
  PlusIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "lucide-react";
import ResumeTimeline from "./components/ResumeTimeline";

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

export default function ApplicantResumesPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [stats, setStats] = useState({
    totalResumes: 0,
    averageScore: 0,
    latestScore: 0,
    improvementTrend: 0,
  });

  const fetchResumeData = async () => {
    try {
      const response = await fetch("/api/applicant/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch resume data");
      }

      const data = await response.json();

      // Transform and sort resume versions by creation date
      const transformedResumes = (data.resumeVersions || [])
        .map((resume: any) => ({
          ...resume,
          type: resume.rawFileURL ? "uploaded" : "created",
        }))
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setResumeVersions(transformedResumes);

      // Calculate stats
      const totalResumes = transformedResumes.length;
      const allScores = transformedResumes.flatMap((resume: any) =>
        resume.atsScores.map((score: any) => score.score)
      );

      const averageScore =
        allScores.length > 0
          ? Math.round(
              allScores.reduce((sum: number, score: number) => sum + score, 0) /
                allScores.length
            )
          : 0;

      const latestScore = allScores.length > 0 ? allScores[0] : 0;

      // Calculate improvement trend (compare latest vs previous)
      const improvementTrend =
        allScores.length > 1 ? allScores[0] - allScores[1] : 0;

      setStats({
        totalResumes,
        averageScore,
        latestScore,
        improvementTrend,
      });
    } catch (error) {
      console.error("Error fetching resume data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-default-600">
            Loading your resume history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-default-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/applicant">
                <Button
                  isIconOnly
                  variant="light"
                  startContent={<ArrowLeftIcon className="h-4 w-4" />}
                />
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  My Resume History
                </h1>
                <p className="text-default-600">
                  Track your resume evolution and performance over time
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/resume/upload">
                <Button
                  color="secondary"
                  variant="bordered"
                  startContent={<UploadIcon className="h-4 w-4" />}
                >
                  Upload Resume
                </Button>
              </Link>
              <Link href="/resume/create">
                <Button
                  color="primary"
                  startContent={<PlusIcon className="h-4 w-4" />}
                >
                  Create New Resume
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardBody className="text-center p-6">
              <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-3">
                <FileTextIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {stats.totalResumes}
              </div>
              <div className="text-sm text-default-600">Total Resumes</div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-success/10">
            <CardBody className="text-center p-6">
              <div className="p-3 bg-success/20 rounded-full w-fit mx-auto mb-3">
                <TrendingUpIcon className="h-6 w-6 text-success" />
              </div>
              <div className="text-3xl font-bold text-success mb-1">
                {stats.averageScore}%
              </div>
              <div className="text-sm text-default-600">Average Score</div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardBody className="text-center p-6">
              <div className="p-3 bg-secondary/20 rounded-full w-fit mx-auto mb-3">
                <SparklesIcon className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-1">
                {stats.latestScore}%
              </div>
              <div className="text-sm text-default-600">Latest Score</div>
            </CardBody>
          </Card>

          <Card
            className={`bg-gradient-to-br ${
              stats.improvementTrend >= 0
                ? "from-green-500/5 to-green-500/10"
                : "from-red-500/5 to-red-500/10"
            }`}
          >
            <CardBody className="text-center p-6">
              <div
                className={`p-3 rounded-full w-fit mx-auto mb-3 ${
                  stats.improvementTrend >= 0
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}
              >
                <TrendingUpIcon
                  className={`h-6 w-6 ${
                    stats.improvementTrend >= 0
                      ? "text-green-600"
                      : "text-red-600 rotate-180"
                  }`}
                />
              </div>
              <div
                className={`text-3xl font-bold mb-1 ${
                  stats.improvementTrend >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stats.improvementTrend > 0 ? "+" : ""}
                {stats.improvementTrend}%
              </div>
              <div className="text-sm text-default-600">Improvement</div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Resume Timeline */}
        {resumeVersions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ResumeTimeline resumeVersions={resumeVersions} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardBody className="text-center py-16">
                <div className="p-6 bg-default-100 rounded-full w-fit mx-auto mb-6">
                  <FileTextIcon className="h-16 w-16 text-default-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No Resumes Yet</h3>
                <p className="text-default-600 mb-8 max-w-md mx-auto">
                  Start building your resume history by creating or uploading
                  your first resume.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/resume/create">
                    <Button
                      color="primary"
                      size="lg"
                      startContent={<SparklesIcon className="h-5 w-5" />}
                    >
                      Create Resume with AI
                    </Button>
                  </Link>
                  <Link href="/resume/upload">
                    <Button
                      variant="bordered"
                      size="lg"
                      startContent={<UploadIcon className="h-5 w-5" />}
                    >
                      Upload Existing Resume
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
