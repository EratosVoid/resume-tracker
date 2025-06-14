"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Link,
  Divider,
  Chip,
} from "@heroui/react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  EyeIcon,
  EyeOffIcon,
  BrainIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  SparklesIcon,
  MailIcon,
  LockIcon,
} from "lucide-react";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        // Get the session to check user role
        const session = await getSession();

        toast.success("Logged in successfully");

        console.log("session", session?.user);

        // Redirect based on role
        if (session?.user?.role === "hr") {
          router.push("/dashboard");
        } else if (session?.user?.role === "applicant") {
          console.log("applicant");
          router.push("/applicant");
        } else {
          router.push("/dashboard"); // Fallback
        }
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-default-50"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>

      <div className="relative min-h-screen flex">
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
              <div className="bg-primary/10 rounded-xl mr-4">
                <Logo size={42} className="rounded-xl" />
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
                Welcome Back!
              </h2>
              <p className="text-lg text-default-600">
                Continue your journey to land your dream job or find the perfect
                candidate with our AI-powered platform.
              </p>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <SparklesIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI-Powered Analysis</h3>
                    <p className="text-sm text-default-600">
                      Get instant resume scoring and optimization tips
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <ShieldCheckIcon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">ATS Optimization</h3>
                    <p className="text-sm text-default-600">
                      Ensure your resume passes automated screening
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 pt-4">
                <Chip color="primary" variant="flat" size="sm">
                  50K+ Resumes Analyzed
                </Chip>
                <Chip color="secondary" variant="flat" size="sm">
                  99.9% Uptime
                </Chip>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
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
                  <LockIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Sign In</h1>
                <p className="text-default-600 text-center">
                  Access your dashboard and continue optimizing your career
                </p>
              </CardHeader>

              <CardBody className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                  <div className="flex justify-end">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    className="w-full font-semibold"
                    isLoading={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <Divider className="my-8" />

                {/* Registration CTA */}
                <div className="text-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                    <p className="text-default-700 mb-3">New to Screener.ai?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/auth/register?type=applicant">
                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          className="w-full"
                          startContent={<SparklesIcon className="h-4 w-4" />}
                        >
                          Job Seeker
                        </Button>
                      </Link>
                      <Link href="/auth/register?type=hr">
                        <Button
                          color="secondary"
                          variant="flat"
                          size="sm"
                          className="w-full"
                          startContent={<BrainIcon className="h-4 w-4" />}
                        >
                          Recruiter
                        </Button>
                      </Link>
                    </div>
                    <p className="text-xs text-default-500 mt-3">
                      Free forever • No credit card required
                    </p>
                  </div>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-lg font-bold text-primary">50K+</div>
                      <div className="text-xs text-default-500">
                        Resumes Scored
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-lg font-bold text-secondary">
                        1K+
                      </div>
                      <div className="text-xs text-default-500">Companies</div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-3 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-success-700">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Enterprise-grade security & GDPR compliant</span>
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
