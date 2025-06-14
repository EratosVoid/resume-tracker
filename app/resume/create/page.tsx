"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Divider,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  SparklesIcon,
  UserIcon,
  BrainIcon,
  FileTextIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  WandIcon,
  CheckCircleIcon,
} from "lucide-react";

export default function ResumeCreatePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
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
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      onOpen();
    }, 3000);
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
                Tell us about your career goals
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Target Job Title"
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                value={formData.targetRole}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetRole: e.target.value,
                  }))
                }
                description="What role are you applying for?"
              />

              <Select
                label="Experience Level"
                placeholder="Select your experience level"
                selectedKeys={formData.experience ? [formData.experience] : []}
                onSelectionChange={(keys) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: Array.from(keys)[0],
                  }))
                }
              >
                {experienceLevels.map((level) => (
                  <SelectItem key={level.key} value={level.key}>
                    {level.label}
                  </SelectItem>
                ))}
              </Select>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Key Skills
                </label>
                <Input
                  placeholder="Type a skill and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      setFormData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, e.target.value.trim()],
                      }));
                      e.target.value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      color="primary"
                      variant="flat"
                      onClose={() => {
                        setFormData((prev) => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== index),
                        }));
                      }}
                    >
                      {skill}
                    </Chip>
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
                Professional Background
              </h2>
              <p className="text-default-600">
                Provide details about your experience
              </p>
            </div>

            <Textarea
              label="Work Experience Summary"
              placeholder="Briefly describe your key work experiences, achievements, and responsibilities..."
              minRows={6}
              description="Our AI will structure this into professional bullet points"
            />

            <Textarea
              label="Education Background"
              placeholder="List your educational qualifications, degrees, certifications..."
              minRows={3}
            />

            <Textarea
              label="Notable Projects"
              placeholder="Describe any significant projects, achievements, or contributions..."
              minRows={4}
            />
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
                Ready to Generate Your Resume
              </h2>
              <p className="text-default-600">
                Our AI will create a professional, ATS-optimized resume for you
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
                      <h3 className="font-semibold">AI-Powered Generation</h3>
                      <p className="text-sm text-default-600">
                        Creates optimized content and formatting
                      </p>
                    </div>
                  </div>

                  <Divider />

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">What we'll generate:</h4>
                      <ul className="space-y-1 text-default-600">
                        <li>• Professional summary</li>
                        <li>• Structured work experience</li>
                        <li>• Skills optimization</li>
                        <li>• ATS-friendly formatting</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Based on your input:</h4>
                      <ul className="space-y-1 text-default-600">
                        <li>
                          • Target role:{" "}
                          {formData.targetRole || "Not specified"}
                        </li>
                        <li>
                          • Experience: {formData.experience || "Not specified"}
                        </li>
                        <li>• Skills: {formData.skills.length} added</li>
                        <li>• Personal info: Complete</li>
                      </ul>
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
              onClick={handleGenerateResume}
              isDisabled={
                !formData.targetRole || !formData.personalInfo.fullName
              }
            >
              Generate My Resume with AI
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
      <div className="bg-white border-b border-default-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button
                isIconOnly
                variant="light"
                startContent={<ArrowLeftIcon className="h-4 w-4" />}
              />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Create Resume with AI</h1>
              <p className="text-default-600">
                Build a professional, ATS-optimized resume in minutes
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
            {isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                  <BrainIcon className="h-12 w-12 text-primary animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Generating Your Resume
                  </h2>
                  <p className="text-default-600 mb-6">
                    Our AI is crafting your professional resume...
                  </p>
                  <Progress
                    value={75}
                    color="primary"
                    className="max-w-md mx-auto"
                    showValueLabel={true}
                  />
                </div>
                <p className="text-sm text-default-500">
                  This may take a few moments
                </p>
              </motion.div>
            ) : (
              <>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-default-200">
                  <Button
                    variant="bordered"
                    onClick={prevStep}
                    isDisabled={currentStep === 0}
                    startContent={<ArrowLeftIcon className="h-4 w-4" />}
                  >
                    Previous
                  </Button>

                  {currentStep < steps.length - 1 && (
                    <Button
                      color="primary"
                      onClick={nextStep}
                      endContent={<ArrowRightIcon className="h-4 w-4" />}
                    >
                      Next Step
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  Resume Generated Successfully!
                </h2>
                <p className="text-default-600 text-sm">
                  Your AI-powered resume is ready
                </p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="space-y-6">
            <div className="text-center space-y-4">
              <div className="p-6 bg-success/5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  🎉 Your Resume is Ready!
                </h3>
                <p className="text-default-600">
                  We've created a professional, ATS-optimized resume tailored to
                  your target role.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardBody className="text-center p-4">
                    <h4 className="font-semibold mb-1">ATS Score</h4>
                    <div className="text-2xl font-bold text-success">92%</div>
                    <p className="text-sm text-default-600">
                      Excellent compatibility
                    </p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="text-center p-4">
                    <h4 className="font-semibold mb-1">Format</h4>
                    <div className="text-2xl font-bold text-primary">PDF</div>
                    <p className="text-sm text-default-600">
                      Professional layout
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                color="primary"
                className="flex-1"
                startContent={<FileTextIcon className="h-4 w-4" />}
              >
                Download Resume
              </Button>
              <Link href="/auth/register" className="flex-1">
                <Button
                  variant="bordered"
                  className="w-full"
                  startContent={<UserIcon className="h-4 w-4" />}
                >
                  Save & Create Account
                </Button>
              </Link>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
