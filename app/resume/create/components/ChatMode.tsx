"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Progress,
  ScrollShadow,
  Avatar,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  MessageCircleIcon,
  BrainIcon,
  UserIcon,
  WandIcon,
  SendIcon,
  AlertTriangleIcon,
} from "lucide-react";

interface ChatMessage {
  id: number;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
  requiresProof?: boolean;
  proofFor?: string;
  isComplete?: boolean;
}

interface ChatQuestion {
  id: string;
  question: string;
  type: string;
  field: string;
  options?: string[];
  requiresProof?: boolean;
}

interface ChatModeProps {
  onBack: () => void;
  onGenerateResume: (collectedData: Record<string, any>) => void;
  isGenerating: boolean;
}

const chatQuestions: ChatQuestion[] = [
  {
    id: "greeting",
    question:
      "Hi! I'm your AI resume assistant. I'll help you create a compelling resume by asking targeted questions. What's your full name?",
    type: "text",
    field: "fullName",
  },
  {
    id: "email",
    question: "What's your email address?",
    type: "text",
    field: "email",
  },
  {
    id: "phone",
    question: "What's your phone number?",
    type: "text",
    field: "phone",
  },
  {
    id: "location",
    question: "What's your current location (City, State)?",
    type: "text",
    field: "location",
  },
  {
    id: "linkedin",
    question:
      "What's your LinkedIn profile URL? (Optional - you can skip this)",
    type: "text",
    field: "linkedin",
  },
  {
    id: "portfolio",
    question:
      "Do you have a portfolio or personal website? (Optional - you can skip this)",
    type: "text",
    field: "portfolio",
  },
  {
    id: "role",
    question:
      "What specific role are you targeting? (e.g., 'Senior Software Engineer', 'Product Manager', 'Data Scientist')",
    type: "text",
    field: "targetRole",
  },
  {
    id: "experience",
    question:
      "How many years of professional experience do you have in this field?",
    type: "select",
    options: ["0-2 years", "2-5 years", "5-10 years", "10+ years"],
    field: "experienceLevel",
  },
  {
    id: "skills",
    question:
      "List your top 5-7 technical/professional skills separated by commas. (e.g., 'JavaScript, React, Node.js, Python, AWS')",
    type: "text",
    field: "skills",
  },
  {
    id: "workExperience",
    question:
      "Describe your work experience. Include company names, job titles, dates, and key responsibilities/achievements. Be specific with metrics and impact.",
    type: "text",
    field: "workExperience",
    requiresProof: true,
  },
  {
    id: "education",
    question:
      "Tell me about your educational background. Include degrees, institutions, graduation dates, and any relevant coursework or honors.",
    type: "text",
    field: "education",
  },
  {
    id: "projects",
    question:
      "Describe 2-3 significant projects you've worked on. Include the problem, your solution, technologies used, and measurable results.",
    type: "text",
    field: "projects",
    requiresProof: true,
  },
  {
    id: "achievements",
    question:
      "What are your top professional achievements or accomplishments? Include specific numbers, percentages, or other quantifiable results.",
    type: "text",
    field: "achievements",
    requiresProof: true,
  },
];

