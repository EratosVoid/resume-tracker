"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
  Button,
  Chip,
  Divider,
} from "@heroui/react";
import {
  BriefcaseIcon,
  MapPinIcon,
  DollarSignIcon,
  CalendarIcon,
  TagIcon,
  FileTextIcon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import JobAiChat from "@/components/job-ai-chat";

const experienceLevels = [
  { key: "entry", label: "Entry Level" },
  { key: "mid", label: "Mid Level" },
  { key: "senior", label: "Senior Level" },
  { key: "executive", label: "Executive" },
];

const employmentTypes = [
  { key: "full-time", label: "Full Time" },
  { key: "part-time", label: "Part Time" },
  { key: "contract", label: "Contract" },
  { key: "internship", label: "Internship" },
  { key: "freelance", label: "Freelance" },
];

const currencies = [
  { key: "USD", label: "USD ($)" },
  { key: "EUR", label: "EUR (€)" },
  { key: "GBP", label: "GBP (£)" },
  { key: "INR", label: "INR (₹)" },
];

interface JobFormData {
  title: string;
  description: string;
  location: string;
  experienceLevel: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  skills: string[];
  requirements: string[];
  benefits: string[];
  deadline: string;
  isPublic: boolean;
  status: string;
}

export default function NewJobPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    location: "",
    experienceLevel: "",
    employmentType: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    skills: [],
    requirements: [],
    benefits: [],
    deadline: "",
    isPublic: true,
    status: "active",
  });

  const [skillInput, setSkillInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const handleInputChange =
    (field: keyof JobFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSelectChange = (field: keyof JobFormData) => (keys: any) => {
    const selected = Array.from(keys)[0] as string;
    setFormData((prev) => ({
      ...prev,
      [field]: selected,
    }));
  };

  const handleSwitchChange =
    (field: keyof JobFormData) => (checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        [field]: checked,
      }));
    };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addRequirement = () => {
    if (
      requirementInput.trim() &&
      !formData.requirements.includes(requirementInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput("");
    }
  };

  const removeRequirement = (requirement: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((r) => r !== requirement),
    }));
  };

  const addBenefit = () => {
    if (
      benefitInput.trim() &&
      !formData.benefits.includes(benefitInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((b) => b !== benefit),
    }));
  };

  const handleAiDataGenerated = (aiData: JobFormData) => {
    setFormData(aiData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        salary:
          formData.salaryMin || formData.salaryMax
            ? {
                min: formData.salaryMin
                  ? parseInt(formData.salaryMin)
                  : undefined,
                max: formData.salaryMax
                  ? parseInt(formData.salaryMax)
                  : undefined,
                currency: formData.salaryCurrency,
              }
            : undefined,
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : undefined,
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create job");
      }

      toast.success("Job posted successfully!");
      router.push("/dashboard/jobs");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BriefcaseIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Post New Job</h1>
              <p className="text-default-600">
                Create a new job posting for your company
              </p>
            </div>
          </div>
          <Button
            color="secondary"
            variant="flat"
            onClick={() => setShowAiChat(true)}
            startContent={<SparklesIcon className="h-4 w-4" />}
          >
            Fill with AI
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Job Title"
                placeholder="e.g. Senior Software Engineer"
                value={formData.title}
                onChange={handleInputChange("title")}
                isRequired
                startContent={
                  <BriefcaseIcon className="h-4 w-4 text-default-400" />
                }
              />

              <Textarea
                label="Job Description"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={formData.description}
                onChange={handleInputChange("description")}
                minRows={6}
                isRequired
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Location"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={handleInputChange("location")}
                  startContent={
                    <MapPinIcon className="h-4 w-4 text-default-400" />
                  }
                />

                <Input
                  type="date"
                  label="Application Deadline"
                  value={formData.deadline}
                  onChange={handleInputChange("deadline")}
                  startContent={
                    <CalendarIcon className="h-4 w-4 text-default-400" />
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Experience Level"
                  placeholder="Select experience level"
                  selectedKeys={
                    formData.experienceLevel ? [formData.experienceLevel] : []
                  }
                  onSelectionChange={handleSelectChange("experienceLevel")}
                >
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.key}>{level.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Employment Type"
                  placeholder="Select employment type"
                  selectedKeys={
                    formData.employmentType ? [formData.employmentType] : []
                  }
                  onSelectionChange={handleSelectChange("employmentType")}
                >
                  {employmentTypes.map((type) => (
                    <SelectItem key={type.key}>{type.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </CardBody>
          </Card>

          {/* Salary Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Salary Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="Minimum Salary"
                  placeholder="50000"
                  value={formData.salaryMin}
                  onChange={handleInputChange("salaryMin")}
                  startContent={
                    <DollarSignIcon className="h-4 w-4 text-default-400" />
                  }
                />

                <Input
                  type="number"
                  label="Maximum Salary"
                  placeholder="80000"
                  value={formData.salaryMax}
                  onChange={handleInputChange("salaryMax")}
                  startContent={
                    <DollarSignIcon className="h-4 w-4 text-default-400" />
                  }
                />

                <Select
                  label="Currency"
                  selectedKeys={[formData.salaryCurrency]}
                  onSelectionChange={handleSelectChange("salaryCurrency")}
                >
                  {currencies.map((currency) => (
                    <SelectItem key={currency.key}>{currency.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </CardBody>
          </Card>

          {/* Skills & Requirements */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Skills & Requirements</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Skills */}
              <div>
                <div className="flex gap-2 mb-3">
                  <Input
                    label="Required Skills"
                    placeholder="Add a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    startContent={
                      <TagIcon className="h-4 w-4 text-default-400" />
                    }
                  />
                  <Button onClick={addSkill} variant="flat">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      onClose={() => removeSkill(skill)}
                      variant="flat"
                      color="primary"
                    >
                      {skill}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <div className="flex gap-2 mb-3">
                  <Input
                    label="Requirements"
                    placeholder="Add a requirement and press Enter"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addRequirement())
                    }
                    startContent={
                      <FileTextIcon className="h-4 w-4 text-default-400" />
                    }
                  />
                  <Button onClick={addRequirement} variant="flat">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((requirement, index) => (
                    <Chip
                      key={index}
                      onClose={() => removeRequirement(requirement)}
                      variant="flat"
                      color="secondary"
                    >
                      {requirement}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex gap-2 mb-3">
                  <Input
                    label="Benefits"
                    placeholder="Add a benefit and press Enter"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addBenefit())
                    }
                    startContent={
                      <TagIcon className="h-4 w-4 text-default-400" />
                    }
                  />
                  <Button onClick={addBenefit} variant="flat">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <Chip
                      key={index}
                      onClose={() => removeBenefit(benefit)}
                      variant="flat"
                      color="success"
                    >
                      {benefit}
                    </Chip>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Visibility & Status */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Visibility & Status</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formData.isPublic ? (
                    <EyeIcon className="h-5 w-5 text-success" />
                  ) : (
                    <EyeOffIcon className="h-5 w-5 text-warning" />
                  )}
                  <div>
                    <p className="font-medium">Public Job Posting</p>
                    <p className="text-sm text-default-600">
                      {formData.isPublic
                        ? "Job will be visible to all candidates on the public jobs page"
                        : "Job will only be accessible via direct link sharing"}
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={formData.isPublic}
                  onValueChange={handleSwitchChange("isPublic")}
                />
              </div>

              <Divider />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Job Status</p>
                  <p className="text-sm text-default-600">
                    Active jobs accept applications immediately
                  </p>
                </div>
                <Select
                  className="w-48"
                  selectedKeys={[formData.status]}
                  onSelectionChange={handleSelectChange("status")}
                >
                  <SelectItem key="active">Active</SelectItem>
                  <SelectItem key="paused">Paused</SelectItem>
                </Select>
              </div>
            </CardBody>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="flat" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              isDisabled={!formData.title || !formData.description}
            >
              Post Job
            </Button>
          </div>
        </form>

        {/* AI Chat */}
        <JobAiChat
          isOpen={showAiChat}
          onClose={() => setShowAiChat(false)}
          onDataGenerated={handleAiDataGenerated}
        />
      </div>
    </div>
  );
}
