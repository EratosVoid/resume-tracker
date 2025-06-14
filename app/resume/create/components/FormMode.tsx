"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Divider,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  WandIcon,
  UserIcon,
  BrainIcon,
  FileTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  LinkIcon,
  GithubIcon,
  ExternalLinkIcon,
} from "lucide-react";

interface Skill {
  name: string;
  proof: string;
  validated: boolean;
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
  workExperience: any[];
  education: any[];
  projects: any[];
  achievements: any[];
}

interface FormModeProps {
  onBack: () => void;
  onGenerateResume: (formData: FormData) => void;
  isGenerating: boolean;
}

const steps = [
  { title: "Personal Info", icon: UserIcon },
  { title: "Target Role", icon: BrainIcon },
  { title: "Experience", icon: FileTextIcon },
  { title: "AI Generation", icon: SparklesIcon },
];

const experienceLevels = [
  { key: "entry", label: "Entry Level (0-2 years)" },
  { key: "mid", label: "Mid Level (2-5 years)" },
  { key: "senior", label: "Senior Level (5-10 years)" },
  { key: "lead", label: "Lead/Principal (10+ years)" },
];

export default function FormMode({
  onBack,
  onGenerateResume,
  isGenerating,
}: FormModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
    },
    targetRole: "",
    experience: "",
    skills: [],
    workExperience: [],
    education: [],
    projects: [],
    achievements: [],
  });

  const handleInputChange = (
    section: keyof FormData,
    field: string,
    value: any
  ) => {
    if (section === "personalInfo") {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: value,
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateClick = () => {
    onGenerateResume(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
              <p className="text-default-600">
                Let's start with your basic details
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.personalInfo.fullName}
                onChange={(e) =>
                  handleInputChange("personalInfo", "fullName", e.target.value)
                }
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={formData.personalInfo.email}
                onChange={(e) =>
                  handleInputChange("personalInfo", "email", e.target.value)
                }
              />
              <Input
                label="Phone"
                placeholder="+1 (555) 123-4567"
                value={formData.personalInfo.phone}
                onChange={(e) =>
                  handleInputChange("personalInfo", "phone", e.target.value)
                }
              />
              <Input
                label="Location"
                placeholder="City, State"
                value={formData.personalInfo.location}
                onChange={(e) =>
                  handleInputChange("personalInfo", "location", e.target.value)
                }
              />
              <Input
                label="LinkedIn"
                placeholder="linkedin.com/in/johndoe"
                value={formData.personalInfo.linkedin}
                onChange={(e) =>
                  handleInputChange("personalInfo", "linkedin", e.target.value)
                }
              />
              <Input
                label="Portfolio/Website"
                placeholder="johndoe.com"
                value={formData.personalInfo.portfolio}
                onChange={(e) =>
                  handleInputChange("personalInfo", "portfolio", e.target.value)
                }
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Target Role & Experience
              </h2>
              <p className="text-default-600">
                Tell us about your career goals with validation
              </p>
            </div>

            <div className="space-y-6">
              <Input
                label="Target Job Title"
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                value={formData.targetRole}
                onChange={(e) =>
                  handleInputChange("targetRole", "", e.target.value)
                }
                description="What role are you applying for?"
              />

              <Select
                label="Experience Level"
                placeholder="Select your experience level"
                selectedKeys={formData.experience ? [formData.experience] : []}
                onSelectionChange={(keys) =>
                  handleInputChange(
                    "experience",
                    "",
                    Array.from(keys)[0] as string
                  )
                }
              >
                {experienceLevels.map((level) => (
                  <SelectItem key={level.key}>{level.label}</SelectItem>
                ))}
              </Select>

              {/* Enhanced Skills Section with Proof */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Key Skills (with proof required)
                </label>
                <Input
                  placeholder="Type a skill and press Enter"
                  onKeyPress={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (e.key === "Enter" && target.value.trim()) {
                      setFormData((prev) => ({
                        ...prev,
                        skills: [
                          ...prev.skills,
                          {
                            name: target.value.trim(),
                            proof: "",
                            validated: false,
                          },
                        ],
                      }));
                      target.value = "";
                    }
                  }}
                />
                <div className="space-y-3 mt-4">
                  {formData.skills.map((skill, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => {
                            setFormData((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                      <Input
                        size="sm"
                        placeholder="Provide proof: certifications, project links, experience..."
                        value={skill.proof || ""}
                        onChange={(e) => {
                          const newSkills = [...formData.skills];
                          newSkills[index] = {
                            ...newSkills[index],
                            proof: e.target.value,
                            validated: e.target.value.length > 10,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            skills: newSkills,
                          }));
                        }}
                        startContent={<LinkIcon className="h-4 w-4" />}
                      />
                      {skill.proof && skill.proof.length > 10 && (
                        <Chip color="success" size="sm" className="mt-2">
                          Validated
                        </Chip>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Professional Background & Validation
              </h2>
              <p className="text-default-600">
                Provide details with supporting evidence
              </p>
            </div>

            <Card className="p-4 border border-warning/20 bg-warning/5">
              <div className="flex items-start gap-3">
                <AlertTriangleIcon className="h-5 w-5 text-warning mt-1" />
                <div>
                  <h3 className="font-semibold text-warning">
                    Validation Required
                  </h3>
                  <p className="text-sm text-default-600">
                    All claims must be backed by proof to ensure resume
                    credibility
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <div>
                <Textarea
                  label="Top Achievement"
                  placeholder="Describe your biggest professional achievement with specific metrics and impact..."
                  minRows={4}
                  description="Be specific with numbers, timeframes, and measurable results"
                />
                <Input
                  className="mt-2"
                  placeholder="Proof of achievement (link, document, reference...)"
                  startContent={<ExternalLinkIcon className="h-4 w-4" />}
                />
              </div>

              <div>
                <Textarea
                  label="Key Project"
                  placeholder="Describe a significant project: problem, solution, technologies, results..."
                  minRows={4}
                />
                <Input
                  className="mt-2"
                  placeholder="Project proof (GitHub, live demo, case study...)"
                  startContent={<GithubIcon className="h-4 w-4" />}
                />
              </div>

              <Textarea
                label="Work Experience Summary"
                placeholder="Briefly describe your key work experiences, responsibilities, and measurable accomplishments..."
                minRows={6}
                description="Our AI will structure this into professional bullet points"
              />

              <Textarea
                label="Education Background"
                placeholder="List your educational qualifications, degrees, certifications..."
                minRows={3}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Ready to Generate Your Validated Resume
              </h2>
              <p className="text-default-600">
                Our AI will create a professional, proof-backed, ATS-optimized
                resume
              </p>
            </div>

            <Card>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <SparklesIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        AI-Powered Generation with Validation
                      </h3>
                      <p className="text-sm text-default-600">
                        Creates optimized content with proof-backed claims
                      </p>
                    </div>
                  </div>

                  <Divider />

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">What we'll generate:</h4>
                      <ul className="space-y-1 text-default-600">
                        <li>• Professional summary</li>
                        <li>• Validated achievements</li>
                        <li>• Proof-backed skills</li>
                        <li>• ATS-friendly formatting</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Validation status:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-success" />
                          <span className="text-sm">
                            Skills:{" "}
                            {formData.skills.filter((s) => s.validated).length}{" "}
                            validated
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-success" />
                          <span className="text-sm">
                            Personal info: Complete
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Button
              color="primary"
              size="lg"
              className="w-full"
              startContent={<WandIcon className="h-5 w-5" />}
              onPress={handleGenerateClick}
              isLoading={isGenerating}
              isDisabled={
                !formData.targetRole ||
                !formData.personalInfo.fullName ||
                isGenerating
              }
            >
              {isGenerating
                ? "Generating..."
                : "Generate My Validated Resume with AI"}
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-default-50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b  border-default-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              isIconOnly
              variant="light"
              onPress={onBack}
              startContent={<ArrowLeftIcon className="h-4 w-4" />}
            />
            <div>
              <h1 className="text-2xl font-bold">Create Resume with Forms</h1>
              <p className="text-default-600">
                Build a professional, validated, ATS-optimized resume
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    index <= currentStep
                      ? "bg-primary/10 text-primary"
                      : "bg-default-100 text-default-500"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      index < currentStep ? "bg-primary" : "bg-default-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardBody className="p-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-default-200">
              <Button
                variant="bordered"
                onPress={prevStep}
                isDisabled={currentStep === 0}
                startContent={<ArrowLeftIcon className="h-4 w-4" />}
              >
                Previous
              </Button>

              {currentStep < steps.length - 1 && (
                <Button
                  color="primary"
                  onPress={nextStep}
                  endContent={<ArrowRightIcon className="h-4 w-4" />}
                >
                  Next Step
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
