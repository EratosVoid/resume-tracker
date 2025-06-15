"use client";

import JobList from "@/components/jobs/JobList";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  SparklesIcon,
  BarChart3Icon,
  UsersIcon,
  RocketIcon,
  SearchIcon,
} from "lucide-react";
import { Card, CardBody, Chip } from "@heroui/react";

export default function JobsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const stats = [
    {
      icon: BriefcaseIcon,
      label: "Active Jobs",
      value: "50+",
      color: "primary",
    },
    {
      icon: UsersIcon,
      label: "Companies",
      value: "25+",
      color: "secondary",
    },
    {
      icon: BarChart3Icon,
      label: "Success Rate",
      value: "85%",
      color: "success",
    },
    {
      icon: SparklesIcon,
      label: "AI Powered",
      value: "100%",
      color: "warning",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-success/10 dark:from-primary/5 dark:via-secondary/3 dark:to-success/5 py-20 px-4 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-32 right-20 w-32 h-32 bg-secondary rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-24 h-24 bg-success rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/4 w-16 h-16 bg-warning rounded-full blur-lg"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <div className="flex justify-center mb-6">
              <motion.div
                className="p-6 bg-primary/10 dark:bg-primary/20 rounded-full shadow-lg border border-primary/20 dark:border-primary/30"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                animate={{
                  y: [0, -5, 0],
                }}
                style={{
                  animationDuration: "3s",
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-in-out",
                }}
              >
                <RocketIcon className="h-14 w-14 text-primary" />
              </motion.div>
            </div>

            <motion.h1
              className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Find Your Dream Job
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-default-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Discover exciting opportunities and apply with our{" "}
              <span className="font-semibold text-primary">
                AI-powered resume analysis
              </span>{" "}
              that gives you the competitive edge you need
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              variants={itemVariants}
            >
              {[
                {
                  icon: SparklesIcon,
                  text: "AI Resume Scoring",
                  color: "primary",
                },
                {
                  icon: BarChart3Icon,
                  text: "Real-time Feedback",
                  color: "secondary",
                },
                { icon: SearchIcon, text: "Smart Matching", color: "success" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Chip
                    startContent={<feature.icon className="h-4 w-4" />}
                    color={feature.color as any}
                    variant="flat"
                    size="lg"
                    className="font-semibold px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 border border-divider/50"
                  >
                    {feature.text}
                  </Chip>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            variants={itemVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  rotateY: 5,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transformStyle: "preserve-3d",
                }}
              >
                <Card className="bg-background/80 dark:bg-default-100/80 backdrop-blur-sm border border-divider shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardBody className="text-center p-6">
                    <div className="flex justify-center mb-3">
                      <div
                        className={`p-3 rounded-full transition-colors duration-300 ${
                          stat.color === "primary"
                            ? "bg-primary/10 dark:bg-primary/20"
                            : stat.color === "secondary"
                            ? "bg-secondary/10 dark:bg-secondary/20"
                            : stat.color === "success"
                            ? "bg-success/10 dark:bg-success/20"
                            : "bg-warning/10 dark:bg-warning/20"
                        }`}
                      >
                        <stat.icon
                          className={`h-6 w-6 transition-colors duration-300 ${
                            stat.color === "primary"
                              ? "text-primary"
                              : stat.color === "secondary"
                              ? "text-secondary"
                              : stat.color === "success"
                              ? "text-success"
                              : "text-warning"
                          }`}
                        />
                      </div>
                    </div>
                    <div
                      className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
                        stat.color === "primary"
                          ? "text-primary"
                          : stat.color === "secondary"
                          ? "text-secondary"
                          : stat.color === "success"
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-default-600 font-medium">
                      {stat.label}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Job List Section */}
      <motion.div
        className="py-16 px-4 bg-gradient-to-b from-background to-default-50/50 dark:from-background dark:to-default-100/10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.div
              className="inline-block p-2 bg-primary/10 dark:bg-primary/20 rounded-full mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <BriefcaseIcon className="h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Latest Opportunities
            </h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto leading-relaxed">
              Browse through our curated list of positions from top companies
              and find your perfect match
            </p>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl blur-3xl -z-10" />
            <JobList />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
