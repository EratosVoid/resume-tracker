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
  Divider,
} from "@heroui/react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  BuildingIcon,
  SparklesIcon,
  BrainIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  MailIcon,
  LockIcon,
  UserPlusIcon,
  TrendingUpIcon,
  TargetIcon,
  ZapIcon,
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

      // Password is required for all users
      if (!formData.password || formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }
      submitData.password = formData.password;

      // Company name only required for HR users
      if (userType === "hr") {
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
    <div className="min-h-screen h-screen relative max-h-screen flex">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-default-50"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>

      <div className="relative min-h-screen flex w-full">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md"
          >
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="p-3 bg-primary/10 rounded-xl mr-4">
                <BrainIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Screener.ai
                </h1>
                <p className="text-sm text-default-600">
                  AI-Powered Resume Intelligence
                </p>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-default-900">
                Start Your Journey!
              </h2>
              <p className="text-lg text-default-600">
                Join thousands of professionals who've transformed their career
                or hiring process with our AI-powered platform.
              </p>

              {/* Benefits by User Type */}
              <div className="space-y-4">
                {userType === "applicant" ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ZapIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          5x Faster Resume Creation
                        </h3>
                        <p className="text-sm text-default-600">
                          AI-powered resume building and optimization
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <TargetIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">95% ATS Success Rate</h3>
                        <p className="text-sm text-default-600">
                          Instant scoring with detailed improvement tips
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <TrendingUpIcon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">80% Faster Screening</h3>
                        <p className="text-sm text-default-600">
                          Reduce screening time with automated analysis
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <TargetIcon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">3x Better Matches</h3>
                        <p className="text-sm text-default-600">
                          AI-powered candidate matching and scoring
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 pt-4">
                <Chip color="primary" variant="flat" size="sm">
                  50K+ Users
                </Chip>
                <Chip color="secondary" variant="flat" size="sm">
                  Enterprise Ready
                </Chip>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md w-full"
          >
            {/* Back to Home */}
            <div className="mb-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-default-600 hover:text-primary transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>

            <Card className="border border-default-200 shadow-xl backdrop-blur-sm bg-background/80">
              <CardHeader className="flex flex-col items-center pb-6 pt-8">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <UserPlusIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Join Screener.ai</h1>
                <p className="text-default-600 text-center">
                  Choose your account type to get started
                </p>
              </CardHeader>

              <CardBody className="px-8 pb-8 space-y-6">
                {/* User Type Selection */}
                <Tabs
                  selectedKey={userType}
                  onSelectionChange={(key) =>
                    handleUserTypeChange(key as string)
                  }
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type="text"
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange("name")}
                    startContent={
                      <UserIcon className="h-4 w-4 text-default-400" />
                    }
                    classNames={{
                      input: "text-base",
                      inputWrapper:
                        "border border-default-200 hover:border-primary/50 focus-within:border-primary",
                    }}
                    isRequired
                  />

                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    startContent={
                      <MailIcon className="h-4 w-4 text-default-400" />
                    }
                    classNames={{
                      input: "text-base",
                      inputWrapper:
                        "border border-default-200 hover:border-primary/50 focus-within:border-primary",
                    }}
                    isRequired
                  />

                  {userType === "hr" && (
                    <Input
                      type="text"
                      label="Company Name"
                      placeholder="Enter your company name"
                      value={formData.company}
                      onChange={handleChange("company")}
                      startContent={
                        <BuildingIcon className="h-4 w-4 text-default-400" />
                      }
                      classNames={{
                        input: "text-base",
                        inputWrapper:
                          "border border-default-200 hover:border-primary/50 focus-within:border-primary",
                      }}
                      isRequired
                    />
                  )}

                  <Input
                    label="Password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    startContent={
                      <LockIcon className="h-4 w-4 text-default-400" />
                    }
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeOffIcon className="h-4 w-4 text-default-400 hover:text-primary transition-colors" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-default-400 hover:text-primary transition-colors" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    classNames={{
                      input: "text-base",
                      inputWrapper:
                        "border border-default-200 hover:border-primary/50 focus-within:border-primary",
                    }}
                    isRequired
                  />

                  <Button
                    type="submit"
                    color={userType === "hr" ? "secondary" : "primary"}
                    size="lg"
                    className="w-full font-semibold"
                    isLoading={isLoading}
                  >
                    {isLoading
                      ? "Creating Account..."
                      : userType === "hr"
                      ? "Create Recruiter Account"
                      : "Create Job Seeker Account"}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-default-600 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-primary font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                <Divider className="my-6" />

                {/* Security Notice */}
                <div className="p-3 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-success-700">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Your data is encrypted and secure</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
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
