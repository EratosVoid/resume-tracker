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
  Badge,
  Accordion,
  AccordionItem,
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
      fullName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/sarahjohnson",
      portfolio: "sarahjohnson.dev",
    },
    targetRole: "Senior Software Engineer",
    experience: "senior",
    skills: [
      {
        name: "React",
        proof:
          "Built 5+ production applications using React, including a fintech dashboard serving 10k+ users",
        validated: true,
      },
      {
        name: "Node.js",
        proof:
          "3 years experience building scalable APIs, deployed microservices handling 1M+ requests/day",
        validated: true,
      },
      {
        name: "TypeScript",
        proof:
          "Migrated legacy JavaScript codebase to TypeScript, reducing bugs by 40%",
        validated: true,
      },
      {
        name: "AWS",
        proof:
          "AWS Solutions Architect Associate certified, managed infrastructure for 20+ applications",
        validated: true,
      },
    ],
    workExperience: [
      {
        company: "TechCorp Inc.",
        title: "Software Engineer",
        startDate: "Jan 2022",
        endDate: "Present",
        description:
          "Lead development of customer-facing web applications using React and Node.js. Collaborate with cross-functional teams to deliver high-quality software solutions.",
        achievements: [
          "Increased application performance by 35% through code optimization",
          "Led migration to microservices architecture",
          "Mentored 3 junior developers",
          "Reduced deployment time from 2 hours to 15 minutes",
        ],
      },
      {
        company: "StartupXYZ",
        title: "Frontend Developer",
        startDate: "Jun 2020",
        endDate: "Dec 2021",
        description:
          "Developed responsive web applications and collaborated with designers to implement pixel-perfect UI components.",
        achievements: [
          "Built component library used across 5 products",
          "Improved mobile user experience, increasing engagement by 25%",
          "Implemented automated testing, reducing bugs by 50%",
        ],
      },
    ],
    education: [
      {
        school: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        graduationYear: "2020",
        gpa: "3.8/4.0",
        honors: "Magna Cum Laude",
      },
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description:
          "Full-stack e-commerce application with payment processing, inventory management, and admin dashboard. Built with React, Node.js, and PostgreSQL.",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe API", "AWS"],
        link: "https://ecommerce-demo.com",
        github: "https://github.com/sarahjohnson/ecommerce-platform",
        achievements: [
          "Handles 1000+ concurrent users",
          "99.9% uptime over 6 months",
          "Integrated with 3 payment providers",
          "Featured on Product Hunt",
        ],
      },
      {
        name: "Task Management App",
        description:
          "Collaborative task management application with real-time updates, team collaboration features, and advanced analytics dashboard.",
        technologies: ["Vue.js", "Express.js", "MongoDB", "Socket.io"],
        link: "https://taskmaster-app.com",
        github: "https://github.com/sarahjohnson/task-manager",
        achievements: [
          "500+ active users within first month",
          "Real-time collaboration for teams up to 50 members",
          "Mobile-responsive design",
        ],
      },
    ],
    achievements: [
      {
        title: "Employee of the Year",
        description:
          "Recognized for outstanding performance and leadership in delivering critical projects ahead of schedule while maintaining high code quality standards.",
        date: "Dec 2023",
        proof: "https://techcorp.com/awards/2023",
      },
      {
        title: "Open Source Contributor",
        description:
          "Active contributor to popular open-source projects with over 100 merged pull requests and 500+ GitHub stars across personal repositories.",
        date: "Ongoing",
        proof: "https://github.com/sarahjohnson",
      },
      {
        title: "Tech Conference Speaker",
        description:
          "Delivered presentation on 'Modern React Patterns' at ReactConf 2023, attended by 500+ developers.",
        date: "Oct 2023",
        proof: "https://reactconf.com/speakers/sarah-johnson",
      },
    ],
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
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Build Your Professional Story
              </h2>
              <p className="text-default-600 text-lg">
                Add your experiences, education, projects, and achievements
              </p>
            </div>

            <div className="grid gap-6">
              <Accordion
                variant="splitted"
                selectionMode="multiple"
                defaultExpandedKeys={["experience"]}
              >
                {/* Work Experience Section */}
                <AccordionItem
                  key="experience"
                  aria-label="Work Experience"
                  title={
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BrainIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Work Experience
                        </h3>
                        <p className="text-sm text-default-500">
                          {formData.workExperience.length}{" "}
                          {formData.workExperience.length === 1
                            ? "position"
                            : "positions"}{" "}
                          added
                        </p>
                      </div>
                    </div>
                  }
                  className="bg-gradient-to-r from-primary/5 to-transparent"
                >
                  <div className="space-y-4 p-4">
                    {formData.workExperience.map((exp, index) => (
                      <Card
                        key={index}
                        className="p-4 border-l-4 border-l-primary"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-lg">
                              Work Experience #{index + 1}
                            </h4>
                            <Button
                              size="sm"
                              color="danger"
                              variant="light"
                              onPress={() => {
                                const newExp = formData.workExperience.filter(
                                  (_, i) => i !== index
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  workExperience: newExp,
                                }));
                              }}
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <Input
                              label="Job Title"
                              placeholder="e.g., Software Engineer"
                              value={exp.title}
                              onChange={(e) => {
                                const newExp = [...formData.workExperience];
                                newExp[index] = {
                                  ...newExp[index],
                                  title: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  workExperience: newExp,
                                }));
                              }}
                            />
                            <Input
                              label="Company"
                              placeholder="e.g., Google"
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...formData.workExperience];
                                newExp[index] = {
                                  ...newExp[index],
                                  company: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  workExperience: newExp,
                                }));
                              }}
                            />
                            <Input
                              label="Start Date"
                              placeholder="e.g., Jan 2022"
                              value={exp.startDate}
                              onChange={(e) => {
                                const newExp = [...formData.workExperience];
                                newExp[index] = {
                                  ...newExp[index],
                                  startDate: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  workExperience: newExp,
                                }));
                              }}
                            />
                            <Input
                              label="End Date"
                              placeholder="e.g., Present or Dec 2023"
                              value={exp.endDate}
                              onChange={(e) => {
                                const newExp = [...formData.workExperience];
                                newExp[index] = {
                                  ...newExp[index],
                                  endDate: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  workExperience: newExp,
                                }));
                              }}
                            />
                          </div>

                          <Textarea
                            label="Job Description"
                            placeholder="Describe your role and responsibilities..."
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...formData.workExperience];
                              newExp[index] = {
                                ...newExp[index],
                                description: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                workExperience: newExp,
                              }));
                            }}
                            minRows={3}
                          />

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Key Achievements (press Enter to add)
                            </label>
                            <Input
                              placeholder="e.g., Increased sales by 20%"
                              onKeyPress={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (e.key === "Enter" && target.value.trim()) {
                                  const newExp = [...formData.workExperience];
                                  newExp[index] = {
                                    ...newExp[index],
                                    achievements: [
                                      ...newExp[index].achievements,
                                      target.value.trim(),
                                    ],
                                  };
                                  setFormData((prev) => ({
                                    ...prev,
                                    workExperience: newExp,
                                  }));
                                  target.value = "";
                                }
                              }}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                              {exp.achievements.map((achievement, achIndex) => (
                                <Chip
                                  key={achIndex}
                                  onClose={() => {
                                    const newExp = [...formData.workExperience];
                                    newExp[index] = {
                                      ...newExp[index],
                                      achievements: newExp[
                                        index
                                      ].achievements.filter(
                                        (_, i) => i !== achIndex
                                      ),
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      workExperience: newExp,
                                    }));
                                  }}
                                  variant="flat"
                                  color="primary"
                                >
                                  {achievement}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      color="primary"
                      variant="bordered"
                      className="w-full"
                      onPress={() => {
                        const newExp: WorkExperience = {
                          company: "",
                          title: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                          achievements: [],
                        };
                        setFormData((prev) => ({
                          ...prev,
                          workExperience: [...prev.workExperience, newExp],
                        }));
                      }}
                    >
                      + Add Work Experience
                    </Button>
                  </div>
                </AccordionItem>

                {/* Education Section */}
                <AccordionItem
                  key="education"
                  aria-label="Education"
                  title={
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <FileTextIcon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Education</h3>
                        <p className="text-sm text-default-500">
                          {formData.education.length}{" "}
                          {formData.education.length === 1
                            ? "degree"
                            : "degrees"}{" "}
                          added
                        </p>
                      </div>
                    </div>
                  }
                  className="bg-gradient-to-r from-secondary/5 to-transparent"
                >
                  <div className="space-y-4 p-4">
                    {formData.education.map((edu, index) => (
                      <Card
                        key={index}
                        className="p-4 border-l-4 border-l-secondary"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-lg">
                              Education #{index + 1}
                            </h4>
                            <Button
                              size="sm"
                              color="danger"
                              variant="light"
                              onPress={() => {
                                const newEdu = formData.education.filter(
                                  (_, i) => i !== index
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  education: newEdu,
                                }));
                              }}
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <Input
                              label="School/University"
                              placeholder="e.g., Stanford University"
                              value={edu.school}
                              onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[index] = {
                                  ...newEdu[index],
                                  school: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  education: newEdu,
                                }));
                              }}
                            />
                            <Input
                              label="Degree"
                              placeholder="e.g., Bachelor of Science"
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[index] = {
                                  ...newEdu[index],
                                  degree: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  education: newEdu,
                                }));
                              }}
                            />
                            <Input
                              label="Field of Study"
                              placeholder="e.g., Computer Science"
                              value={edu.field}
                              onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[index] = {
                                  ...newEdu[index],
                                  field: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  education: newEdu,
                                }));
                              }}
                            />
                            <Input
                              label="Graduation Year"
                              placeholder="e.g., 2023"
                              value={edu.graduationYear}
                              onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[index] = {
                                  ...newEdu[index],
                                  graduationYear: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  education: newEdu,
                                }));
                              }}
                            />
                            <Input
                              label="GPA (optional)"
                              placeholder="e.g., 3.8/4.0"
                              value={edu.gpa || ""}
                              onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[index] = {
                                  ...newEdu[index],
                                  gpa: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  education: newEdu,
                                }));
                              }}
                            />
                            <Input
                              label="Honors (optional)"
                              placeholder="e.g., Magna Cum Laude"
                              value={edu.honors || ""}
                              onChange={(e) => {
                                const newEdu = [...formData.education];
                                newEdu[index] = {
                                  ...newEdu[index],
                                  honors: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  education: newEdu,
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      color="secondary"
                      variant="bordered"
                      className="w-full"
                      onPress={() => {
                        const newEdu: Education = {
                          school: "",
                          degree: "",
                          field: "",
                          graduationYear: "",
                          gpa: "",
                          honors: "",
                        };
                        setFormData((prev) => ({
                          ...prev,
                          education: [...prev.education, newEdu],
                        }));
                      }}
                    >
                      + Add Education
                    </Button>
                  </div>
                </AccordionItem>

                {/* Projects Section */}
                <AccordionItem
                  key="projects"
                  aria-label="Projects"
                  title={
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <GithubIcon className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Projects</h3>
                        <p className="text-sm text-default-500">
                          {formData.projects.length}{" "}
                          {formData.projects.length === 1
                            ? "project"
                            : "projects"}{" "}
                          added
                        </p>
                      </div>
                    </div>
                  }
                  className="bg-gradient-to-r from-success/5 to-transparent"
                >
                  <div className="space-y-4 p-4">
                    {formData.projects.map((project, index) => (
                      <Card
                        key={index}
                        className="p-4 border-l-4 border-l-success"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-lg">
                              Project #{index + 1}
                            </h4>
                            <Button
                              size="sm"
                              color="danger"
                              variant="light"
                              onPress={() => {
                                const newProjects = formData.projects.filter(
                                  (_, i) => i !== index
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  projects: newProjects,
                                }));
                              }}
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <Input
                              label="Project Name"
                              placeholder="e.g., E-commerce Web App"
                              value={project.name}
                              onChange={(e) => {
                                const newProjects = [...formData.projects];
                                newProjects[index] = {
                                  ...newProjects[index],
                                  name: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  projects: newProjects,
                                }));
                              }}
                            />
                            <Input
                              label="Live Demo URL (optional)"
                              placeholder="https://myproject.com"
                              value={project.link || ""}
                              onChange={(e) => {
                                const newProjects = [...formData.projects];
                                newProjects[index] = {
                                  ...newProjects[index],
                                  link: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  projects: newProjects,
                                }));
                              }}
                            />
                          </div>

                          <Textarea
                            label="Project Description"
                            placeholder="Describe what the project does and your role..."
                            value={project.description}
                            onChange={(e) => {
                              const newProjects = [...formData.projects];
                              newProjects[index] = {
                                ...newProjects[index],
                                description: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                projects: newProjects,
                              }));
                            }}
                            minRows={3}
                          />

                          <Input
                            label="GitHub URL (optional)"
                            placeholder="https://github.com/username/project"
                            value={project.github || ""}
                            onChange={(e) => {
                              const newProjects = [...formData.projects];
                              newProjects[index] = {
                                ...newProjects[index],
                                github: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                projects: newProjects,
                              }));
                            }}
                          />

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Technologies Used (press Enter to add)
                            </label>
                            <Input
                              placeholder="e.g., React, Node.js, MongoDB"
                              onKeyPress={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (e.key === "Enter" && target.value.trim()) {
                                  const newProjects = [...formData.projects];
                                  newProjects[index] = {
                                    ...newProjects[index],
                                    technologies: [
                                      ...newProjects[index].technologies,
                                      target.value.trim(),
                                    ],
                                  };
                                  setFormData((prev) => ({
                                    ...prev,
                                    projects: newProjects,
                                  }));
                                  target.value = "";
                                }
                              }}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.technologies.map((tech, techIndex) => (
                                <Chip
                                  key={techIndex}
                                  onClose={() => {
                                    const newProjects = [...formData.projects];
                                    newProjects[index] = {
                                      ...newProjects[index],
                                      technologies: newProjects[
                                        index
                                      ].technologies.filter(
                                        (_, i) => i !== techIndex
                                      ),
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      projects: newProjects,
                                    }));
                                  }}
                                  variant="flat"
                                  color="success"
                                >
                                  {tech}
                                </Chip>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Key Results/Achievements (press Enter to add)
                            </label>
                            <Input
                              placeholder="e.g., Achieved 99% uptime, 500+ users"
                              onKeyPress={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (e.key === "Enter" && target.value.trim()) {
                                  const newProjects = [...formData.projects];
                                  newProjects[index] = {
                                    ...newProjects[index],
                                    achievements: [
                                      ...newProjects[index].achievements,
                                      target.value.trim(),
                                    ],
                                  };
                                  setFormData((prev) => ({
                                    ...prev,
                                    projects: newProjects,
                                  }));
                                  target.value = "";
                                }
                              }}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.achievements.map(
                                (achievement, achIndex) => (
                                  <Chip
                                    key={achIndex}
                                    onClose={() => {
                                      const newProjects = [
                                        ...formData.projects,
                                      ];
                                      newProjects[index] = {
                                        ...newProjects[index],
                                        achievements: newProjects[
                                          index
                                        ].achievements.filter(
                                          (_, i) => i !== achIndex
                                        ),
                                      };
                                      setFormData((prev) => ({
                                        ...prev,
                                        projects: newProjects,
                                      }));
                                    }}
                                    variant="flat"
                                    color="primary"
                                  >
                                    {achievement}
                                  </Chip>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      color="success"
                      variant="bordered"
                      className="w-full"
                      onPress={() => {
                        const newProject: Project = {
                          name: "",
                          description: "",
                          technologies: [],
                          link: "",
                          github: "",
                          achievements: [],
                        };
                        setFormData((prev) => ({
                          ...prev,
                          projects: [...prev.projects, newProject],
                        }));
                      }}
                    >
                      + Add Project
                    </Button>
                  </div>
                </AccordionItem>

                {/* Achievements Section */}
                <AccordionItem
                  key="achievements"
                  aria-label="Achievements"
                  title={
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-warning/10 rounded-lg">
                        <SparklesIcon className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Achievements & Awards
                        </h3>
                        <p className="text-sm text-default-500">
                          {formData.achievements.length}{" "}
                          {formData.achievements.length === 1
                            ? "achievement"
                            : "achievements"}{" "}
                          added
                        </p>
                      </div>
                    </div>
                  }
                  className="bg-gradient-to-r from-warning/5 to-transparent"
                >
                  <div className="space-y-4 p-4">
                    {formData.achievements.map((achievement, index) => (
                      <Card
                        key={index}
                        className="p-4 border-l-4 border-l-warning"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-lg">
                              Achievement #{index + 1}
                            </h4>
                            <Button
                              size="sm"
                              color="danger"
                              variant="light"
                              onPress={() => {
                                const newAchievements =
                                  formData.achievements.filter(
                                    (_, i) => i !== index
                                  );
                                setFormData((prev) => ({
                                  ...prev,
                                  achievements: newAchievements,
                                }));
                              }}
                            >
                              Remove
                            </Button>
                          </div>

                          <Input
                            label="Achievement Title"
                            placeholder="e.g., Employee of the Year"
                            value={achievement.title}
                            onChange={(e) => {
                              const newAchievements = [
                                ...formData.achievements,
                              ];
                              newAchievements[index] = {
                                ...newAchievements[index],
                                title: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                achievements: newAchievements,
                              }));
                            }}
                          />

                          <Textarea
                            label="Description"
                            placeholder="Describe the achievement and its significance..."
                            value={achievement.description}
                            onChange={(e) => {
                              const newAchievements = [
                                ...formData.achievements,
                              ];
                              newAchievements[index] = {
                                ...newAchievements[index],
                                description: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                achievements: newAchievements,
                              }));
                            }}
                            minRows={3}
                          />

                          <div className="grid md:grid-cols-2 gap-4">
                            <Input
                              label="Date"
                              placeholder="e.g., Jan 2023"
                              value={achievement.date}
                              onChange={(e) => {
                                const newAchievements = [
                                  ...formData.achievements,
                                ];
                                newAchievements[index] = {
                                  ...newAchievements[index],
                                  date: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  achievements: newAchievements,
                                }));
                              }}
                            />
                            <Input
                              label="Proof/Link (optional)"
                              placeholder="Certificate URL or reference"
                              value={achievement.proof || ""}
                              onChange={(e) => {
                                const newAchievements = [
                                  ...formData.achievements,
                                ];
                                newAchievements[index] = {
                                  ...newAchievements[index],
                                  proof: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  achievements: newAchievements,
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      color="warning"
                      variant="bordered"
                      className="w-full"
                      onPress={() => {
                        const newAchievement: Achievement = {
                          title: "",
                          description: "",
                          date: "",
                          proof: "",
                        };
                        setFormData((prev) => ({
                          ...prev,
                          achievements: [...prev.achievements, newAchievement],
                        }));
                      }}
                    >
                      + Add Achievement
                    </Button>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
                Ready to Generate Your Professional Resume
              </h2>
              <p className="text-default-600 text-lg max-w-2xl mx-auto">
                Our AI will create a professional, ATS-optimized resume using
                all the information you've provided
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <SparklesIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-primary">
                        AI-Powered Generation
                      </h3>
                      <p className="text-sm text-default-600">
                        Advanced resume optimization
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-success" />
                      <span>Professional summary tailored to your role</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-success" />
                      <span>Optimized work experience descriptions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-success" />
                      <span>Skills section with relevance ranking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-success" />
                      <span>ATS-friendly formatting and keywords</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-success/20 rounded-xl">
                      <FileTextIcon className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-success">
                        Your Content Summary
                      </h3>
                      <p className="text-sm text-default-600">
                        What we'll include
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Work Experience</span>
                      <Badge color="success" variant="flat">
                        {formData.workExperience.length}{" "}
                        {formData.workExperience.length === 1
                          ? "position"
                          : "positions"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Education</span>
                      <Badge color="secondary" variant="flat">
                        {formData.education.length}{" "}
                        {formData.education.length === 1 ? "degree" : "degrees"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Projects</span>
                      <Badge color="primary" variant="flat">
                        {formData.projects.length}{" "}
                        {formData.projects.length === 1
                          ? "project"
                          : "projects"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Skills</span>
                      <Badge color="warning" variant="flat">
                        {formData.skills.length} skills
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Achievements</span>
                      <Badge color="danger" variant="flat">
                        {formData.achievements.length}{" "}
                        {formData.achievements.length === 1
                          ? "achievement"
                          : "achievements"}
                      </Badge>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                color="primary"
                size="lg"
                className="w-full h-16 text-lg bg-gradient-to-r from-primary via-secondary to-success hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500"
                startContent={<WandIcon className="h-6 w-6" />}
                onPress={handleGenerateClick}
                isLoading={isGenerating}
                isDisabled={
                  !formData.targetRole ||
                  !formData.personalInfo.fullName ||
                  isGenerating
                }
              >
                {isGenerating
                  ? "Generating Your Resume..."
                  : "🚀 Generate My Professional Resume with AI"}
              </Button>
            </motion.div>

            <div className="text-center text-sm text-default-500">
              <p>✨ This usually takes 10-15 seconds to complete</p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-default-50 via-primary/5 to-secondary/5">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-default-200/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              isIconOnly
              variant="light"
              onPress={onBack}
              className="hover:bg-primary/10 transition-colors"
              startContent={<ArrowLeftIcon className="h-4 w-4" />}
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Create Resume with Forms
              </h1>
              <p className="text-default-600 text-lg">
                Build a professional, validated, ATS-optimized resume
              </p>
            </div>
          </div>

          {/* Enhanced Progress Steps */}
          <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    index <= currentStep
                      ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                      : "bg-default-100 text-default-500 hover:bg-default-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`p-1 rounded-lg ${
                      index <= currentStep ? "bg-white/20" : "bg-default-200"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {step.title}
                  </span>
                  {index <= currentStep && (
                    <CheckCircleIcon className="h-4 w-4 text-white/80" />
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-1 mx-3 rounded-full transition-colors duration-300 ${
                      index < currentStep
                        ? "bg-gradient-to-r from-primary to-secondary"
                        : "bg-default-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-0 shadow-2xl shadow-primary/10">
            <CardBody className="p-8 md:p-12">
              {renderStepContent()}

              {/* Enhanced Navigation Buttons */}
              <motion.div
                className="flex justify-between items-center mt-12 pt-8 border-t border-default-200/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="bordered"
                  size="lg"
                  onPress={prevStep}
                  isDisabled={currentStep === 0}
                  startContent={<ArrowLeftIcon className="h-5 w-5" />}
                  className="hover:bg-primary/5 transition-all duration-300 disabled:opacity-50"
                >
                  Previous Step
                </Button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-default-500 font-medium">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <div className="flex gap-1">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index <= currentStep
                            ? "bg-primary scale-110"
                            : "bg-default-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {currentStep < steps.length - 1 && (
                  <Button
                    color="primary"
                    size="lg"
                    onPress={nextStep}
                    endContent={<ArrowRightIcon className="h-5 w-5" />}
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  >
                    {currentStep === steps.length - 2
                      ? "Review & Generate"
                      : "Next Step"}
                  </Button>
                )}
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
