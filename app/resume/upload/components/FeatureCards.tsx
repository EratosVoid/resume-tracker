"use client";

import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import {
  BrainIcon,
  TrendingUpIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  TargetIcon,
} from "lucide-react";

const features = [
  {
    icon: BrainIcon,
    title: "AI-Powered Analysis",
    description:
      "Advanced parsing using Google Gemini AI for accurate content extraction",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: TrendingUpIcon,
    title: "Instant ATS Scoring",
    description: "Get your ATS compatibility score and ranking in seconds",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: SparklesIcon,
    title: "Actionable Insights",
    description: "Specific suggestions to improve your resume's effectiveness",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & Private",
    description:
      "Your resume data is processed securely and never stored permanently",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: ClockIcon,
    title: "Lightning Fast",
    description: "Complete analysis in under 30 seconds with detailed feedback",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
  {
    icon: TargetIcon,
    title: "Job-Specific Tips",
    description: "Tailored recommendations based on industry best practices",
    color: "text-pink-600",
    bgColor: "bg-pink-600/10",
  },
];

export default function FeatureCards() {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {features.map((feature, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardBody className="text-center p-6 space-y-4">
              <div
                className={`p-4 ${feature.bgColor} rounded-full w-fit mx-auto`}
              >
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-default-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
