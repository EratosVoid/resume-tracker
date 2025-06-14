"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  TrendingUpIcon,
  BuildingIcon,
  AwardIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalResumes: number;
  averageScore: number;
  totalApplications: number;
  responseRate: number;
}

export default function ApplicantPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    averageScore: 0,
    totalApplications: 0,
    responseRate: 0,
  });
  const [resumeVersions, setResumeVersions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/applicant/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setStats(data.stats);
      setResumeVersions(data.resumeVersions || []);
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-default-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-default-900 mb-2">
              Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-default-600">
              Track your resume performance and application progress
            </p>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardBody className="text-center p-6">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                  <FileTextIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {stats.totalResumes}
                </div>
                <div className="text-sm text-default-600">Resume Versions</div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardBody className="text-center p-6">
                <div className="p-3 bg-success/10 rounded-full w-fit mx-auto mb-3">
                  <TrendingUpIcon className="h-6 w-6 text-success" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {stats.averageScore}%
                </div>
                <div className="text-sm text-default-600">
                  Average ATS Score
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardBody className="text-center p-6">
                <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-3">
                  <BuildingIcon className="h-6 w-6 text-secondary" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {stats.totalApplications}
                </div>
                <div className="text-sm text-default-600">
                  Applications Sent
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardBody className="text-center p-6">
                <div className="p-3 bg-warning/10 rounded-full w-fit mx-auto mb-3">
                  <AwardIcon className="h-6 w-6 text-warning" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {stats.responseRate}%
                </div>
                <div className="text-sm text-default-600">Response Rate</div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/resume/create">
                  <Button
                    color="primary"
                    className="w-full h-auto p-6"
                    startContent={<SparklesIcon className="h-5 w-5" />}
                  >
                    <div className="text-left">
                      <div className="font-semibold">Create New Resume</div>
                      <div className="text-sm opacity-70">
                        Build with AI assistance
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/resume/upload">
                  <Button
                    variant="bordered"
                    className="w-full h-auto p-6"
                    startContent={<FileTextIcon className="h-5 w-5" />}
                  >
                    <div className="text-left">
                      <div className="font-semibold">Upload & Score</div>
                      <div className="text-sm opacity-70">
                        Get instant ATS analysis
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/jobs">
                  <Button
                    variant="bordered"
                    className="w-full h-auto p-6"
                    startContent={<BuildingIcon className="h-5 w-5" />}
                  >
                    <div className="text-left">
                      <div className="font-semibold">Browse Jobs</div>
                      <div className="text-sm opacity-70">
                        Find perfect opportunities
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardBody className="text-center py-12">
              <FileTextIcon className="h-16 w-16 text-default-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Your Dashboard is Ready!
              </h3>
              <p className="text-default-600 mb-6">
                Start creating resumes and applying to jobs to see your progress
                here.
              </p>
              <div className="space-y-3">
                <Link href="/resume/create">
                  <Button
                    color="primary"
                    size="lg"
                    startContent={<SparklesIcon className="h-5 w-5" />}
                  >
                    Create Your First Resume
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
