"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Link,
  Tabs,
  Tab,
  Chip,
  Spinner,
} from "@heroui/react";
import { toast } from "react-hot-toast";
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  BuildingIcon,
  SparklesIcon,
} from "lucide-react";

// Loading fallback component
function RegisterPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-default-50">
      <div className="max-w-md w-full">
        <Card>
          <CardBody className="flex items-center justify-center py-12">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-default-600">
              Loading registration form...
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function RegisterPageContent() {
  const [userType, setUserType] = useState("applicant");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    role: "applicant",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set user type from URL parameter
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "hr") {
      setUserType("hr");
      setFormData((prev) => ({ ...prev, role: "hr" }));
    }
  }, [searchParams]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleUserTypeChange = (type: string) => {
    setUserType(type);
    setFormData((prev) => ({
      ...prev,
      role: type,
      company: type === "applicant" ? "" : prev.company,
      password: type === "applicant" ? "" : prev.password,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data based on user type
      const submitData: any = {
        name: formData.name,
        email: formData.email,
        role: userType,
      };

      // Only include password for HR users
      if (userType === "hr") {
        if (!formData.password || formData.password.length < 6) {
          toast.error(
            "Password must be at least 6 characters for recruiter accounts"
          );
          setIsLoading(false);
          return;
        }
        submitData.password = formData.password;

        if (!formData.company || formData.company.trim().length < 2) {
          toast.error("Company name is required for recruiter accounts");
          setIsLoading(false);
          return;
        }
        submitData.company = formData.company;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (userType === "applicant") {
        toast.success(
          "Account created successfully! You can now start creating resumes."
        );
        router.push("/resume/create");
      } else {
        toast.success("Account created successfully! Please sign in.");
        router.push("/auth/login?redirect=dashboard");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-default-50">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="flex flex-col items-center pb-6">
            <div className="flex items-center gap-2 mb-3">
              <SparklesIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Join Screener.ai</h1>
            </div>
            <p className="text-default-600 text-center">
              Choose your account type to get started
            </p>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* User Type Selection */}
            <Tabs
              selectedKey={userType}
              onSelectionChange={(key) => handleUserTypeChange(key as string)}
              className="w-full"
              classNames={{
                tabList:
                  "grid w-full grid-cols-2 gap-0 relative rounded-lg bg-default-100 p-1",
                cursor: "w-full bg-white shadow-sm",
                tab: "w-full px-0 h-12",
                tabContent:
                  "group-data-[selected=true]:text-foreground text-default-600",
              }}
            >
              <Tab
                key="applicant"
                title={
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="font-medium">Job Seeker</span>
                  </div>
                }
              />
              <Tab
                key="hr"
                title={
                  <div className="flex items-center space-x-2">
                    <BuildingIcon className="h-4 w-4" />
                    <span className="font-medium">Recruiter</span>
                  </div>
                }
              />
            </Tabs>

            {/* Account Type Info */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              {userType === "applicant" ? (
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    Job Seeker Account
                  </h3>
                  <ul className="text-sm text-default-600 space-y-1">
                    <li>• Create AI-powered resumes</li>
                    <li>• Get ATS compatibility scores</li>
                    <li>• Track application history</li>
                    <li>• Access resume improvement tips</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-secondary mb-2">
                    Recruiter Account
                  </h3>
                  <ul className="text-sm text-default-600 space-y-1">
                    <li>• Post job openings</li>
                    <li>• AI-powered candidate matching</li>
                    <li>• Resume analysis dashboard</li>
                    <li>• Application tracking system</li>
                  </ul>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange("name")}
                isRequired
              />

              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange("email")}
                isRequired
              />

              {userType === "hr" && (
                <>
                  <Input
                    type="text"
                    label="Company Name"
                    placeholder="Enter your company name"
                    value={formData.company}
                    onChange={handleChange("company")}
                    isRequired
                  />
                  <Input
                    label="Password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeOffIcon className="h-4 w-4 text-default-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-default-400" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    isRequired
                  />
                </>
              )}

              <Button
                type="submit"
                color={userType === "hr" ? "secondary" : "primary"}
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                {userType === "hr"
                  ? "Create Recruiter Account"
                  : "Create Job Seeker Account"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-default-600 text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Quick Access Links */}
            <div className="pt-4 border-t border-default-200">
              <p className="text-xs text-default-500 text-center mb-3">
                Or try without an account:
              </p>
              <div className="flex gap-2">
                <Link href="/resume/upload" className="flex-1">
                  <Button
                    variant="bordered"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Upload & Score Resume
                  </Button>
                </Link>
                <Link href="/jobs" className="flex-1">
                  <Button
                    variant="bordered"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterPageSkeleton />}>
      <RegisterPageContent />
    </Suspense>
  );
}
