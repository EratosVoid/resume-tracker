"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
} from "@heroui/react";
import {
  BriefcaseIcon,
  UsersIcon,
  EyeIcon,
  PlusIcon,
  TrendingUpIcon,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  recentApplications: number;
}

interface RecentJob {
  _id: string;
  title: string;
  isPublic: boolean;
  applicationCount: number;
  createdAt: string;
  slug: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    recentApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch jobs for this user
      const jobsResponse = await fetch("/api/jobs?limit=5&userOnly=true");
      const jobsData = await jobsResponse.json();

      if (jobsData.jobs) {
        setRecentJobs(jobsData.jobs);

        // Calculate stats
        const totalJobs = jobsData.pagination?.total || 0;
        const activeJobs = jobsData.jobs.filter(
          (job: RecentJob) => job.isPublic
        ).length;
        const totalApplications = jobsData.jobs.reduce(
          (sum: number, job: RecentJob) => sum + job.applicationCount,
          0
        );

        setStats({
          totalJobs,
          activeJobs,
          totalApplications,
          recentApplications: totalApplications, // For now, same as total
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statsCards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: BriefcaseIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: EyeIcon,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: UsersIcon,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "This Month",
      value: stats.recentApplications,
      icon: TrendingUpIcon,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-default-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-default-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-default-600 mt-1">
              Welcome back, {session?.user.name}
            </p>
            {session?.user.company && (
              <p className="text-sm text-default-500">{session.user.company}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              as={Link}
              href="/dashboard/jobs"
              variant="flat"
              startContent={<EyeIcon className="h-4 w-4" />}
            >
              Manage Jobs
            </Button>
            <Button
              as={Link}
              href="/dashboard/jobs/new"
              color="primary"
              startContent={<PlusIcon className="h-4 w-4" />}
            >
              Post New Job
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-default-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Jobs</h2>
              <p className="text-sm text-default-600">
                Your latest job postings
              </p>
            </div>
            <Button as={Link} href="/dashboard/jobs" variant="flat" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardBody>
            {recentJobs.length === 0 ? (
              <div className="text-center py-12">
                <BriefcaseIcon className="h-12 w-12 text-default-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No jobs posted yet
                </h3>
                <p className="text-default-600 mb-4">
                  Start by creating your first job posting
                </p>
                <Button
                  as={Link}
                  href="/dashboard/jobs/new"
                  color="primary"
                  startContent={<PlusIcon className="h-4 w-4" />}
                >
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between p-4 border border-default-200 rounded-lg hover:bg-default-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{job.title}</h3>
                          <Chip
                            size="sm"
                            color={job.isPublic ? "success" : "warning"}
                            variant="flat"
                          >
                            {job.isPublic ? "Public" : "Private"}
                          </Chip>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-default-600">
                          <div className="flex items-center gap-1">
                            <UsersIcon className="h-4 w-4" />
                            <span>{job.applicationCount} applications</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>Posted {formatDate(job.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          as={Link}
                          href={`/jobs/${job.slug}`}
                          size="sm"
                          variant="flat"
                          startContent={<EyeIcon className="h-4 w-4" />}
                        >
                          View
                        </Button>
                        <Button
                          as={Link}
                          href={`/dashboard/jobs/${job.slug}/edit`}
                          size="sm"
                          color="primary"
                          variant="flat"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                as={Link}
                href="/dashboard/jobs/new"
                color="primary"
                variant="flat"
                className="h-auto p-6"
                startContent={<PlusIcon className="h-5 w-5" />}
              >
                <div className="text-left">
                  <div className="font-semibold">Post New Job</div>
                  <div className="text-sm opacity-70">
                    Create a new job listing
                  </div>
                </div>
              </Button>

              <Button
                as={Link}
                href="/dashboard/applications"
                variant="flat"
                className="h-auto p-6"
                startContent={<UsersIcon className="h-5 w-5" />}
              >
                <div className="text-left">
                  <div className="font-semibold">View Applications</div>
                  <div className="text-sm opacity-70">
                    Review candidate submissions
                  </div>
                </div>
              </Button>

              <Button
                as={Link}
                href="/dashboard/analytics"
                variant="flat"
                className="h-auto p-6"
                startContent={<TrendingUpIcon className="h-5 w-5" />}
              >
                <div className="text-left">
                  <div className="font-semibold">Analytics</div>
                  <div className="text-sm opacity-70">View hiring insights</div>
                </div>
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
