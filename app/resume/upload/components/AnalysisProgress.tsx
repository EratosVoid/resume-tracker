"use client";

import { Card, CardBody, Button, Progress } from "@heroui/react";
import { motion } from "framer-motion";
import { FileTextIcon, BrainIcon, XIcon } from "lucide-react";

interface AnalysisProgressProps {
  fileName: string;
  fileSize: number;
  progress: number;
  onCancel: () => void;
}

export default function AnalysisProgress({
  fileName,
  fileSize,
  progress,
  onCancel,
}: AnalysisProgressProps) {
  const getProgressMessage = (progress: number) => {
    if (progress < 30) return "Uploading file...";
    if (progress < 60) return "Extracting text content...";
    if (progress < 90) return "Analyzing with AI...";
    return "Finalizing results...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="w-full">
        <CardBody className="p-8">
          <div className="space-y-6">
            {/* File Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileTextIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{fileName}</h3>
                  <p className="text-sm text-default-600">
                    {(fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={onCancel}
                startContent={<XIcon className="h-4 w-4" />}
              />
            </div>

            {/* AI Animation */}
            <div className="text-center">
              <motion.div
                className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full w-fit mx-auto mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <BrainIcon className="h-16 w-16 text-primary" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-3">
                AI is Analyzing Your Resume
              </h2>
              <p className="text-default-600 mb-6 max-w-md mx-auto">
                Our advanced AI is parsing your resume content and calculating
                your ATS compatibility score
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-4">
              <Progress
                value={progress}
                color="primary"
                className="w-full"
                showValueLabel={true}
                size="lg"
              />
              <div className="text-center">
                <p className="text-sm font-medium text-primary">
                  {getProgressMessage(progress)}
                </p>
              </div>
            </div>

            {/* Features reminder */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-default-200">
              <div className="text-center">
                <div className="text-2xl mb-1">🧠</div>
                <p className="text-xs text-default-600">AI-Powered</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-xs text-default-600">Instant Results</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-xs text-default-600">ATS Optimized</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
