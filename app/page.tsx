"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BrainIcon,
  FileTextIcon,
  UsersIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: BrainIcon,
      title: "AI-Powered Analysis",
      description:
        "Advanced resume parsing and matching using Google Gemini AI",
    },
    {
      icon: FileTextIcon,
      title: "Multi-Format Support",
      description:
        "Upload PDF, DOCX, or TXT files with automatic text extraction",
    },
    {
      icon: UsersIcon,
      title: "Smart Matching",
      description: "Intelligent candidate-job matching with ATS scoring",
    },
    {
      icon: TrendingUpIcon,
      title: "Analytics Dashboard",
      description: "Track applications, analyze trends, and optimize hiring",
    },
  ];

  const benefits = [
    "Reduce screening time by 80%",
    "Improve candidate quality matching",
    "Anonymous application support",
    "Real-time AI analysis",
    "Comprehensive skill matching",
    "Mobile-responsive design",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smart ATS System
            </h1>
            <p className="text-xl md:text-2xl text-default-600 mb-8 max-w-3xl mx-auto">
              Revolutionize your hiring process with AI-powered resume analysis,
              intelligent matching, and streamlined candidate management.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/jobs">
              <Button
                color="primary"
                size="lg"
                className="px-8"
                endContent={<ArrowRightIcon className="h-4 w-4" />}
              >
                Browse Jobs
              </Button>
            </Link>
            <Button variant="bordered" size="lg" className="px-8">
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-default-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Powerful Features</h2>
            <p className="text-xl text-default-600 max-w-3xl mx-auto">
              Our ATS system combines cutting-edge AI technology with intuitive
              design to streamline your recruitment process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
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
                    <p className="text-default-600">{feature.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose Our ATS?</h2>
            <p className="text-xl text-default-600">
              Transform your hiring process with intelligent automation and
              insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <CheckCircleIcon className="h-6 w-6 text-success flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of companies that have revolutionized their
              recruitment process with our AI-powered ATS system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs">
                <Button
                  color="secondary"
                  size="lg"
                  className="px-8"
                  endContent={<ArrowRightIcon className="h-4 w-4" />}
                >
                  Start Hiring
                </Button>
              </Link>
              <Button
                variant="bordered"
                size="lg"
                className="px-8 border-white text-white hover:bg-white hover:text-primary"
              >
                Request Demo
              </Button>
            </div>
          </motion.div>
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
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-default-600">Resumes Analyzed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-default-600">Companies Trust Us</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-default-600">Accuracy Rate</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
