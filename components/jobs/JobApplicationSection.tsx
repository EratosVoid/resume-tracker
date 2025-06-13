"use client";

import { Card, CardBody } from "@heroui/react";
import { ClockIcon } from "lucide-react";
import ResumeUpload from "@/components/resume/ResumeUpload";

interface JobApplicationSectionProps {
  job: {
    slug: string;
    title: string;
    deadline?: string;
  };
}

export default function JobApplicationSection({
  job,
}: JobApplicationSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpired = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <>
      {!isExpired(job.deadline) ? (
        <div className="p-6">
          <ResumeUpload
            jobSlug={job.slug}
            jobTitle={job.title}
            onSubmissionComplete={(result) => {
              console.log("Application submitted:", result);
            }}
          />
        </div>
      ) : (
        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-8 w-8 text-danger-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-danger-600">
              Application Deadline Passed
            </h3>
            <p className="text-default-600 text-sm">
              The application deadline for this position was{" "}
              {formatDate(job.deadline!)}.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
