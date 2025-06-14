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

    // Calculate average ATS score across all resume versions and applications
    let totalScores = 0;
    let scoreCount = 0;

    resumeVersions.forEach((resume: any) => {
      resume.atsScores.forEach((score: any) => {
        totalScores += score.score;
        scoreCount++;
      });
    });

    submissions.forEach((submission: any) => {
      if (submission.atsScore) {
        totalScores += submission.atsScore;
        scoreCount++;
      }
    });

    const averageScore =
      scoreCount > 0 ? Math.round(totalScores / scoreCount) : 0;
    const totalApplications = submissions.length;
    const responseRate = 0; // This would need to be calculated based on recruiter responses

    // Transform resume versions for frontend
    const transformedResumeVersions = resumeVersions.map((resume: any) => ({
      _id: resume._id,
      parsedText: resume.parsedText,
      rawFileURL: resume.rawFileURL,
      fileName: resume.fileName,
      fileType: resume.fileType,
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
    const { resumeData, atsScore, jobId } = body;

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
