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
  ZapIcon,
  TargetIcon,
  AwardIcon,
  RocketIcon,
} from "lucide-react";
import { Logo } from "@/components/icons";

export default function HomePage() {
  const applicantFeatures = [
    {
      icon: BrainIcon,
      title: "AI Resume Builder",
      description:
        "Create professional resumes with AI assistance and smart suggestions",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: UploadIcon,
      title: "Smart Upload & Score",
      description:
        "Upload existing resumes and get instant ATS compatibility scores",
      gradient: "from-green-500 to-teal-600",
    },
    {
      icon: PenToolIcon,
      title: "Easy Resume Editor",
      description: "Build and edit resumes with our intuitive WYSIWYG editor",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: ShieldCheckIcon,
      title: "ATS Optimization",
      description:
        "Get actionable tips to improve your resume's ATS compatibility",
      gradient: "from-indigo-500 to-purple-600",
    },
  ];

  const hrFeatures = [
    {
      icon: SearchIcon,
      title: "Smart Candidate Matching",
      description: "AI-powered resume analysis and job-candidate matching",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: BarChart3Icon,
      title: "Analytics Dashboard",
      description: "Track applications, analyze trends, and optimize hiring",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: ClockIcon,
      title: "Streamlined Process",
      description: "Reduce screening time by 80% with automated analysis",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      icon: FileTextIcon,
      title: "Multi-Format Support",
      description: "Accept PDF, DOCX, TXT with automatic parsing and scoring",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  const applicantBenefits = [
    {
      icon: ZapIcon,
      title: "Lightning Fast Creation",
      description: "AI-powered resume creation and optimization in minutes",
      metric: "5x Faster",
    },
    {
      icon: TargetIcon,
      title: "ATS Compatibility",
      description: "Instant scoring with detailed improvement suggestions",
      metric: "95% Success Rate",
    },
    {
      icon: TrendingUpIcon,
      title: "Performance Tracking",
      description: "Monitor resume performance across applications",
      metric: "Real-time Analytics",
    },
  ];

  const hrBenefits = [
    {
      icon: ClockIcon,
      title: "Time Savings",
      description: "Reduce screening time with automated analysis",
      metric: "80% Faster",
    },
    {
      icon: AwardIcon,
      title: "Quality Matching",
      description: "Improve candidate quality with AI-powered matching",
      metric: "3x Better Matches",
    },
    {
      icon: RocketIcon,
      title: "Scalable Solution",
      description: "Seamlessly manage thousands of applications with ease.",
      metric: "Unlimited Scale",
    },
  ];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 -right-32 w-96 h-96 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Logo and Brand */}
            <motion.div
              className="flex justify-center items-center mb-12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-xl transform scale-110"></div>
                <div className="relative bg-gradient-to-br from-white/90 to-white/60 dark:from-gray-800/90 dark:to-gray-900/60 backdrop-blur-sm rounded-2xl mr-6 border border-white/20 shadow-2xl">
                  <Logo size={72} className="rounded-xl" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent mb-2">
                  Screener.ai
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                  AI-Powered Resume Intelligence
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Chip
                color="primary"
                variant="flat"
                size="lg"
                className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 shadow-lg"
                startContent={<SparklesIcon className="h-4 w-4" />}
              >
                Powered by Google Gemini AI
              </Chip>
            </motion.div>

            <motion.p
              className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-12 max-w-5xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              The AI-powered platform that empowers job seekers to create
              <span className="font-semibold text-primary">
                {" "}
                winning resumes{" "}
              </span>
              and helps recruiters find the
              <span className="font-semibold text-secondary">
                {" "}
                perfect candidates{" "}
              </span>
              faster
            </motion.p>
          </motion.div>

          {/* Enhanced Dual CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {/* For Job Seekers */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-lg">
                {/* Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-sm"></div>
                <div className="absolute inset-[1px] bg-white/90 dark:bg-gray-800/90 rounded-xl"></div>

                <CardBody className="relative z-10 p-8 text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                    <div className="relative p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full w-fit mx-auto border border-primary/20">
                      <UserIcon className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    For Job Seekers
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    Create AI-powered resumes, get instant ATS scores, and land
                    your dream job with confidence
                  </p>
                  <div className="space-y-3">
                    <Link href="/resume/create" className="block">
                      <Button
                        color="primary"
                        size="lg"
                        className="w-full font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        startContent={<SparklesIcon className="h-5 w-5" />}
                      >
                        Create Resume with AI
                      </Button>
                    </Link>
                    <Link href="/resume/upload" className="block">
                      <Button
                        variant="bordered"
                        size="lg"
                        className="w-full font-medium border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transform hover:scale-105 transition-all duration-300"
                        startContent={<UploadIcon className="h-5 w-5" />}
                      >
                        Upload & Score Resume
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* For Recruiters */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-lg">
                {/* Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-xl blur-sm"></div>
                <div className="absolute inset-[1px] bg-white/90 dark:bg-gray-800/90 rounded-xl"></div>

                <CardBody className="relative z-10 p-8 text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl"></div>
                    <div className="relative p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-full w-fit mx-auto border border-secondary/20">
                      <BuildingIcon className="h-10 w-10 text-secondary" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-secondary to-orange-600 bg-clip-text text-transparent">
                    For Recruiters
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    Streamline hiring with AI-powered candidate matching and
                    comprehensive analytics
                  </p>
                  <div className="space-y-3">
                    <Link href="/auth/register?type=hr" className="block">
                      <Button
                        color="secondary"
                        size="lg"
                        className="w-full font-semibold bg-gradient-to-r from-secondary to-orange-600 hover:from-secondary/90 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        startContent={<TrendingUpIcon className="h-5 w-5" />}
                      >
                        Start Recruiting
                      </Button>
                    </Link>
                    <Link href="/jobs" className="block">
                      <Button
                        variant="bordered"
                        size="lg"
                        className="w-full font-medium border-2 border-secondary/30 hover:border-secondary/60 hover:bg-secondary/5 transform hover:scale-105 transition-all duration-300"
                        startContent={<SearchIcon className="h-5 w-5" />}
                      >
                        Browse Public Jobs
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 opacity-20"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <BrainIcon className="h-12 w-12 text-primary" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-16 opacity-20"
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        >
          <SparklesIcon className="h-8 w-8 text-secondary" />
        </motion.div>
      </section>

      {/* Enhanced Quick Actions Bar */}
      <section className="relative py-8 px-4 border-y border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-medium">
              <span>Already have an account?</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button
                  variant="bordered"
                  size="md"
                  className="font-medium border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transform hover:scale-105 transition-all duration-300"
                  startContent={<UserIcon className="h-4 w-4" />}
                >
                  Sign In
                </Button>
              </Link>
              <div className="text-gray-300 dark:text-gray-600">|</div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  New here?
                </span>
                <Link href="/auth/register?type=applicant">
                  <Button
                    color="primary"
                    variant="flat"
                    size="md"
                    className="font-medium transform hover:scale-105 transition-all duration-300"
                  >
                    Job Seeker
                  </Button>
                </Link>
                <Link href="/auth/register?type=hr">
                  <Button
                    color="secondary"
                    variant="flat"
                    size="md"
                    className="font-medium transform hover:scale-105 transition-all duration-300"
                  >
                    Recruiter
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section with Tabs */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="max-w-6xl mx-auto flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary to-secondary dark:from-white dark:via-primary dark:to-secondary bg-clip-text text-transparent">
              Powerful Features for Everyone
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Whether you're looking for your next opportunity or finding the
              perfect candidate, we've got the cutting-edge tools you need
            </p>
          </motion.div>

          <Tabs
            aria-label="User type features"
            className="w-fit mx-auto"
            classNames={{
              tabList:
                "gap-8 w-full relative rounded-xl p-2 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg shadow-xl",
              cursor:
                "h-12 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg",
              tab: "max-w-fit px-6 h-12 font-semibold",
              tabContent: "group-data-[selected=true]:text-white",
            }}
          >
            <Tab
              key="jobseekers"
              title={
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5" />
                  <span>For Job Seekers</span>
                </div>
              }
            >
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {applicantFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg overflow-hidden group">
                      <CardBody className="text-center p-8 relative">
                        {/* Animated background gradient */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                        ></div>

                        <div className="relative">
                          <div
                            className={`p-4 bg-gradient-to-br ${feature.gradient} bg-opacity-10 rounded-2xl w-fit mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                          >
                            <feature.icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </Tab>

            <Tab
              key="recruiters"
              title={
                <div className="flex items-center space-x-3">
                  <BuildingIcon className="h-5 w-5" />
                  <span>For Recruiters</span>
                </div>
              }
            >
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {hrFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg overflow-hidden group">
                      <CardBody className="text-center p-8 relative">
                        {/* Animated background gradient */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                        ></div>

                        <div className="relative">
                          <div
                            className={`p-4 bg-gradient-to-br ${feature.gradient} bg-opacity-10 rounded-2xl w-fit mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                          >
                            <feature.icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </Tab>
          </Tabs>
        </div>
      </section>

      {/* Enhanced Why Choose Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-r from-secondary/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8 relative">
              <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary dark:from-white dark:via-primary dark:to-secondary bg-clip-text text-transparent">
                Why Choose
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent relative">
                Screener.ai?
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </span>
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Join thousands of professionals who've revolutionized their hiring
              and job search experience with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-20">
            {/* Job Seekers Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative gradient background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-3xl blur-xl"></div>

              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg"></div>
                    <div className="relative p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full border border-primary/30">
                      <UserIcon className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      For Job Seekers
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                      Accelerate your career journey
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {applicantBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-700/90 dark:to-gray-800/90 hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                        {/* Animated border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                        <div className="absolute inset-[1px] bg-white/95 dark:bg-gray-700/95 rounded-xl"></div>

                        <CardBody className="relative z-10 p-6">
                          <div className="flex items-start gap-6">
                            <div className="shrink-0">
                              <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                                <benefit.icon className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {benefit.title}
                                </h4>
                                <Chip
                                  className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 text-primary font-semibold"
                                  variant="flat"
                                  size="sm"
                                >
                                  {benefit.metric}
                                </Chip>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* HR Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative gradient background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary/10 to-orange-500/10 rounded-3xl blur-xl"></div>

              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-secondary/30 rounded-full blur-lg"></div>
                    <div className="relative p-4 bg-gradient-to-br from-secondary/20 to-orange-500/20 rounded-full border border-secondary/30">
                      <BuildingIcon className="h-10 w-10 text-secondary" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-secondary to-orange-600 bg-clip-text text-transparent">
                      For Recruiters
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                      Transform your hiring process
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {hrBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-700/90 dark:to-gray-800/90 hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                        {/* Animated border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                        <div className="absolute inset-[1px] bg-white/95 dark:bg-gray-700/95 rounded-xl"></div>

                        <CardBody className="relative z-10 p-6">
                          <div className="flex items-start gap-6">
                            <div className="shrink-0">
                              <div className="p-3 bg-gradient-to-br from-secondary/20 to-orange-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-secondary/20">
                                <benefit.icon className="h-6 w-6 text-secondary" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {benefit.title}
                                </h4>
                                <Chip
                                  className="bg-gradient-to-r from-secondary/10 to-orange-500/10 border-secondary/20 text-secondary font-semibold"
                                  variant="flat"
                                  size="sm"
                                >
                                  {benefit.metric}
                                </Chip>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  {
                    value: "99.9%",
                    label: "Uptime Guarantee",
                    icon: ShieldCheckIcon,
                  },
                  { value: "24/7", label: "AI Processing", icon: ClockIcon },
                  { value: "SOC2", label: "Compliant", icon: AwardIcon },
                  { value: "GDPR", label: "Protected", icon: CheckCircleIcon },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-purple-500/5 to-secondary/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-secondary/10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-primary dark:from-white dark:to-primary bg-clip-text text-transparent">
              Trusted by Thousands
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "50K+", label: "Resumes Created & Analyzed", delay: 0 },
              { value: "1K+", label: "Companies Trust Us", delay: 0.1 },
              { value: "98%", label: "User Satisfaction Rate", delay: 0.2 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: stat.delay }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <Card className="relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardBody className="relative z-10 p-8">
                    <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium text-lg">
                      {stat.label}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary to-secondary dark:from-white dark:via-primary dark:to-secondary bg-clip-text text-transparent">
              About Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Built with passion during a hackathon by three dedicated
              developers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Aneesh M Bhat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg overflow-hidden">
                <CardBody className="text-center p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <UserIcon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      Aneesh M Bhat
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Founder of DevVoid & Co-Founder of AutomotiveAI, TetherAI
                      & Koddera
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      aneeshbhat3719@gmail.com
                    </p>
                    <div className="mt-4">
                      <a
                        href="https://devvoid.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-300"
                      >
                        Know More <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Aditya Raj */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg overflow-hidden">
                <CardBody className="text-center p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <UserIcon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      Aditya Raj
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      GenAI CoE at Deloitte USI & Huge wildlife enthusiast
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      addyrog2@gmail.com
                    </p>
                    <div className="mt-4">
                      <a
                        href="mailto:addyrog2@gmail.com"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-300"
                      >
                        Know More <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Ankita Ambastha */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg overflow-hidden">
                <CardBody className="text-center p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-secondary to-orange-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <UserIcon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      Ankita Ambastha
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Specialist in Python, AI and Automations & Music
                      Enthusiast
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      ankitaambastha3005@gmail.com
                    </p>
                    <div className="mt-4">
                      <a
                        href="mailto:ankitaambastha3005@gmail.com"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-300"
                      >
                        Know More <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-secondary"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Ready to Get{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Started?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Join thousands of job seekers and recruiters who have transformed
              their hiring process with Screener.ai's cutting-edge AI technology
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link href="/resume/create">
                <Button
                  size="lg"
                  className="px-10 py-6 text-lg font-semibold bg-white text-primary hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25"
                  startContent={<SparklesIcon className="h-5 w-5" />}
                >
                  Create Your Resume
                </Button>
              </Link>
              <Link href="/auth/register?type=hr">
                <Button
                  variant="bordered"
                  size="lg"
                  className="px-10 py-6 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-primary transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  startContent={<TrendingUpIcon className="h-5 w-5" />}
                >
                  Start Recruiting
                </Button>
              </Link>
            </div>

            <motion.div
              className="text-white/80 text-sm font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <CheckCircleIcon className="inline h-4 w-4 mr-2" />
              No credit card required • Get started in minutes
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
