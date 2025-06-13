"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Progress,
  Divider,
  Link,
} from "@heroui/react";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  MapPinIcon,
  DollarSignIcon,
  CalendarIcon,
  UsersIcon,
  StarIcon,
  DownloadIcon,
  EyeIcon,
  EditIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  FileTextIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Job {
  _id: string;
  title: string;
  description: string;
  location?: string;
  experienceLevel?: string;
  employmentType?: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  skills: string[];
  requirements: string[];
  benefits: string[];
  isPublic: boolean;
  status: "active" | "paused" | "closed";
  deadline?: string;
  createdAt: string;
  slug: string;
  applicationCount: number;
}

interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  parsedResumeData?: any;
  atsScore: number;
  skillsMatched: string[];
  submittedAt: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
}

const statusColors = {
  pending: "warning",
  reviewed: "primary",
  shortlisted: "success",
  rejected: "danger",
} as const;

const getScoreColor = (score: number) => {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
};

const getPriorityLevel = (score: number) => {
  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Low";
};

export default function JobViewPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    isOpen: isApplicantOpen,
    onOpen: onApplicantOpen,
    onClose: onApplicantClose,
  } = useDisclosure();

  useEffect(() => {
    if (slug) {
      fetchJobData();
      fetchApplicants();
    }
  }, [slug, statusFilter, currentPage]);

  const fetchJobData = async () => {
    try {
      const response = await fetch(`/api/jobs/${slug}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch job data");
      }

      setJob(result.job);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load job"
      );
      router.push("/dashboard/jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    setApplicantsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/jobs/${slug}/applications?${params}`);
      const result = await response.json();

      if (response.ok) {
        // Sort by ATS score (highest first) for prioritization
        const sortedApplicants = result.applications.sort(
          (a: Applicant, b: Applicant) => (b.atsScore || 0) - (a.atsScore || 0)
        );
        setApplicants(sortedApplicants);
        setTotalPages(result.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to fetch applicants");
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `/api/jobs/${slug}/applications/${applicantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast.success("Applicant status updated");
        fetchApplicants();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update applicant status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (salary: any) => {
    if (!salary) return "Not specified";
    const { min, max, currency } = salary;
    const symbol =
      currency === "USD"
        ? "$"
        : currency === "EUR"
        ? "€"
        : currency === "GBP"
        ? "£"
        : "₹";

    if (min && max) {
      return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    } else if (min) {
      return `${symbol}${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${symbol}${max.toLocaleString()}`;
    }
    return "Not specified";
  };

  const getTopSkills = () => {
    if (!applicants.length) return [];

    const skillCounts: { [key: string]: number } = {};
    applicants.forEach((applicant) => {
      applicant.skillsMatched?.forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-default-600 mb-4">
            The job you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/dashboard/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              variant="light"
              onClick={() => router.push("/dashboard/jobs")}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="text-default-600">Job Details & Applications</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              as={Link}
              href={`/dashboard/jobs/${slug}/edit`}
              variant="flat"
              startContent={<EditIcon className="h-4 w-4" />}
            >
              Edit Job
            </Button>
            <Button
              as={Link}
              href={`/jobs/${slug}`}
              target="_blank"
              variant="flat"
              startContent={<EyeIcon className="h-4 w-4" />}
            >
              View Public
            </Button>
          </div>
        </div>

        <Tabs defaultSelectedKey="overview" className="w-full">
          <Tab key="overview" title="Overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Job Information</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Chip
                        color={
                          job.status === "active"
                            ? "success"
                            : job.status === "paused"
                            ? "warning"
                            : "danger"
                        }
                        variant="flat"
                      >
                        {job.status}
                      </Chip>
                      <Chip
                        color={job.isPublic ? "success" : "warning"}
                        variant="flat"
                      >
                        {job.isPublic ? "Public" : "Private"}
                      </Chip>
                      {job.experienceLevel && (
                        <Chip variant="flat">{job.experienceLevel} Level</Chip>
                      )}
                      {job.employmentType && (
                        <Chip variant="flat">{job.employmentType}</Chip>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.location && (
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-default-400" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <DollarSignIcon className="h-4 w-4 text-default-400" />
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-default-400" />
                        <span>Posted {formatDate(job.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-default-400" />
                        <span>{job.applicationCount} Applications</span>
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-default-600 whitespace-pre-wrap">
                        {job.description}
                      </p>
                    </div>

                    {job.skills?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <Chip key={index} color="primary" variant="flat">
                              {skill}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}

                    {job.requirements?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <ul className="list-disc list-inside space-y-1 text-default-600">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {job.benefits?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Benefits</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((benefit, index) => (
                            <Chip key={index} color="success" variant="flat">
                              {benefit}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>

              {/* Statistics */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Application Stats</h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {applicants.length}
                      </div>
                      <div className="text-sm text-default-600">
                        Total Applications
                      </div>
                    </div>

                    <Divider />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">High Priority</span>
                        <span className="text-sm font-semibold">
                          {applicants.filter((a) => a.atsScore >= 80).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Medium Priority</span>
                        <span className="text-sm font-semibold">
                          {
                            applicants.filter(
                              (a) => a.atsScore >= 60 && a.atsScore < 80
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Low Priority</span>
                        <span className="text-sm font-semibold">
                          {applicants.filter((a) => a.atsScore < 60).length}
                        </span>
                      </div>
                    </div>

                    {applicants.length > 0 && (
                      <>
                        <Divider />
                        <div>
                          <div className="text-sm text-default-600 mb-2">
                            Average ATS Score
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={
                                applicants.reduce(
                                  (sum, a) => sum + (a.atsScore || 0),
                                  0
                                ) / applicants.length
                              }
                              color={getScoreColor(
                                applicants.reduce(
                                  (sum, a) => sum + (a.atsScore || 0),
                                  0
                                ) / applicants.length
                              )}
                              className="flex-1"
                            />
                            <span className="text-sm font-semibold">
                              {Math.round(
                                applicants.reduce(
                                  (sum, a) => sum + (a.atsScore || 0),
                                  0
                                ) / applicants.length
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>

                {/* Top Skills */}
                {getTopSkills().length > 0 && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">
                        Most Common Skills
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-2">
                        {getTopSkills().map(({ skill, count }) => (
                          <div
                            key={skill}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">{skill}</span>
                            <Chip size="sm" variant="flat">
                              {count}
                            </Chip>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          </Tab>

          <Tab key="applicants" title={`Applicants (${applicants.length})`}>
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4">
                <Select
                  placeholder="Filter by status"
                  selectedKeys={statusFilter ? [statusFilter] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setStatusFilter(selected || "all");
                  }}
                  className="w-48"
                >
                  <SelectItem key="all">All Status</SelectItem>
                  <SelectItem key="pending">Pending</SelectItem>
                  <SelectItem key="reviewed">Reviewed</SelectItem>
                  <SelectItem key="shortlisted">Shortlisted</SelectItem>
                  <SelectItem key="rejected">Rejected</SelectItem>
                </Select>
              </div>

              {/* Applicants Table */}
              <Card>
                <CardBody>
                  <Table aria-label="Applicants table">
                    <TableHeader>
                      <TableColumn>APPLICANT</TableColumn>
                      <TableColumn>ATS SCORE</TableColumn>
                      <TableColumn>PRIORITY</TableColumn>
                      <TableColumn>SKILLS MATCHED</TableColumn>
                      <TableColumn>STATUS</TableColumn>
                      <TableColumn>APPLIED</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody
                      isLoading={applicantsLoading}
                      emptyContent="No applicants found"
                    >
                      {applicants.map((applicant) => (
                        <TableRow key={applicant._id}>
                          <TableCell>
                            <div>
                              <p className="font-semibold">{applicant.name}</p>
                              <p className="text-sm text-default-500">
                                {applicant.email}
                              </p>
                              {applicant.phone && (
                                <p className="text-xs text-default-400">
                                  {applicant.phone}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={applicant.atsScore || 0}
                                color={getScoreColor(applicant.atsScore || 0)}
                                className="w-16"
                                size="sm"
                              />
                              <span className="text-sm font-semibold">
                                {applicant.atsScore || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="sm"
                              color={getScoreColor(applicant.atsScore || 0)}
                              variant="flat"
                            >
                              {getPriorityLevel(applicant.atsScore || 0)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {applicant.skillsMatched
                                ?.slice(0, 3)
                                .map((skill, index) => (
                                  <Chip key={index} size="sm" variant="flat">
                                    {skill}
                                  </Chip>
                                ))}
                              {(applicant.skillsMatched?.length || 0) > 3 && (
                                <Chip size="sm" variant="flat">
                                  +{(applicant.skillsMatched?.length || 0) - 3}
                                </Chip>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              selectedKeys={[applicant.status]}
                              onSelectionChange={(keys) => {
                                const newStatus = Array.from(keys)[0] as string;
                                if (newStatus !== applicant.status) {
                                  handleStatusChange(applicant._id, newStatus);
                                }
                              }}
                              className="w-32"
                              size="sm"
                            >
                              <SelectItem key="pending">Pending</SelectItem>
                              <SelectItem key="reviewed">Reviewed</SelectItem>
                              <SelectItem key="shortlisted">
                                Shortlisted
                              </SelectItem>
                              <SelectItem key="rejected">Rejected</SelectItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3 text-default-400" />
                              <span className="text-xs">
                                {formatDate(applicant.submittedAt)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                onClick={() => {
                                  setSelectedApplicant(applicant);
                                  onApplicantOpen();
                                }}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              {applicant.resumeUrl && (
                                <Button
                                  size="sm"
                                  variant="light"
                                  isIconOnly
                                  as={Link}
                                  href={applicant.resumeUrl}
                                  target="_blank"
                                >
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>

        {/* Applicant Detail Modal */}
        <Modal
          isOpen={isApplicantOpen}
          onClose={onApplicantClose}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedApplicant?.name}
                  </h3>
                  <p className="text-sm text-default-600">Applicant Details</p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              {selectedApplicant && (
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4 text-default-400" />
                        <span className="text-sm">
                          {selectedApplicant.email}
                        </span>
                      </div>
                      {selectedApplicant.phone && (
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-default-400" />
                          <span className="text-sm">
                            {selectedApplicant.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ATS Score */}
                  <div>
                    <h4 className="font-semibold mb-3">ATS Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>ATS Score</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={selectedApplicant.atsScore || 0}
                            color={getScoreColor(
                              selectedApplicant.atsScore || 0
                            )}
                            className="w-24"
                          />
                          <span className="font-semibold">
                            {selectedApplicant.atsScore || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Priority Level</span>
                        <Chip
                          color={getScoreColor(selectedApplicant.atsScore || 0)}
                          variant="flat"
                        >
                          {getPriorityLevel(selectedApplicant.atsScore || 0)}
                        </Chip>
                      </div>
                    </div>
                  </div>

                  {/* Skills Matched */}
                  {selectedApplicant.skillsMatched?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Skills Matched</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.skillsMatched.map((skill, index) => (
                          <Chip key={index} color="success" variant="flat">
                            {skill}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resume Data */}
                  {selectedApplicant.parsedResumeData && (
                    <div>
                      <h4 className="font-semibold mb-3">Resume Summary</h4>
                      <div className="bg-default-50 p-4 rounded-lg">
                        <p className="text-sm text-default-600">
                          {selectedApplicant.parsedResumeData.summary ||
                            "Resume content available for detailed review"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Application Details */}
                  <div>
                    <h4 className="font-semibold mb-3">Application Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-default-600">
                          Applied
                        </span>
                        <span className="text-sm">
                          {formatDate(selectedApplicant.submittedAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-default-600">
                          Current Status
                        </span>
                        <Chip
                          size="sm"
                          color={
                            statusColors[selectedApplicant.status] || "default"
                          }
                          variant="flat"
                        >
                          {selectedApplicant.status}
                        </Chip>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onApplicantClose}>
                Close
              </Button>
              {selectedApplicant?.resumeUrl && (
                <Button
                  color="primary"
                  as={Link}
                  href={selectedApplicant.resumeUrl}
                  target="_blank"
                  startContent={<DownloadIcon className="h-4 w-4" />}
                >
                  Download Resume
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
