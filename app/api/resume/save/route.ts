import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Resume from "@/lib/models/Resume";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      userId, // Optional - for authenticated users
      structuredData,
      generatedResume,
      creationMode,
      atsScore,
      isPublic = false,
      isAnonymous = false,
    } = body;

    // Validate required fields
    if (!structuredData || !generatedResume || !creationMode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique shareable ID
    const shareableId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Create resume version object
    const resumeVersion = {
      structuredData,
      generatedResume,
      creationMode,
      atsScore: atsScore || 0,
      shareableId,
      isPublic,
      atsScores: [],
      createdAt: new Date(),
    };

    let resume;

    if (userId && !isAnonymous) {
      // For authenticated users, find or create their resume profile
      resume = await Resume.findOne({ userId });

      if (resume) {
        // Add new version to existing resume
        resume.resumeVersions.push(resumeVersion);
        await resume.save();
      } else {
        // Create new resume profile for user
        resume = new Resume({
          userId,
          resumeVersions: [resumeVersion],
          isAnonymous: false,
        });
        await resume.save();
      }
    } else {
      // For anonymous users, create a standalone resume
      resume = new Resume({
        resumeVersions: [resumeVersion],
        isAnonymous: true,
      });
      await resume.save();
    }

    // Get the saved resume version (last one added)
    const savedVersion =
      resume.resumeVersions[resume.resumeVersions.length - 1];

    return NextResponse.json({
      success: true,
      resumeId: resume._id,
      versionId: savedVersion._id,
      shareableId: savedVersion.shareableId,
      shareUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/resume/share/${savedVersion.shareableId}`,
      message: "Resume saved successfully",
    });
  } catch (error) {
    console.error("Error saving resume:", error);
    return NextResponse.json(
      { error: "Failed to save resume" },
      { status: 500 }
    );
  }
}
