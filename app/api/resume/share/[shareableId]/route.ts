import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Resume from "@/lib/models/Resume";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareableId: string }> }
) {
  try {
    await connectDB();

    const { shareableId } = await params;

    if (!shareableId) {
      return NextResponse.json(
        { error: "Shareable ID is required" },
        { status: 400 }
      );
    }

    // Find resume with the matching shareable ID
    const resume = await Resume.findOne({
      "resumeVersions.shareableId": shareableId,
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Find the specific version with the shareable ID
    const resumeVersion = resume.resumeVersions.find(
      (version: any) => version.shareableId === shareableId
    );

    if (!resumeVersion) {
      return NextResponse.json(
        { error: "Resume version not found" },
        { status: 404 }
      );
    }

    // Check if the resume is public or if it's accessible
    if (!resumeVersion.isPublic) {
      return NextResponse.json(
        { error: "This resume is not publicly accessible" },
        { status: 403 }
      );
    }

    // Return the resume data
    return NextResponse.json({
      success: true,
      resume: {
        personalInfo: resumeVersion.generatedResume?.personalInfo,
        summary: resumeVersion.generatedResume?.summary,
        experience: resumeVersion.generatedResume?.experience,
        education: resumeVersion.generatedResume?.education,
        skills: resumeVersion.generatedResume?.skills,
        projects: resumeVersion.generatedResume?.projects,
        achievements: resumeVersion.generatedResume?.achievements,
      },
      atsScore: resumeVersion.atsScore,
      metadata: {
        generatedAt: resumeVersion.createdAt,
        mode: resumeVersion.creationMode,
        validated:
          resumeVersion.structuredData?.skills?.filter((s: any) => s.validated)
            .length || 0,
        totalSections: [
          resumeVersion.generatedResume?.experience?.length > 0,
          resumeVersion.generatedResume?.education?.length > 0,
          resumeVersion.generatedResume?.skills?.length > 0,
          resumeVersion.generatedResume?.projects?.length > 0,
          resumeVersion.generatedResume?.achievements?.length > 0,
        ].filter(Boolean).length,
      },
    });
  } catch (error) {
    console.error("Error fetching shared resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { shareableId: string } }
) {
  try {
    await connectDB();

    const { shareableId } = params;
    const body = await request.json();
    const { isPublic } = body;

    if (!shareableId) {
      return NextResponse.json(
        { error: "Shareable ID is required" },
        { status: 400 }
      );
    }

    // Find and update the resume version's public status
    const resume = await Resume.findOneAndUpdate(
      { "resumeVersions.shareableId": shareableId },
      { $set: { "resumeVersions.$.isPublic": isPublic } },
      { new: true }
    );

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Resume ${isPublic ? "made public" : "made private"}`,
    });
  } catch (error) {
    console.error("Error updating resume visibility:", error);
    return NextResponse.json(
      { error: "Failed to update resume visibility" },
      { status: 500 }
    );
  }
}
