"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  MessageCircleIcon,
  FormInputIcon,
  SparklesIcon,
  FileTextIcon,
  CheckCircleIcon,
} from "lucide-react";

interface ModeSelectorProps {
  onModeSelect: (mode: "form" | "chat") => void;
}

export default function ModeSelector({ onModeSelect }: ModeSelectorProps) {
  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link href="/">
              <Button
                isIconOnly
                variant="light"
                startContent={<ArrowLeftIcon className="h-4 w-4" />}
              />
            </Link>
            <div>
              <h1 className="text-4xl font-bold mb-2">Create Your Resume</h1>
              <p className="text-xl text-default-600">
                Choose how you'd like to build your AI-powered resume
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* AI Chat Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40">
              <CardBody className="p-8 text-center space-y-6">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                  <MessageCircleIcon className="h-12 w-12 text-primary" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    AI Conversation Mode
                  </h3>
                  <p className="text-default-600 mb-6">
                    Have a natural conversation with our AI. It'll ask smart
                    questions and validate your achievements with proof
                    requirements.
                  </p>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                    <span className="text-sm">Interactive Q&A format</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                    <span className="text-sm">Proof validation for claims</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                    <span className="text-sm">
                      Personalized follow-up questions
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                    <span className="text-sm">Natural conversation flow</span>
                  </div>
                </div>

                <Button
                  color="primary"
                  size="lg"
                  className="w-full"
                  startContent={<SparklesIcon className="h-5 w-5" />}
                  onPress={() => onModeSelect("chat")}
                >
                  Start AI Conversation
                </Button>

                <Chip color="primary" variant="flat" size="sm">
                  Recommended for beginners
                </Chip>
              </CardBody>
            </Card>
          </motion.div>

          {/* Form Mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-secondary/20 hover:border-secondary/40">
              <CardBody className="p-8 text-center space-y-6">
                <div className="p-4 bg-secondary/10 rounded-full w-fit mx-auto">
                  <FormInputIcon className="h-12 w-12 text-secondary" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    Structured Form Mode
                  </h3>
                  <p className="text-default-600 mb-6">
                    Fill out organized forms with validation requirements.
                    Perfect if you prefer a structured approach.
                  </p>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                    <span className="text-sm">Step-by-step forms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                    <span className="text-sm">Achievement validation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                    <span className="text-sm">Project proof requirements</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                    <span className="text-sm">Traditional interface</span>
                  </div>
                </div>

                <Button
                  color="secondary"
                  size="lg"
                  className="w-full"
                  startContent={<FileTextIcon className="h-5 w-5" />}
                  onPress={() => onModeSelect("form")}
                >
                  Use Form Mode
                </Button>

                <Chip color="secondary" variant="flat" size="sm">
                  Great for experienced users
                </Chip>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
