import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import Resume from "@/lib/models/Resume";
import { GeminiService } from "@/lib/services/gemini";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

interface Skill {
  name: string;
  proof: string;
  validated: boolean;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  targetRole: string;
  experience: string;
  skills: Skill[];
  workExperience: any[];
  education: any[];
  projects: any[];
  achievements: any[];
}

interface RequestBody {
  data: ResumeData;
  mode: "chat" | "form";
  collectedData?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { data, mode, collectedData } = body;
    
    // Initialize GeminiService for analysis
    const geminiService = new GeminiService();

    // Get ATS analysis using existing method
    const analysis = await geminiService.analyzeGeneratedResume(data);

    // Generate resume data using existing functions
    const generatedResume = {
      personalInfo: data.personalInfo,
      summary: data.summary,
      experience: data.workExperience,
      education: data.education,
      skills: data.skills?.map((skill: any) => skill.name),
      projects: data.projects,
      achievements: data.achievements,
    };

    // Save resume if user is logged in (existing functionality)
    if (session?.user?.email) {
      // ...existing code for saving resume...
    }

    return NextResponse.json({
      success: true,
      resume: generatedResume,
      atsScore: analysis.atsScore,
      metadata: {
        generatedAt: new Date().toISOString(),
        mode: mode,
      }
    });

  } catch (error) {
    console.error('Resume generation error:', error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}

function generateSummary(data: ResumeData): string {
  const { personalInfo, targetRole, experience } = data;
  return `Experienced ${targetRole} with ${experience} of professional experience. Proven track record of delivering high-quality results and driving business growth.`;
}

function formatExperience(workExperience: any[]): any[] {
  return workExperience.map((exp) => {
    if (typeof exp === "string") {
      return { description: exp };
    }
    return exp;
  });
}

function formatEducation(education: any[]): any[] {
  return education.map((edu) => {
    if (typeof edu === "string") {
      return { description: edu };
    }
    return edu;
  });
}

function formatProjects(projects: any[]): any[] {
  return projects.map((project) => {
    if (typeof project === "string") {
      return { description: project };
    }
    return project;
  });
}

function formatAchievements(achievements: any[]): any[] {
  return achievements.map((achievement) => {
    if (typeof achievement === "string") {
      return { description: achievement };
    }
    return achievement;
  });
}

function calculateATSScore(data: ResumeData): number {
  let score = 0;

  // Personal info completeness (25 points)
  const requiredPersonalFields = [
    data.personalInfo.fullName,
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
  ].filter(Boolean);
  const optionalPersonalFields = [
    data.personalInfo.linkedin,
    data.personalInfo.portfolio,
  ].filter(Boolean);

  // Required fields (20 points)
  score += (requiredPersonalFields.length / 4) * 20;
  // Optional fields (5 points)
  score += (optionalPersonalFields.length / 2) * 5;

  // Target role (15 points)
  if (data.targetRole && data.targetRole.trim()) score += 15;

  // Experience level (10 points)
  if (data.experience && data.experience.trim()) score += 10;

  // Skills (20 points)
  if (data.skills.length > 0) {
    // Base points for having skills
    score += 10;
    // Bonus for validated skills
    const validatedSkills = data.skills.filter((s) => s.validated).length;
    if (data.skills.length > 0) {
      score += (validatedSkills / data.skills.length) * 10;
    }
  }

  // Work experience (15 points)
  if (
    data.workExperience.length > 0 &&
    data.workExperience.some((exp) => exp && exp.toString().trim())
  ) {
    score += 15;
  }

  // Education (10 points)
  if (
    data.education.length > 0 &&
    data.education.some((edu) => edu && edu.toString().trim())
  ) {
    score += 10;
  }

  // Projects (10 points)
  if (
    data.projects.length > 0 &&
    data.projects.some((proj) => proj && proj.toString().trim())
  ) {
    score += 10;
  }

  // Achievements (5 points)
  if (
    data.achievements.length > 0 &&
    data.achievements.some((ach) => ach && ach.toString().trim())
  ) {
    score += 5;
  }

  // Debug logging
  console.log("ATS Score calculation:", {
    personalInfo:
      (requiredPersonalFields.length / 4) * 20 +
      (optionalPersonalFields.length / 2) * 5,
    targetRole: data.targetRole ? 15 : 0,
    experience: data.experience ? 10 : 0,
    skills:
      data.skills.length > 0
        ? 10 +
          (data.skills.filter((s) => s.validated).length / data.skills.length) *
            10
        : 0,
    workExperience: data.workExperience.length > 0 ? 15 : 0,
    education: data.education.length > 0 ? 10 : 0,
    projects: data.projects.length > 0 ? 10 : 0,
    achievements: data.achievements.length > 0 ? 5 : 0,
    total: score,
  });

  return Math.min(Math.round(score), 100);
}
