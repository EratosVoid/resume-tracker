import { GoogleGenerativeAI } from "@google/generative-ai";
import { IParsedResumeData } from "../models/Submission";
import { IJob } from "../models/Job";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface GeminiAnalysisResult {
  parsedData: IParsedResumeData;
  atsScore: number;
  analysis: {
    skillsMatched: string[];
    skillsMissing: string[];
    experienceMatch: number;
    improvementSuggestions: string[];
    strengthsIdentified: string[];
  };
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async parseResume(resumeText: string): Promise<IParsedResumeData> {
    const prompt = `
    Extract structured data from this resume text. Return a JSON object with the following structure:
    {
      "name": "Full name",
      "email": "Email address",
      "phone": "Phone number",
      "skills": ["skill1", "skill2", ...],
      "experience": [
        {
          "company": "Company name",
          "position": "Job title",
          "duration": "Duration (e.g., 2020-2023)",
          "description": "Brief description"
        }
      ],
      "education": [
        {
          "institution": "School/University name",
          "degree": "Degree type and field",
          "year": "Graduation year"
        }
      ],
      "certifications": ["cert1", "cert2", ...],
      "summary": "Brief professional summary",
      "totalExperienceYears": number
    }

    Resume text:
    ${resumeText}

    Please extract all available information and calculate total experience years based on the work history. If information is not available, use empty arrays or null values appropriately.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const parsedData = JSON.parse(jsonMatch[0]);

      // Validate and sanitize the parsed data
      return this.validateParsedData(parsedData);
    } catch (error) {
      console.error("Error parsing resume with Gemini:", error);
      // Return basic fallback data
      return this.createFallbackData(resumeText);
    }
  }

  async analyzeResumeForJob(
    resumeText: string,
    jobData: IJob,
    parsedResumeData?: IParsedResumeData
  ): Promise<GeminiAnalysisResult> {
    // If we don't have parsed data, parse it first
    const parsedData = parsedResumeData || (await this.parseResume(resumeText));

    const prompt = `
    Analyze this resume against the job description and provide a comprehensive ATS analysis.

    Job Description:
    Title: ${jobData.title}
    Description: ${jobData.description}
    Required Skills: ${jobData.skills?.join(", ") || "Not specified"}
    Experience Level: ${jobData.experienceLevel || "Not specified"}
    Requirements: ${jobData.requirements?.join(", ") || "Not specified"}

    Resume Data:
    Name: ${parsedData.name}
    Skills: ${parsedData.skills.join(", ")}
    Total Experience: ${parsedData.totalExperienceYears} years
    Summary: ${parsedData.summary}

    Please provide analysis in this JSON format:
    {
      "atsScore": number (0-100),
      "skillsMatched": ["skill1", "skill2"],
      "skillsMissing": ["missing1", "missing2"],
      "experienceMatch": number (0-100),
      "improvementSuggestions": ["suggestion1", "suggestion2"],
      "strengthsIdentified": ["strength1", "strength2"]
    }

    Consider:
    1. Skill matching (40% weight)
    2. Experience relevance (30% weight)
    3. Education alignment (15% weight)
    4. Overall fit (15% weight)

    Be thorough in your analysis and provide actionable feedback.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in analysis response");
      }

      const analysis = JSON.parse(jsonMatch[0]);

      return {
        parsedData,
        atsScore: Math.min(100, Math.max(0, analysis.atsScore || 0)),
        analysis: {
          skillsMatched: analysis.skillsMatched || [],
          skillsMissing: analysis.skillsMissing || [],
          experienceMatch: Math.min(
            100,
            Math.max(0, analysis.experienceMatch || 0)
          ),
          improvementSuggestions: analysis.improvementSuggestions || [],
          strengthsIdentified: analysis.strengthsIdentified || [],
        },
      };
    } catch (error) {
      console.error("Error analyzing resume with Gemini:", error);
      // Return fallback analysis
      return this.createFallbackAnalysis(parsedData, jobData);
    }
  }

  private validateParsedData(data: any): IParsedResumeData {
    return {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      skills: Array.isArray(data.skills) ? data.skills : [],
      experience: Array.isArray(data.experience)
        ? data.experience.map((exp: any) => ({
            company: exp.company || "",
            position: exp.position || "",
            duration: exp.duration || "",
            description: exp.description || "",
          }))
        : [],
      education: Array.isArray(data.education)
        ? data.education.map((edu: any) => ({
            institution: edu.institution || "",
            degree: edu.degree || "",
            year: edu.year || "",
          }))
        : [],
      certifications: Array.isArray(data.certifications)
        ? data.certifications
        : [],
      summary: data.summary || "",
      totalExperienceYears:
        typeof data.totalExperienceYears === "number"
          ? data.totalExperienceYears
          : 0,
    };
  }

  private createFallbackData(resumeText: string): IParsedResumeData {
    // Basic text analysis as fallback
    const emailMatch = resumeText.match(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    );
    const phoneMatch = resumeText.match(
      /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/
    );

    return {
      name: "",
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      summary: resumeText.substring(0, 200) + "...",
      totalExperienceYears: 0,
    };
  }

  private createFallbackAnalysis(
    parsedData: IParsedResumeData,
    jobData: IJob
  ): GeminiAnalysisResult {
    // Basic fallback analysis
    const jobSkills = jobData.skills || [];
    const resumeSkills = parsedData.skills || [];

    const skillsMatched = jobSkills.filter((skill) =>
      resumeSkills.some(
        (resumeSkill) =>
          resumeSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(resumeSkill.toLowerCase())
      )
    );

    const matchPercentage =
      jobSkills.length > 0
        ? (skillsMatched.length / jobSkills.length) * 100
        : 50;
    const atsScore = Math.round(
      matchPercentage * 0.6 + parsedData.totalExperienceYears * 5
    );

    return {
      parsedData,
      atsScore: Math.min(100, Math.max(0, atsScore)),
      analysis: {
        skillsMatched,
        skillsMissing: jobSkills.filter(
          (skill) => !skillsMatched.includes(skill)
        ),
        experienceMatch: Math.min(100, parsedData.totalExperienceYears * 20),
        improvementSuggestions: [
          "Unable to generate detailed suggestions due to API limitations",
        ],
        strengthsIdentified: ["Basic resume parsing completed"],
      },
    };
  }
}

export const geminiService = new GeminiService();
