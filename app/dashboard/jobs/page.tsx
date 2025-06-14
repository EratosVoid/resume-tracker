"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  EditIcon,
  MoreVerticalIcon,
  TrashIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Job {
  _id: string;
  title: string;
  description: string;
  isPublic: boolean;
  status: "active" | "paused" | "closed";
  applicationCount: number;
  createdAt: string;
  deadline?: string;
  slug: string;
  location?: string;
  experienceLevel?: string;
}

const statusOptions = [
  { key: "all", label: "All Jobs" },
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
  { key: "closed", label: "Closed" },
];

const visibilityOptions = [
  { key: "all", label: "All Visibility" },
  { key: "public", label: "Public" },
  { key: "private", label: "Private" },
];

export default function JobsManagePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, statusFilter, visibilityFilter, currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        userOnly: "true",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (visibilityFilter !== "all")
        params.append(
          "public",
          visibilityFilter === "public" ? "true" : "false"
        );

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();

      if (response.ok) {
        setJobs(data.jobs);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Job status updated successfully");
        fetchJobs();
      } else {
        throw new Error("Failed to update job status");
      }
    } catch (error) {
      toast.error("Failed to update job status");
    }
  };

  const handleVisibilityChange = async (jobId: string, isPublic: boolean) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic }),
      });

      if (response.ok) {
        toast.success(`Job ${isPublic ? "made public" : "made private"}`);
        fetchJobs();
      } else {
        throw new Error("Failed to update job visibility");
      }
    } catch (error) {
      toast.error("Failed to update job visibility");
    }
  };

  const handleDelete = async () => {
    if (!selectedJob) return;

    try {
      const response = await fetch(`/api/jobs/${selectedJob._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Job deleted successfully");
        fetchJobs();
        onDeleteClose();
      } else {
        throw new Error("Failed to delete job");
      }
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "closed":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircleIcon;
      case "paused":
        return PauseCircleIcon;
      case "closed":
        return XCircleIcon;
      default:
        return CheckCircleIcon;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Job Management</h1>
            <p className="text-default-600">
              Manage your job postings and applications
            </p>
          </div>

          <Button
            as={Link}
            href="/dashboard/jobs/new"
            color="primary"
            startContent={<PlusIcon className="h-4 w-4" />}
          >
            Post New Job
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<SearchIcon className="h-4 w-4" />}
                className="md:w-80"
              />

              <Select
                placeholder="Filter by status"
                selectedKeys={statusFilter ? [statusFilter] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setStatusFilter(selected || "all");
                }}
                className="md:w-48"
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.key} textValue={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                placeholder="Filter by visibility"
                selectedKeys={visibilityFilter ? [visibilityFilter] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setVisibilityFilter(selected || "all");
                }}
                className="md:w-48"
              >
                {visibilityOptions.map((option) => (
                  <SelectItem key={option.key} textValue={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardBody>
            <Table aria-label="Jobs table">
              <TableHeader>
                <TableColumn>JOB TITLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>VISIBILITY</TableColumn>
                <TableColumn>APPLICATIONS</TableColumn>
                <TableColumn>CREATED</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody isLoading={loading} emptyContent="No jobs found">
                {jobs.map((job) => {
                  const StatusIcon = getStatusIcon(job.status);
                  return (
                    <TableRow key={job._id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{job.title}</p>
                          <p className="text-sm text-default-500 line-clamp-1">
                            {job.description}
                          </p>
                          {job.location && (
                            <p className="text-xs text-default-400">
                              {job.location}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={getStatusColor(job.status)}
                          variant="flat"
                          startContent={<StatusIcon className="h-3 w-3" />}
                        >
                          {job.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={job.isPublic ? "success" : "warning"}
                          variant="flat"
                        >
                          {job.isPublic ? "Public" : "Private"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <UsersIcon className="h-4 w-4 text-default-400" />
                          <span>{job.applicationCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4 text-default-400" />
                          <span className="text-sm">
                            {formatDate(job.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            as={Link}
                            href={`/dashboard/jobs/${job.slug}`}
                            size="sm"
                            variant="light"
                            isIconOnly
                            title="View job details and applications"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>

                          <Button
                            as={Link}
                            href={`/dashboard/jobs/${job.slug}/edit`}
                            size="sm"
                            variant="light"
                            isIconOnly
                            title="Edit job details"
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>

                          <Dropdown>
                            <DropdownTrigger>
                              <Button size="sm" variant="light" isIconOnly>
                                <MoreVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Job actions">
                              <DropdownItem
                                key="toggle-status"
                                onClick={() =>
                                  handleStatusChange(
                                    job._id,
                                    job.status === "active"
                                      ? "paused"
                                      : "active"
                                  )
                                }
                              >
                                {job.status === "active"
                                  ? "Pause Job"
                                  : "Activate Job"}
                              </DropdownItem>
                              <DropdownItem
                                key="toggle-visibility"
                                onClick={() =>
                                  handleVisibilityChange(job._id, !job.isPublic)
                                }
                              >
                                Make {job.isPublic ? "Private" : "Public"}
                              </DropdownItem>
                              <DropdownItem
                                key="applications"
                                as={Link}
                                href={`/dashboard/jobs/${job.slug}/applications`}
                              >
                                View Applications
                              </DropdownItem>
                              <DropdownItem
                                key="delete"
                                color="danger"
                                onClick={() => {
                                  setSelectedJob(job);
                                  onDeleteOpen();
                                }}
                              >
                                Delete Job
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalContent>
            <ModalHeader>Delete Job</ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete "{selectedJob?.title}"? This
                action cannot be undone. All applications for this job will also
                be permanently deleted.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onDeleteClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDelete}>
                Delete Job
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
