import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import Job from "@/lib/models/Job";
import Resume from "@/lib/models/Resume";
import Submission from "@/lib/models/Submission";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Ensure all models are registered
    User;
    Job;
    Resume;
    Submission;

    // Find user first
    const user = await User.findOne({
      email: session.user.email?.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user scores before returning dashboard data
    try {
      await (User as any).updateUserScores((user as any)._id.toString());
      console.log(`Updated user scores for dashboard: ${(user as any)._id}`);
    } catch (error) {
      console.error("Error updating user scores for dashboard:", error);
    }

    // Find resume profile by userId
    let resume = await Resume.findOne({
      userId: user._id,
    }).populate({
      path: "resumeVersions.atsScores.jobId",
      model: Job,
      select: "title",
    });

    // If no resume profile exists, create one
    if (!resume) {
      resume = await Resume.create({
        userId: user._id,
        isAnonymous: false,
        resumeVersions: [],
      });
    }

    // Get application submissions for this user (using userId and email)
    const submissions = await Submission.find({
      $or: [
        { userId: user._id },
        { resumeId: resume._id },
        { applicantEmail: session.user.email?.toLowerCase() },
      ],
    })
      .populate({
        path: "jobId",
        model: Job,
        select: "title description",
      })
      .sort({ submittedAt: -1 });

    // Calculate stats
    const resumeVersions = resume.resumeVersions || [];
    const totalResumes = resumeVersions.length;
    const totalApplications = submissions.length;
    const responseRate = 0; // This would need to be calculated based on recruiter responses

    // Get updated user data to get the calculated scores
    const updatedUser = await User.findById((user as any)._id);
    const averageScore = updatedUser?.averageScore || 0;
    const latestScore = updatedUser?.latestScore || 0;
    const improvement = updatedUser?.improvement || 0;

    // Transform resume versions for frontend
    const transformedResumeVersions = resumeVersions.map((resume: any) => ({
      _id: resume._id,
      parsedText: resume.parsedText,
      rawFileURL: resume.rawFileURL,
      fileName: resume.fileName,
      fileType: resume.fileType,
      shareableId: resume.shareableId || null, // Include shareable link
      isPublic: resume.isPublic || false, // Include public status
      atsScores: resume.atsScores.map((score: any) => ({
        jobId: score.jobId?._id || score.jobId,
        jobTitle: score.jobId?.title || "Unknown Job",
        score: score.score,
        keywordsMatched: score.keywordsMatched || [],
        skillsMatched: score.skillsMatched || [],
        createdAt: score.createdAt,
      })),
      createdAt: resume.createdAt,
    }));

    // Transform applications for frontend
    const transformedApplications = submissions.map((submission: any) => ({
      _id: submission._id,
      jobId: submission.jobId?._id,
      jobTitle: submission.jobId?.title || "Unknown Job",
      companyName:
        submission.jobId?.description?.split("\n")[0] || "Unknown Company", // Extract company from description if available
      atsScore: submission.atsScore || 0,
      status: submission.status || "pending",
      submittedAt: submission.submittedAt,
      feedback: submission.feedback,
    }));

    return NextResponse.json({
      stats: {
        totalResumes,
        averageScore,
        latestScore,
        improvement,
        totalApplications,
        responseRate,
      },
      resumeVersions: transformedResumeVersions,
      applications: transformedApplications,
    });
  } catch (error) {
    console.error("Error fetching applicant dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// POST endpoint to save/update resume versions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeData, atsScore, jobId, creationMode } = body;

    await connectDB();

    // Ensure all models are registered
    User;
    Job;
    Resume;
    Submission;

    // Find user first
    const user = await User.findOne({
      email: session.user.email?.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find or create resume profile
    let resume = await Resume.findOne({
      userId: user._id,
    });

    if (!resume) {
      resume = await Resume.create({
        userId: user._id,
        isAnonymous: false,
        resumeVersions: [],
      });
    }

    // Create new resume version with atsScore
    const newResumeVersion: any = {
      parsedText: resumeData.parsedText || JSON.stringify(resumeData),
      rawFileURL: resumeData.rawFileURL,
      fileName: resumeData.fileName,
      fileType: resumeData.fileType,
      atsScore: atsScore || 0, // Add direct atsScore field
      creationMode: creationMode || "manual", // Add creation mode (upload, manual, etc.)
      atsScores: [],
      createdAt: new Date(),
    };

    // Add atsScore entry if score is provided
    if (atsScore && typeof atsScore === "number") {
      const atsScoreEntry: any = {
        score: atsScore,
        keywordsMatched: resumeData.keywordsMatched || [],
        skillsMatched: resumeData.skillsMatched || [],
        experienceYears: resumeData.experienceYears || 0,
        createdAt: new Date(),
      };

      // If jobId is provided, include it (job-specific analysis)
      if (jobId) {
        atsScoreEntry.jobId = jobId;
      }
      // If no jobId, this is a general resume analysis (still track the score)

      newResumeVersion.atsScores.push(atsScoreEntry);
    }

    resume.resumeVersions.push(newResumeVersion);
    await resume.save();

    // Update user scores after saving resume
    try {
      await (User as any).updateUserScores((user as any)._id.toString());
      console.log(
        `Updated user scores after saving resume: ${(user as any)._id}`
      );
    } catch (error) {
      console.error("Error updating user scores after saving resume:", error);
    }

    return NextResponse.json({
      success: true,
      resumeVersionId: newResumeVersion,
    });
  } catch (error) {
    console.error("Error saving resume version:", error);
    return NextResponse.json(
      { error: "Failed to save resume version" },
      { status: 500 }
    );
  }
}
