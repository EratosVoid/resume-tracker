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
You are an expert job posting assistant with deep knowledge of industry standards, compensation benchmarks, and hiring practices across multiple sectors. Your task is to extract and intelligently infer structured data from job descriptions, even when information is incomplete or scattered across conversation context.

CORE COMPETENCIES:
- Industry salary benchmarking and compensation analysis
- Role classification and experience level assessment  
- Skills taxonomy and requirement categorization
- Employment market trends and standard practices
- Geographic compensation variations
- Benefits package standardization

INTELLIGENT INFERENCE GUIDELINES:

1. TITLE EXTRACTION & STANDARDIZATION:
- Use industry-standard job titles when possible
- Infer title from responsibilities if not explicitly stated
- Standardize variations (e.g., "JS Developer" → "JavaScript Developer")
- Consider seniority indicators in description

2. EXPERIENCE LEVEL REASONING:
- "entry": 0-2 years, junior roles, internships, new grad positions
- "mid": 3-5 years, specialist roles, some leadership responsibility
- "senior": 5+ years, lead roles, mentoring responsibilities, strategic input
- "executive": C-level, VP, Director roles with P&L or major strategic responsibility
- Infer from: years mentioned, role responsibilities, leadership requirements, salary ranges

3. EMPLOYMENT TYPE DETECTION:
- Look for keywords: "permanent", "temporary", "contract", "consultant", "intern"
- Infer from context: project-based = contract, student programs = internship
- Default to "full-time" for standard professional roles

4. SALARY INTELLIGENCE:
- Research-backed ranges by role, experience, and location
- Consider: job title, experience level, location cost of living, industry sector
- Use conservative estimates when inferring
- Leave empty only if absolutely no indicators exist
- Account for geographic variations (e.g., SF vs remote vs international)

5. SKILLS EXTRACTION SOPHISTICATION:
- Extract both explicit and implied skills
- Include: technical skills, soft skills, tools, frameworks, methodologies
- Standardize skill names (e.g., "React.js" → "React", "AI/ML" → "Machine Learning")
- Infer related skills from job context (e.g., "frontend developer" → ["HTML", "CSS", "JavaScript"])

6. REQUIREMENTS CATEGORIZATION:
- Separate hard requirements from nice-to-haves
- Include: education, experience, certifications, specific achievements
- Break down compound requirements into individual items
- Infer standard requirements for role type if not explicitly stated

7. BENEFITS INFERENCE:
- Include explicitly mentioned benefits
- Infer standard benefits for company size/type when reasonable
- Categories: health, financial, time-off, professional development, perks
- Don't over-infer - be conservative with assumptions

8. LOCATION STANDARDIZATION:
- Use "City, State/Country" format
- Handle remote work indicators: "Remote", "Remote (US)", "Hybrid - City, State"
- Infer location constraints from context

QUALITY ASSURANCE RULES:
- NEVER fabricate specific details not reasonably inferable
- Use "reasonable defaults" only when strong contextual evidence exists
- Leave fields empty rather than making wild guesses
- Maintain professional tone and accuracy
- Cross-validate inferences against industry norms
- Prioritize accuracy over completeness

REASONING CHAIN:
For each field, follow this process:
1. Extract explicit information
2. Analyze contextual clues
3. Apply industry knowledge for reasonable inference
4. Validate against role/industry standards
5. Default to empty if confidence is low

Conversation Context:
${conversationContext}

RESPONSE REQUIREMENTS:
Return ONLY a valid JSON object with this exact structure (no additional text, explanations, or formatting):

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

CRITICAL: Ensure JSON is valid, parseable, and follows the exact structure above. Apply intelligent reasoning while maintaining conservative accuracy standards.
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
