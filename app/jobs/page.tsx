import { Metadata } from "next";
import JobList from "@/components/jobs/JobList";

export const metadata: Metadata = {
  title: "Jobs - Resume Tracker ATS",
  description:
    "Browse available job opportunities and apply with AI-powered resume analysis.",
};

export default function JobsPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Available Positions</h1>
          <p className="text-xl text-default-600">
            Discover exciting opportunities and apply with our AI-powered
            application system
          </p>
        </div>

        <JobList />
      </div>
    </div>
  );
}
