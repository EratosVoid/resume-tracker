"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Chip,
} from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BrainIcon,
  FileTextIcon,
  UsersIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  UploadIcon,
  PenToolIcon,
  ShieldCheckIcon,
  SearchIcon,
  BarChart3Icon,
  ClockIcon,
  StarIcon,
  BuildingIcon,
  UserIcon,
} from "lucide-react";

export default function HomePage() {
  const applicantFeatures = [
    {
      icon: BrainIcon,
      title: "AI Resume Builder",
      description:
        "Create professional resumes with AI assistance and smart suggestions",
    },
    {
      icon: UploadIcon,
      title: "Smart Upload & Score",
      description:
        "Upload existing resumes and get instant ATS compatibility scores",
    },
    {
      icon: PenToolIcon,
      title: "Easy Resume Editor",
      description: "Build and edit resumes with our intuitive WYSIWYG editor",
    },
    {
      icon: ShieldCheckIcon,
      title: "ATS Optimization",
      description:
        "Get actionable tips to improve your resume's ATS compatibility",
    },
  ];

  const hrFeatures = [
    {
      icon: SearchIcon,
      title: "Smart Candidate Matching",
      description: "AI-powered resume analysis and job-candidate matching",
    },
    {
      icon: BarChart3Icon,
      title: "Analytics Dashboard",
      description: "Track applications, analyze trends, and optimize hiring",
    },
    {
      icon: ClockIcon,
      title: "Streamlined Process",
      description: "Reduce screening time by 80% with automated analysis",
    },
    {
      icon: FileTextIcon,
      title: "Multi-Format Support",
      description: "Accept PDF, DOCX, TXT with automatic parsing and scoring",
    },
  ];

  const applicantBenefits = [
    "AI-powered resume creation and optimization",
    "Instant ATS compatibility scoring",
    "Track resume performance across applications",
    "Professional templates and formatting",
    "Real-time improvement suggestions",
    "Version history and analytics",
  ];

  const hrBenefits = [
    "Reduce screening time by 80%",
    "Improve candidate quality matching",
    "Anonymous application support",
    "Real-time AI analysis",
    "Comprehensive skill matching",
    "Mobile-responsive dashboard",
  ];

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <Chip color="primary" variant="flat" size="lg">
                Powered by Google Gemini AI
              </Chip>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ResumeIQ
            </h1>
            <p className="text-xl md:text-2xl text-default-600 mb-8 max-w-4xl mx-auto">
              The AI-powered platform that empowers job seekers to create
              winning resumes and helps recruiters find the perfect candidates
              faster
            </p>
          </motion.div>

          {/* Dual CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {/* For Job Seekers */}
            <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardBody className="text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                  <UserIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">For Job Seekers</h3>
                <p className="text-default-600">
                  Create AI-powered resumes, get instant ATS scores, and land
                  your dream job
                </p>
                <div className="space-y-2">
                  <Link href="/resume/create" className="block">
                    <Button
                      color="primary"
                      size="lg"
                      className="w-full"
                      startContent={<SparklesIcon className="h-4 w-4" />}
                    >
                      Create Resume with AI
                    </Button>
                  </Link>
                  <Link href="/resume/upload" className="block">
                    <Button
                      variant="bordered"
                      size="lg"
                      className="w-full"
                      startContent={<UploadIcon className="h-4 w-4" />}
                    >
                      Upload & Score Resume
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>

            {/* For Recruiters */}
            <Card className="p-6 border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
              <CardBody className="text-center space-y-4">
                <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto">
                  <BuildingIcon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold">For Recruiters</h3>
                <p className="text-default-600">
                  Streamline hiring with AI-powered candidate matching and
                  analytics
                </p>
                <div className="space-y-2">
                  <Link href="/auth/register?type=hr" className="block">
                    <Button
                      color="secondary"
                      size="lg"
                      className="w-full"
                      startContent={<TrendingUpIcon className="h-4 w-4" />}
                    >
                      Start Recruiting
                    </Button>
                  </Link>
                  <Link href="/jobs" className="block">
                    <Button
                      variant="bordered"
                      size="lg"
                      className="w-full"
                      startContent={<SearchIcon className="h-4 w-4" />}
                    >
                      Browse Public Jobs
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Tabs */}
      <section className="py-20 px-4 bg-default-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Powerful Features for Everyone
            </h2>
            <p className="text-xl text-default-600 max-w-3xl mx-auto">
              Whether you're looking for your next opportunity or finding the
              perfect candidate, we've got the tools you need
            </p>
          </motion.div>

          <Tabs
            aria-label="User type features"
            className="w-full"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary",
            }}
          >
            <Tab
              key="jobseekers"
              title={
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>For Job Seekers</span>
                </div>
              }
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {applicantFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardBody className="text-center p-6">
                        <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-default-600">
                          {feature.description}
                        </p>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Tab>

            <Tab
              key="recruiters"
              title={
                <div className="flex items-center space-x-2">
                  <BuildingIcon className="h-5 w-5" />
                  <span>For Recruiters</span>
                </div>
              }
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {hrFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardBody className="text-center p-6">
                        <feature.icon className="h-12 w-12 text-secondary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-default-600">
                          {feature.description}
                        </p>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose ResumeIQ?</h2>
            <p className="text-xl text-default-600">
              Trusted by thousands of job seekers and hundreds of companies
              worldwide
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Job Seekers Benefits */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <UserIcon className="h-6 w-6 text-primary mr-2" />
                For Job Seekers
              </h3>
              <div className="space-y-4">
                {applicantBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircleIcon className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* HR Benefits */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <BuildingIcon className="h-6 w-6 text-secondary mr-2" />
                For Recruiters
              </h3>
              <div className="space-y-4">
                {hrBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircleIcon className="h-6 w-6 text-secondary flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-default-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-default-600">Resumes Created & Analyzed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">1K+</div>
              <div className="text-default-600">Companies Trust Us</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-default-600">User Satisfaction Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers and recruiters who have transformed
              their hiring process with ResumeIQ
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/resume/create">
                <Button
                  color="secondary"
                  size="lg"
                  className="px-8"
                  startContent={<SparklesIcon className="h-4 w-4" />}
                >
                  Create Your Resume
                </Button>
              </Link>
              <Link href="/auth/register?type=hr">
                <Button
                  variant="bordered"
                  size="lg"
                  className="px-8 border-white text-white hover:bg-white hover:text-primary"
                  startContent={<TrendingUpIcon className="h-4 w-4" />}
                >
                  Start Recruiting
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-white/80 text-sm">
              No credit card required • Get started in minutes
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
