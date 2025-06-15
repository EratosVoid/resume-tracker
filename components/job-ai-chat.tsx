"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  ScrollShadow,
  Chip,
  Divider,
} from "@heroui/react";
import {
  MessageCircleIcon,
  SendIcon,
  SparklesIcon,
  UserIcon,
  BotIcon,
  CheckCircleIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface JobFormData {
  title: string;
  description: string;
  decision: string;
  location: string;
  experienceLevel: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  skills: string[];
  requirements: string[];
  benefits: string[];
  deadline: string;
  isPublic: boolean;
  status: string;
}

interface JobAiChatProps {
  onDataGenerated: (data: JobFormData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobAiChat({
  onDataGenerated,
  isOpen,
  onClose,
}: JobAiChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm here to help you create a job posting. Just describe the position you want to hire for - include details like job title, responsibilities, requirements, location, salary, and any other relevant information. I'll extract all the details and fill out the form for you!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Format conversation history, excluding the initial greeting
      const conversationHistory = messages
        .slice(1) // Skip the initial assistant greeting
        .concat(userMessage) // Add the current message
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch("/api/jobs/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate job data");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Perfect! I've extracted the job details from your description. The form will be filled automatically with the information I found. You can review and edit any details as needed.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Pass the generated data to the parent component
      onDataGenerated(result.jobData);

      toast.success("Job form filled successfully!");

      // Close the chat after a brief delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I encountered an error while processing your request. Please try describing the job in a different way or check your internet connection.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate job data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    "I need to hire a Senior Software Engineer for our startup in San Francisco",
    "Looking for a Marketing Manager to join our remote team",
    "We're hiring a Data Scientist with Python and ML experience",
    "Need a Product Designer for our fintech company in New York",
  ];

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Job Assistant</h3>
          </div>
          <Button isIconOnly variant="light" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>

        <CardBody className="flex flex-col flex-1 p-0">
          {/* Messages */}
          <ScrollShadow className="flex-1 p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="flex-shrink-0">
                  {message.role === "user" ? (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <BotIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-default-100"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <BotIcon className="h-4 w-4 text-white" />
                </div>
                <div className="bg-default-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin">
                      <SparklesIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      Analyzing your job description...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </ScrollShadow>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="p-4 border-t">
              <p className="text-sm text-default-600 mb-3">
                Try these examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Chip
                    key={index}
                    variant="flat"
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => handleSuggestedPrompt(prompt)}
                  >
                    {prompt}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Describe the job you want to post..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                isDisabled={loading}
                startContent={
                  <MessageCircleIcon className="h-4 w-4 text-default-400" />
                }
              />
              <Button
                color="primary"
                isIconOnly
                onClick={handleSendMessage}
                isDisabled={!input.trim() || loading}
                isLoading={loading}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
