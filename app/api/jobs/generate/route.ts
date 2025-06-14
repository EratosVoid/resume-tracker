import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !messages.length) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Combine all user messages into a single context
    interface Message {
      role: "user" | "assistant" | string;
      content: string;
    }

    const conversationContext = (messages as Message[])
      .filter((msg: Message) => msg.role === "user")
      .map((msg: Message) => msg.content)
      .join("\n\n");

    const prompt = `
You are a job posting assistant. Extract structured data from the following job description and return it as a JSON object with the exact structure below.Consider all the information provided across multiple messages. If any field cannot be determined from the input, leave it empty or use reasonable defaults.

Conversation Context:
${conversationContext}

Return ONLY a valid JSON object with this exact structure:
{
  "title": "string - job title",
  "description": "string - detailed job description",
  "location": "string - job location",
  "experienceLevel": "string - one of: entry, mid, senior, executive",
  "employmentType": "string - one of: full-time, part-time, contract, internship, freelance",
  "salaryMin": "string - minimum salary as number string",
  "salaryMax": "string - maximum salary as number string", 
  "salaryCurrency": "string - one of: USD, EUR, GBP, INR",
  "skills": ["array of required skills as strings"],
  "requirements": ["array of job requirements as strings"],
  "benefits": ["array of benefits offered as strings"],
  "deadline": "string - application deadline in YYYY-MM-DD format if mentioned",
  "isPublic": true,
  "status": "active"
}

Make sure to:
- Extract relevant skills from the job description
- Break down requirements into separate items
- Include benefits if mentioned
- Use reasonable salary ranges if mentioned
- Keep descriptions professional and detailed
- Default to "active" status and public visibility
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from the response
    let jobData;
    try {
      // Remove any markdown formatting if present
      const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
      jobData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json(
        { error: "Failed to parse job data from AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ jobData });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate job data" },
      { status: 500 }
    );
  }
}
