"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, Button, Chip, Spinner } from "@heroui/react";
import { DownloadIcon, ShareIcon, EyeIcon } from "lucide-react";

interface ResumeData {
  success: boolean;
  resume: {
    personalInfo: any;
    summary: string;
    experience: any[];
    education: any[];
    skills: string[];
    projects: any[];
    achievements: any[];
  };
  atsScore: number;
  metadata: {
    generatedAt: string;
    mode: string;
    validated: number;
    totalSections: number;
  };
}

export default function SharedResumePage() {
  const params = useParams();
  const shareableId = params.shareableId as string;
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedResume = async () => {
      try {
        const response = await fetch(`/api/resume/share/${shareableId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch resume");
        }

        setResumeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (shareableId) {
      fetchSharedResume();
    }
  }, [shareableId]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-default-600">Loading shared resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center p-8">
            <div className="text-danger text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold mb-2">Resume Not Found</h1>
            <p className="text-default-600 mb-4">{error}</p>
            <Button color="primary" href="/">
              Go Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!resumeData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-default-50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-default-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <EyeIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Shared Resume</h1>
                <p className="text-sm text-default-600">
                  Created via {resumeData.metadata.mode} mode • ATS Score:{" "}
                  {resumeData.atsScore}%
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="bordered"
                startContent={<ShareIcon className="h-4 w-4" />}
                onPress={() => {
                  navigator.clipboard.writeText(window.location.href);
                  // You could add a toast notification here
                }}
              >
                Copy Link
              </Button>
              <Button
                color="primary"
                startContent={<DownloadIcon className="h-4 w-4" />}
              >
                Download PDF
              </Button>
            </div>
          </div>

          {/* Score Badge */}
          <div className="mt-4">
            <Chip
              color={getScoreColor(resumeData.atsScore)}
              variant="flat"
              size="lg"
            >
              ATS Score: {resumeData.atsScore}%
            </Chip>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardBody className="p-0">
            <div className="bg-white dark:bg-gray-50 border rounded-lg min-h-[1000px] shadow-lg overflow-hidden">
              {/* Resume Paper */}
              <div className="max-w-[8.5in] mx-auto bg-white p-12 min-h-[11in] text-gray-900 font-serif leading-relaxed">
                {/* Header Section */}
                <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-wide">
                    {resumeData.resume.personalInfo.fullName}
                  </h1>
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                    {resumeData.resume.personalInfo.email && (
                      <span className="flex items-center gap-1">
                        <span>✉</span>
                        {resumeData.resume.personalInfo.email}
                      </span>
                    )}
                    {resumeData.resume.personalInfo.phone && (
                      <span className="flex items-center gap-1">
                        <span>📞</span>
                        {resumeData.resume.personalInfo.phone}
                      </span>
                    )}
                    {resumeData.resume.personalInfo.location && (
                      <span className="flex items-center gap-1">
                        <span>📍</span>
                        {resumeData.resume.personalInfo.location}
                      </span>
                    )}
                    {resumeData.resume.personalInfo.linkedin && (
                      <a
                        href={
                          resumeData.resume.personalInfo.linkedin.startsWith(
                            "http"
                          )
                            ? resumeData.resume.personalInfo.linkedin
                            : `https://${resumeData.resume.personalInfo.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <span>💼</span>
                        {resumeData.resume.personalInfo.linkedin
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")}
                      </a>
                    )}
                    {resumeData.resume.personalInfo.portfolio && (
                      <a
                        href={
                          resumeData.resume.personalInfo.portfolio.startsWith(
                            "http"
                          )
                            ? resumeData.resume.personalInfo.portfolio
                            : `https://${resumeData.resume.personalInfo.portfolio}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <span>🌐</span>
                        {resumeData.resume.personalInfo.portfolio
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")}
                      </a>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {resumeData.resume.summary && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
                      Professional Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-justify">
                      {resumeData.resume.summary}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {resumeData.resume.skills?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
                      Core Competencies
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                      {resumeData.resume.skills.map((skill, index) => (
                        <div key={index} className="text-gray-700 text-sm">
                          • {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional Experience */}
                {resumeData.resume.experience?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
                      Professional Experience
                    </h2>
                    <div className="space-y-6">
                      {resumeData.resume.experience.map((exp, index) => (
                        <div key={index} className="relative">
                          {typeof exp === "object" && exp.company ? (
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {exp.title}
                                  </h3>
                                  <p className="text-gray-700 font-medium">
                                    {exp.company}
                                  </p>
                                </div>
                                <div className="text-right text-sm text-gray-600">
                                  <p>
                                    {exp.startDate} - {exp.endDate}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-3 leading-relaxed">
                                {exp.description}
                              </p>
                              {exp.achievements &&
                                exp.achievements.length > 0 && (
                                  <ul className="list-none space-y-1 ml-4">
                                    {exp.achievements.map(
                                      (
                                        achievement: string,
                                        achIndex: number
                                      ) => (
                                        <li
                                          key={achIndex}
                                          className="text-gray-700 text-sm relative"
                                        >
                                          <span className="absolute -left-4 text-gray-500">
                                            ▸
                                          </span>
                                          {achievement}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                            </div>
                          ) : (
                            <div className="text-gray-700 leading-relaxed">
                              {typeof exp === "string"
                                ? exp
                                : exp.description || "Experience details"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resumeData.resume.education?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
                      Education
                    </h2>
                    <div className="space-y-4">
                      {resumeData.resume.education.map((edu, index) => (
                        <div key={index}>
                          {typeof edu === "object" && edu.school ? (
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {edu.degree} in {edu.field}
                                </h3>
                                <p className="text-gray-700 font-medium">
                                  {edu.school}
                                </p>
                                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                                  {edu.honors && (
                                    <span className="font-medium text-gray-700">
                                      {edu.honors}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right text-sm text-gray-600">
                                <p>Graduated {edu.graduationYear}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700">
                              {typeof edu === "string"
                                ? edu
                                : edu.description || "Education details"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {resumeData.resume.projects?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
                      Key Projects
                    </h2>
                    <div className="space-y-4">
                      {resumeData.resume.projects.map((project, index) => (
                        <div key={index}>
                          {typeof project === "object" && project.name ? (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {project.name}
                              </h3>
                              <p className="text-gray-700 mb-2 leading-relaxed">
                                {project.description}
                              </p>
                              {project.technologies &&
                                project.technologies.length > 0 && (
                                  <div className="mb-2">
                                    <span className="text-sm font-medium text-gray-600">
                                      Technologies:{" "}
                                    </span>
                                    <span className="text-sm text-gray-700">
                                      {project.technologies.join(", ")}
                                    </span>
                                  </div>
                                )}
                              {project.achievements &&
                                project.achievements.length > 0 && (
                                  <ul className="list-none space-y-1 ml-4">
                                    {project.achievements.map(
                                      (
                                        achievement: string,
                                        achIndex: number
                                      ) => (
                                        <li
                                          key={achIndex}
                                          className="text-gray-700 text-sm relative"
                                        >
                                          <span className="absolute -left-4 text-gray-500">
                                            ▸
                                          </span>
                                          {achievement}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                            </div>
                          ) : (
                            <p className="text-gray-700">
                              {typeof project === "string"
                                ? project
                                : project.description || "Project details"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements & Awards */}
                {resumeData.resume.achievements?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
                      Achievements & Awards
                    </h2>
                    <div className="space-y-3">
                      {resumeData.resume.achievements.map(
                        (achievement, index) => (
                          <div key={index}>
                            {typeof achievement === "object" &&
                            achievement.title ? (
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900">
                                    {achievement.title}
                                  </h3>
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {achievement.description}
                                  </p>
                                </div>
                                {achievement.date && (
                                  <div className="text-sm text-gray-600 ml-4">
                                    {achievement.date}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-700">
                                {typeof achievement === "string"
                                  ? achievement
                                  : achievement.description ||
                                    "Achievement details"}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
