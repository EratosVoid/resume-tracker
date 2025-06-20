"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Progress } from "@heroui/react";
import { BrainIcon } from "lucide-react";

// Import the decoupled components
import ModeSelector from "./components/ModeSelector";
import ChatMode from "./components/ChatMode";
import FormMode from "./components/FormMode";
import ResumeGeneratedView from "./components/ResumeGeneratedView";

interface Skill {
  name: string;
  proof: string;
  validated: boolean;
}

interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

interface Education {
  school: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa?: string;
  honors?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  achievements: string[];
}

interface Achievement {
  title: string;
  description: string;
  date: string;
  proof?: string;
}

interface FormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  targetRole: string;
  experience: string;
  skills: Skill[];
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  achievements: Achievement[];
}

interface GeneratedResumeResponse {
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
  downloadUrl?: string;
  metadata: {
    generatedAt: string;
    mode: string;
    validated: number;
    totalSections: number;
  };
}

type ViewState = "mode-select" | "chat" | "form" | "generated";

export default function ResumeCreatePage() {
  const [currentView, setCurrentView] = useState<ViewState>("mode-select");
  const [creationMode, setCreationMode] = useState<"form" | "chat" | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] =
    useState<GeneratedResumeResponse | null>(null);
  const [originalStructuredData, setOriginalStructuredData] =
    useState<FormData | null>(null);

  // Validate and ensure FormData structure is complete
  const validateFormData = (data: FormData): FormData => {
    console.log("Validating form data:", data);

    // Ensure all required fields have default values
    const validatedData: FormData = {
      personalInfo: {
        fullName: data.personalInfo?.fullName || "",
        email: data.personalInfo?.email || "",
        phone: data.personalInfo?.phone || "",
        location: data.personalInfo?.location || "",
        linkedin: data.personalInfo?.linkedin || "",
        portfolio: data.personalInfo?.portfolio || "",
      },
      targetRole: data.targetRole || "",
      experience: data.experience || "",
      skills: data.skills || [],
      workExperience: data.workExperience || [],
      education: data.education || [],
      projects: data.projects || [],
      achievements: data.achievements || [],
    };

    console.log("Validated form data:", validatedData);
    return validatedData;
  };

  const handleGenerateResume = async (data: FormData) => {
    console.log("Generate resume called with data:", data);
    setIsGenerating(true);

    try {
      // Validate and ensure data structure is complete
      const resumeData = validateFormData(data);

      console.log("Resume data to send:", resumeData);

      // Make API request to generate resume
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: resumeData,
          mode: creationMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate resume");
      }

      const result = await response.json();
      console.log("Resume generation result:", result);

      if (result.success) {
        setGeneratedResume(result);
        setOriginalStructuredData(resumeData); // Store the original data
        setCurrentView("generated");
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Resume generation error:", error);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModeSelect = (mode: "form" | "chat") => {
    setCreationMode(mode);
    setCurrentView(mode);
  };

  const handleBackToModeSelect = () => {
    setCurrentView("mode-select");
    setCreationMode(null);
    setGeneratedResume(null);
    setOriginalStructuredData(null);
  };

  const handleBackToCreation = () => {
    if (creationMode) {
      setCurrentView(creationMode);
    } else {
      setCurrentView("mode-select");
    }
  };

  const handleEditResume = () => {
    // Go back to the creation mode that was used
    if (creationMode) {
      setCurrentView(creationMode);
    } else {
      setCurrentView("mode-select");
    }
  };

  // Render loading state during generation
  if (isGenerating) {
    return (
      <div className="min-h-screen max-h-screen overflow-y-auto bg-default-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6"
        >
          <Card className="p-8 max-w-md mx-auto">
            <CardBody className="text-center space-y-6">
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                <BrainIcon className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Generating Your Validated Resume
                </h2>
                <p className="text-default-600 mb-6">
                  Our AI is crafting your professional resume with validated
                  claims...
                </p>
                <Progress
                  value={75}
                  color="primary"
                  className="max-w-md mx-auto"
                  showValueLabel={true}
                />
              </div>
              <p className="text-sm text-default-500">
                Verifying achievements and optimizing for ATS
              </p>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Render the appropriate view based on current state
  switch (currentView) {
    case "mode-select":
      return <ModeSelector onModeSelect={handleModeSelect} />;

    case "chat":
      return (
        <ChatMode
          onBack={handleBackToModeSelect}
          onGenerateResume={handleGenerateResume}
          isGenerating={isGenerating}
        />
      );

    case "form":
      return (
        <FormMode
          onBack={handleBackToModeSelect}
          onGenerateResume={handleGenerateResume}
          isGenerating={isGenerating}
        />
      );

    case "generated":
      return generatedResume ? (
        <ResumeGeneratedView
          resumeData={generatedResume}
          onBack={handleBackToCreation}
          onEdit={handleEditResume}
          creationMode={creationMode!}
          structuredData={originalStructuredData}
        />
      ) : (
        <div>Error: No resume data available</div>
      );

    default:
      return <ModeSelector onModeSelect={handleModeSelect} />;
  }
}
