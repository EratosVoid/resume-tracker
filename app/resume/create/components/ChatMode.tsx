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
  Chip,
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
  CheckCircleIcon,
} from "lucide-react";

interface ChatMessage {
  id: number;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
  requiresProof?: boolean;
  proofFor?: string;
  isComplete?: boolean;
  isFollowUp?: boolean;
}

interface Skill {
  name: string;
  proof: string;
  validated: boolean;
}

interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

interface Education {
  school: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa?: string;
  honors?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  achievements: string[];
}

interface Achievement {
  title: string;
  description: string;
  date: string;
  proof?: string;
}

interface FormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  targetRole: string;
  experience: string;
  skills: Skill[];
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  achievements: Achievement[];
}

interface ChatModeProps {
  onBack: () => void;
  onGenerateResume: (collectedData: FormData) => void;
  isGenerating: boolean;
}

interface ConversationState {
  phase:
    | "personal"
    | "role"
    | "skills"
    | "experience"
    | "education"
    | "projects"
    | "achievements"
    | "complete";
  currentSection: string;
  needsFollowUp: boolean;
  lastResponse: string;
}

export default function ChatMode({
  onBack,
  onGenerateResume,
  isGenerating,
}: ChatModeProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>(
    {
      phase: "personal",
      currentSection: "fullName",
      needsFollowUp: false,
      lastResponse: "",
    }
  );
  const [collectedData, setCollectedData] = useState<FormData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
    },
    targetRole: "",
    experience: "",
    skills: [],
    workExperience: [],
    education: [],
    projects: [],
    achievements: [],
  });
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

  const getProgressValue = () => {
    const phases = [
      "personal",
      "role",
      "skills",
      "experience",
      "education",
      "projects",
      "achievements",
      "complete",
    ];
    const currentPhaseIndex = phases.indexOf(conversationState.phase);
    return (currentPhaseIndex / (phases.length - 1)) * 100;
  };

  const initializeChat = () => {
    const initialMessage: ChatMessage = {
      id: Date.now(),
      type: "ai" as const,
      content:
        "Hi! I'm Lucy your AI resume assistant. I'll help you create a compelling, ATS-optimized resume through an intelligent conversation. Let's start with the basics - what's your full name?",
      timestamp: new Date(),
    };
    setChatMessages([initialMessage]);
  };

  const generateNextQuestion = async (
    userResponse: string,
    currentPhase: string,
    currentSection: string
  ) => {
    try {
      // Build full conversation history for context
      const conversationHistory = chatMessages
        .map((msg) => `${msg.type.toUpperCase()}: ${msg.content}`)
        .join("\n");

      const prompt = `You are Lucy, an expert resume consultant conducting an intelligent interview to gather resume information. 

FULL CONVERSATION HISTORY:
${conversationHistory}
USER: ${userResponse}

CURRENT STATE:
- Phase: ${currentPhase}
- Section: ${currentSection}
- Collected Data: ${JSON.stringify(collectedData, null, 2)}

PHASES TO COMPLETE (in order):
1. personal - fullName, email, phone, location, linkedin (optional), portfolio (optional)
2. role - targetRole and experience level (entry/mid/senior/lead)
3. skills - technical/professional skills with validation/proof
4. experience - detailed work experience with company, title, dates, achievements
5. education - degrees, schools, graduation dates, GPA, honors
6. projects - project names, descriptions, technologies, links, achievements
7. achievements - professional accomplishments with dates and proof
8. complete - all data collected, ready to generate resume

INTELLIGENT RULES:
- NEVER repeat questions already asked in conversation history
- NEVER ask for information already provided by the user
- Analyze the user's response and extract relevant information
- Ask follow-up questions only if information is incomplete or unclear
- Move to next logical question based on what's missing
- For complex sections (experience, projects, achievements), ask if they have more to add
- Always be encouraging and conversational
- If user provides multiple pieces of info in one response, acknowledge all and ask for the next missing piece
- When a phase is complete, smoothly transition to the next phase
- If you have enough information for a professional resume, suggest generating it

RESPONSE FORMAT:
Respond with ONLY the next question or statement, nothing else. Be natural and conversational.`;

      const response = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();
      return (
        data.response ||
        "I'm having trouble connecting to my knowledge base right now. Could you try again in a moment? I want to make sure I give you the best possible guidance for your resume."
      );
    } catch (error) {
      console.error("Error generating question:", error);
      return "Could you tell me more about that?";
    }
  };

  const updateConversationState = async (userResponse: string) => {
    try {
      // Use Gemini to determine the next conversation state
      const statePrompt = `Based on the conversation and user response, determine the next conversation state.

CONVERSATION:
${chatMessages
  .map((msg) => `${msg.type.toUpperCase()}: ${msg.content}`)
  .join("\n")}
USER: ${userResponse}

CURRENT STATE: ${conversationState.phase} - ${conversationState.currentSection}

PHASES: personal -> role -> skills -> experience -> education -> projects -> achievements -> complete

Analyze what information is still needed and return JSON:
{
  "phase": "string (current phase or next phase)",
  "currentSection": "string (specific field being collected)",
  "needsFollowUp": boolean,
  "reasoning": "string (why this state was chosen)"
}

Return ONLY the JSON object.`;

      const response = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: statePrompt }),
      });

      if (!response.ok) throw new Error("Failed to update state");

      const data = await response.json();

      try {
        // Clean the response to handle markdown formatting
        let cleanResponse = data.response.trim();

        // Remove markdown code blocks if present
        if (cleanResponse.startsWith("```json")) {
          cleanResponse = cleanResponse
            .replace(/^```json\s*/, "")
            .replace(/\s*```$/, "");
        } else if (cleanResponse.startsWith("```")) {
          cleanResponse = cleanResponse
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "");
        }

        const newState = JSON.parse(cleanResponse);
        setConversationState((prev) => ({
          ...prev,
          phase: newState.phase || prev.phase,
          currentSection: newState.currentSection || prev.currentSection,
          needsFollowUp: newState.needsFollowUp || false,
          lastResponse: userResponse,
        }));
      } catch (parseError) {
        console.error("Error parsing state update:", parseError);
        console.log("Raw state response:", data.response);
      }
    } catch (error) {
      console.error("Error updating conversation state:", error);
    }
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

    const currentResponse = userInput;
    setUserInput("");
    setIsAiTyping(true);

    try {
      // Update conversation state based on context
      await updateConversationState(currentResponse);

      // Generate next question using full conversation context
      const nextQuestion = await generateNextQuestion(
        currentResponse,
        conversationState.phase,
        conversationState.currentSection
      );

      // Determine if conversation is complete
      const isComplete =
        nextQuestion.toLowerCase().includes("generate") ||
        nextQuestion.toLowerCase().includes("complete") ||
        nextQuestion.toLowerCase().includes("ready") ||
        conversationState.phase === "complete";

      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai" as const,
            content: nextQuestion,
            timestamp: new Date(),
            isComplete: isComplete,
          },
        ]);

        setIsAiTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Error in chat:", error);
      setIsAiTyping(false);
    }
  };

  const handleProofSubmission = async (
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

    // Clear the proof input for this message
    setProofInputs((prev) => ({
      ...prev,
      [messageId]: "",
    }));

    setIsAiTyping(true);

    try {
      // Generate follow-up question using Gemini
      const nextQuestion = await generateNextQuestion(
        `Proof: ${proofValue}`,
        conversationState.phase,
        conversationState.currentSection
      );

      const isComplete =
        nextQuestion.toLowerCase().includes("generate") ||
        nextQuestion.toLowerCase().includes("complete");

      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai" as const,
            content: nextQuestion,
            timestamp: new Date(),
            isComplete: isComplete,
          },
        ]);
        setIsAiTyping(false);
      }, 500);
    } catch (error) {
      console.error("Error handling proof:", error);
      setIsAiTyping(false);
    }
  };

  const extractAllDataFromConversation = async (): Promise<FormData> => {
    const fullConversation = chatMessages
      .map((msg) => `${msg.type.toUpperCase()}: ${msg.content}`)
      .join("\n");

    const extractionPrompt = `You are a resume data extraction expert. Analyze this complete conversation and extract ALL resume information into a structured format.

FULL CONVERSATION:
${fullConversation}

Extract and organize ALL information mentioned in the conversation into this exact JSON structure:

{
  "personalInfo": {
    "fullName": "string",
    "email": "string", 
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "portfolio": "string"
  },
  "targetRole": "string",
  "experience": "string (entry/mid/senior/lead)",
  "skills": [{"name": "string", "proof": "string", "validated": true}],
  "workExperience": [{"company": "string", "title": "string", "startDate": "string", "endDate": "string", "description": "string", "achievements": ["string"]}],
  "education": [{"school": "string", "degree": "string", "field": "string", "graduationYear": "string", "gpa": "string", "honors": "string"}],
  "projects": [{"name": "string", "description": "string", "technologies": ["string"], "link": "string", "github": "string", "achievements": ["string"]}],
  "achievements": [{"title": "string", "description": "string", "date": "string", "proof": "string"}]
}

EXTRACTION RULES:
- Extract ALL information mentioned throughout the conversation
- For skills, include any technologies, programming languages, tools mentioned
- For work experience, include all jobs, internships, roles discussed
- For education, include degrees, certifications, courses mentioned
- For projects, include any personal/professional projects described
- For achievements, include awards, recognitions, accomplishments mentioned
- Use empty strings for missing required fields, empty arrays for missing arrays
- Be thorough - don't miss any details from the conversation
- If dates are mentioned as "current" or "present", use "Present"
- If specific dates aren't given, make reasonable estimates based on context

CRITICAL: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text. Do not wrap in \`\`\`json or any other formatting.`;

    try {
      const response = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: extractionPrompt }),
      });

      if (!response.ok) throw new Error("Failed to extract data");

      const data = await response.json();

      // Clean the response to handle markdown formatting
      let cleanResponse = data.response.trim();

      // Remove markdown code blocks if present
      if (cleanResponse.startsWith("```json")) {
        cleanResponse = cleanResponse
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanResponse.startsWith("```")) {
        cleanResponse = cleanResponse
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      const extractedData = JSON.parse(cleanResponse);
      console.log("Final extracted data:", extractedData);

      return extractedData;
    } catch (error) {
      console.error("Error extracting final data:", error);
      // Return empty structure if extraction fails
      return {
        personalInfo: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          portfolio: "",
        },
        targetRole: "",
        experience: "",
        skills: [],
        workExperience: [],
        education: [],
        projects: [],
        achievements: [],
      };
    }
  };

  const handleGenerateClick = async () => {
    try {
      // Extract all data from the conversation at once
      const finalData = await extractAllDataFromConversation();
      onGenerateResume(finalData);
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-default-50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-default-200">
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

          <div className="mt-4 space-y-3">
            <Progress
              value={
                chatMessages.some((msg) => msg.isComplete)
                  ? 100
                  : getProgressValue()
              }
              color="primary"
              className="max-w-md"
              showValueLabel={true}
              label="Progress"
            />

            {/* Conversation Progress Status */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Current phase indicator */}
              <Chip
                size="sm"
                color="primary"
                variant="flat"
                startContent={<MessageCircleIcon className="h-3 w-3" />}
              >
                {conversationState.phase === "personal" &&
                  "Collecting Personal Info"}
                {conversationState.phase === "role" && "Discussing Target Role"}
                {conversationState.phase === "skills" && "Exploring Skills"}
                {conversationState.phase === "experience" && "Work Experience"}
                {conversationState.phase === "education" &&
                  "Education Background"}
                {conversationState.phase === "projects" &&
                  "Projects & Portfolio"}
                {conversationState.phase === "achievements" &&
                  "Achievements & Awards"}
                {conversationState.phase === "complete" && "Ready to Generate"}
              </Chip>

              {/* Messages count */}
              <Chip size="sm" color="default" variant="bordered">
                {chatMessages.length} messages
              </Chip>

              {/* Completion indicator */}
              {chatMessages.some((msg) => msg.isComplete) && (
                <Chip
                  size="sm"
                  color="success"
                  variant="dot"
                  startContent={<CheckCircleIcon className="h-3 w-3" />}
                >
                  Ready to Generate
                </Chip>
              )}
            </div>
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