export default function ChatMode({
  onBack,
  onGenerateResume,
  isGenerating,
}: ChatModeProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [collectedData, setCollectedData] = useState<Record<string, any>>({});
  const [proofInputs, setProofInputs] = useState<Record<number, string>>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessages.length === 0) {
      initializeChat();
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const initializeChat = () => {
    const initialMessage: ChatMessage = {
      id: Date.now(),
      type: "ai" as const,
      content: chatQuestions[0].question,
      timestamp: new Date(),
    };
    setChatMessages([initialMessage]);
  };

  const handleChatSend = async () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user" as const,
      content: userInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Process user input
    const currentQuestion = chatQuestions[chatStep];
    setCollectedData((prev) => ({
      ...prev,
      [currentQuestion.field]: userInput,
    }));

    setUserInput("");
    setIsAiTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      let aiResponse = "";
      let nextStep = chatStep + 1;

      // Handle proof requirements
      if (currentQuestion.requiresProof) {
        aiResponse =
          "That's impressive! Can you provide some proof or validation for this achievement? This could be:\n\n• A link to the project/results\n• Screenshots or documentation\n• LinkedIn recommendations\n• Performance reviews\n• GitHub repository\n\nThis helps make your resume more credible.";

        // Add proof collection step
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai" as const,
            content: aiResponse,
            timestamp: new Date(),
            requiresProof: true,
            proofFor: currentQuestion.field,
          },
        ]);
      } else if (nextStep < chatQuestions.length) {
        // Move to next question
        aiResponse = chatQuestions[nextStep].question;
        setChatStep(nextStep);

        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai" as const,
            content: aiResponse,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Finished all questions
        aiResponse =
          "Perfect! I have all the information needed. Let me generate your AI-powered resume with validated achievements and proof-backed claims.";
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai" as const,
            content: aiResponse,
            timestamp: new Date(),
            isComplete: true,
          },
        ]);
      }

      setIsAiTyping(false);
    }, 1500);
  };

  const handleProofSubmission = (
    messageId: number,
    field: string | undefined
  ) => {
    const proofValue = proofInputs[messageId];
    if (!proofValue?.trim() || !field) return;

    // Add user message with the proof
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user" as const,
      content: `Proof: ${proofValue}`,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Store the proof data
    setCollectedData((prev) => ({
      ...prev,
      [`${field}_proof`]: proofValue,
    }));

    // Clear the proof input for this message
    setProofInputs((prev) => ({
      ...prev,
      [messageId]: "",
    }));

    // Continue with next question
    const nextStep = chatStep + 1;
    if (nextStep < chatQuestions.length) {
      setChatStep(nextStep);

      setTimeout(() => {
        const aiResponse = chatQuestions[nextStep].question;
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai" as const,
            content: aiResponse,
            timestamp: new Date(),
          },
        ]);
      }, 500);
    } else {
      // All questions completed
      setTimeout(() => {
        const completionMessage: ChatMessage = {
          id: Date.now() + 1,
          type: "ai" as const,
          content:
            "Perfect! I have all the information needed. Let me generate your AI-powered resume with validated achievements and proof-backed claims.",
          timestamp: new Date(),
          isComplete: true,
        };
        setChatMessages((prev) => [...prev, completionMessage]);
      }, 500);
    }
  };

  const handleGenerateClick = () => {
    onGenerateResume(collectedData);
  };

  return (
    <div className="h-screen overflow-y-auto bg-default-50">
      {/* Header */}
      <div className="bg-white border-b border-default-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="light"
              onPress={onBack}
              startContent={<ArrowLeftIcon className="h-4 w-4" />}
            />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircleIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Resume Conversation</h1>
                <p className="text-sm text-default-600">
                  Building your resume through intelligent conversation
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Progress
              value={
                chatMessages.some((msg) => msg.isComplete)
                  ? 100
                  : (chatStep / chatQuestions.length) * 100
              }
              color="primary"
              className="max-w-md"
              showValueLabel={true}
              label="Progress"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[600px] flex flex-col">
          {/* Chat Messages */}
          <CardBody className="flex-1 p-0">
            <ScrollShadow
              ref={chatContainerRef}
              className="h-full p-6 space-y-4"
            >
              <AnimatePresence>
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "ai" && (
                      <Avatar
                        icon={<BrainIcon className="h-5 w-5" />}
                        color="primary"
                        size="sm"
                      />
                    )}

                    <div
                      className={`max-w-[80%] ${
                        message.type === "user" ? "order-2" : ""
                      }`}
                    >
                      <Card
                        className={`${
                          message.type === "user"
                            ? "bg-primary text-white"
                            : "bg-default-100"
                        }`}
                      >
                        <CardBody className="p-4">
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>

                          {message.requiresProof && (
                            <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangleIcon className="h-4 w-4 text-warning" />
                                <span className="text-sm font-medium">
                                  Proof Required
                                </span>
                              </div>
                              <Input
                                placeholder="Paste link, upload file, or describe proof..."
                                size="sm"
                                value={proofInputs[message.id] || ""}
                                onChange={(e) =>
                                  setProofInputs((prev) => ({
                                    ...prev,
                                    [message.id]: e.target.value,
                                  }))
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleProofSubmission(
                                      message.id,
                                      message.proofFor
                                    );
                                  }
                                }}
                                endContent={
                                  <Button
                                    size="sm"
                                    isIconOnly
                                    variant="light"
                                    onPress={() =>
                                      handleProofSubmission(
                                        message.id,
                                        message.proofFor
                                      )
                                    }
                                    isDisabled={
                                      !proofInputs[message.id]?.trim()
                                    }
                                  >
                                    <SendIcon className="h-4 w-4" />
                                  </Button>
                                }
                              />
                            </div>
                          )}

                          {message.isComplete && (
                            <div className="mt-4">
                              <Button
                                color="primary"
                                startContent={<WandIcon className="h-4 w-4" />}
                                onPress={handleGenerateClick}
                                isLoading={isGenerating}
                                isDisabled={isGenerating}
                              >
                                {isGenerating
                                  ? "Generating..."
                                  : "Generate My Resume"}
                              </Button>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                      <p className="text-xs text-default-400 mt-1 px-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {message.type === "user" && (
                      <Avatar
                        icon={<UserIcon className="h-5 w-5" />}
                        color="secondary"
                        size="sm"
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {(isAiTyping || isGenerating) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Avatar
                    icon={<BrainIcon className="h-5 w-5" />}
                    color="primary"
                    size="sm"
                  />
                  <Card className="bg-default-100">
                    <CardBody className="p-4">
                      {isGenerating ? (
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-primary font-medium">
                            Generating your resume...
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-default-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-default-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              )}
            </ScrollShadow>
          </CardBody>

          {/* Chat Input */}
          <div className="p-4 border-t border-default-200">
            <div className="flex gap-3">
              <Input
                placeholder="Type your response..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
                className="flex-1"
              />
              <Button
                color="primary"
                isIconOnly
                onPress={handleChatSend}
                isDisabled={!userInput.trim() || isAiTyping}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
