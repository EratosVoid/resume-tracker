"use client";

import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import {
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  DollarSignIcon,
  UsersIcon,
  ClockIcon,
} from "lucide-react";

interface JobDetailsProps {
  job: {
    title: string;
    description: string;
    location?: string;
    experienceLevel?: string;
    salary?: {
      min?: number;
      max?: number;
      currency?: string;
    };
    applicationCount: number;
    createdAt: string;
    deadline?: string;
    requirements?: string[];
    skills?: string[];
    isPublic: boolean;
  };
}

export default function JobDetails({ job }: JobDetailsProps) {
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
      month: "long",
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

  const isExpired = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            {!job.isPublic && (
              <Chip color="warning" variant="flat">
                Private Listing
              </Chip>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-default-600">
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}

            {job.experienceLevel && (
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4" />
                <span className="capitalize">{job.experienceLevel} Level</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              <span>{job.applicationCount} applicants</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>

          {job.salary && (
            <div className="flex items-center gap-2 text-success">
              <DollarSignIcon className="h-4 w-4" />
              <span className="font-semibold">{formatSalary(job.salary)}</span>
            </div>
          )}

          {job.deadline && (
            <div
              className={`flex items-center gap-2 ${
                isExpired(job.deadline)
                  ? "text-danger"
                  : isDeadlineSoon(job.deadline)
                  ? "text-warning"
                  : "text-default-600"
              }`}
            >
              <ClockIcon className="h-4 w-4" />
              <span>
                {isExpired(job.deadline)
                  ? "Expired"
                  : `Application deadline: ${formatDate(job.deadline)}`}
              </span>
              {isDeadlineSoon(job.deadline) && (
                <Chip size="sm" color="warning" variant="flat">
                  Closing Soon
                </Chip>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <div className="prose max-w-none text-default-700">
            {job.description
              .split("\n")
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-3">
                  {paragraph}
                </p>
              ))}
          </div>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <>
            <Divider />
            <div>
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-default-700">
                {job.requirements.map((requirement: string, index: number) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {job.skills && job.skills.length > 0 && (
          <>
            <Divider />
            <div>
              <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, index: number) => (
                  <Chip key={index} variant="flat" color="primary">
                    {skill}
                  </Chip>
                ))}
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
