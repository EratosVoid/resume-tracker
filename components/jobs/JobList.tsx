"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  SearchIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  description: string;
  experienceLevel?: "entry" | "mid" | "senior" | "executive";
  location?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  skills?: string[];
  isPublic: boolean;
  applicationCount: number;
  createdAt: string;
  deadline?: string;
  slug: string;
}

interface JobListProps {
  initialJobs?: Job[];
  showPrivate?: boolean;
}

const experienceLevels = [
  { key: "entry", label: "Entry Level" },
  { key: "mid", label: "Mid Level" },
  { key: "senior", label: "Senior Level" },
  { key: "executive", label: "Executive" },
];

export default function JobList({
  initialJobs = [],
  showPrivate = false,
}: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, experienceFilter, locationFilter]);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        public: (!showPrivate).toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (experienceFilter) params.append("experienceLevel", experienceFilter);
      if (locationFilter) params.append("location", locationFilter);

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();

      if (response.ok) {
        setJobs(data.jobs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchJobs(newPage);
  };

  const formatSalary = (salary?: {
    min?: number;
    max?: number;
    currency?: string;
  }) => {
    if (!salary) return "Not specified";

    const { min, max, currency = "USD" } = salary;
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    });

    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `From ${formatter.format(min)}`;
    } else if (max) {
      return `Up to ${formatter.format(max)}`;
    }

    return "Not specified";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDeadlineSoon = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<SearchIcon className="h-4 w-4" />}
              className="flex-1"
            />
            <Select
              placeholder="Experience Level"
              selectedKeys={experienceFilter ? [experienceFilter] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setExperienceFilter(selected || "");
              }}
              className="sm:w-48"
            >
              {experienceLevels.map((level) => (
                <SelectItem key={level.key} value={level.key}>
                  {level.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              startContent={<MapPinIcon className="h-4 w-4" />}
              className="sm:w-48"
            />
          </div>
        </CardBody>
      </Card>

      {/* Job List */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardBody className="space-y-3">
                <div className="h-6 bg-default-300 rounded"></div>
                <div className="h-4 bg-default-200 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-default-200 rounded w-20"></div>
                  <div className="h-6 bg-default-200 rounded w-24"></div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : jobs.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <BriefcaseIcon className="h-12 w-12 text-default-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-default-500">
                Try adjusting your search criteria
              </p>
            </CardBody>
          </Card>
        ) : (
          jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardBody className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <Link href={`/jobs/${job.slug}`}>
                          <h3 className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer">
                            {job.title}
                          </h3>
                        </Link>
                        {!job.isPublic && (
                          <Chip size="sm" color="warning" variant="flat">
                            Private
                          </Chip>
                        )}
                      </div>

                      <p className="text-default-600 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-default-500">
                        {job.experienceLevel && (
                          <div className="flex items-center gap-1">
                            <BriefcaseIcon className="h-4 w-4" />
                            <span className="capitalize">
                              {job.experienceLevel} Level
                            </span>
                          </div>
                        )}

                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <UsersIcon className="h-4 w-4" />
                          <span>{job.applicationCount} applicants</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Posted {formatDate(job.createdAt)}</span>
                        </div>
                      </div>

                      {job.salary && (
                        <div className="text-sm">
                          <span className="font-medium">Salary: </span>
                          <span className="text-success">
                            {formatSalary(job.salary)}
                          </span>
                        </div>
                      )}

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 6).map((skill, skillIndex) => (
                            <Chip key={skillIndex} size="sm" variant="flat">
                              {skill}
                            </Chip>
                          ))}
                          {job.skills.length > 6 && (
                            <Chip size="sm" variant="flat" color="default">
                              +{job.skills.length - 6} more
                            </Chip>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      {job.deadline && (
                        <div
                          className={`text-sm ${isDeadlineSoon(job.deadline) ? "text-warning" : "text-default-500"}`}
                        >
                          Deadline: {formatDate(job.deadline)}
                        </div>
                      )}

                      <Link href={`/jobs/${job.slug}`}>
                        <Button color="primary" variant="flat">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="flat"
            isDisabled={pagination.page === 1}
            onPress={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>

          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const pageNum = Math.max(1, pagination.page - 2) + i;
            if (pageNum > pagination.pages) return null;

            return (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? "solid" : "flat"}
                color={pageNum === pagination.page ? "primary" : "default"}
                onPress={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="flat"
            isDisabled={pagination.page === pagination.pages}
            onPress={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Results summary */}
      {!loading && jobs.length > 0 && (
        <div className="text-center text-sm text-default-500">
          Showing {jobs.length} of {pagination.total} jobs
        </div>
      )}
    </div>
  );
}
