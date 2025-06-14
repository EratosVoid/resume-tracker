import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import Applicant from "@/lib/models/Applicant";
import Submission from "@/lib/models/Submission";
import Job from "@/lib/models/Job";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find user first
    const user = await User.findOne({
      email: session.user.email?.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find applicant profile by userId
    let applicant = await Applicant.findOne({
      userId: user._id,
    }).populate({
      path: "resumeVersions.atsScores.jobId",
      model: "Job",
      select: "title",
    });

    // If no applicant profile exists, create one
    if (!applicant) {
      applicant = await Applicant.create({
        userId: user._id,
        isAnonymous: false,
        resumeVersions: [],
      });
    }

    // Get application submissions for this applicant
    const submissions = await Submission.find({
      $or: [
        { applicantId: applicant._id },
        { applicantEmail: session.user.email?.toLowerCase() },
      ],
    })
      .populate("jobId", "title description")
      .sort({ submittedAt: -1 });

    // Calculate stats
    const resumeVersions = applicant.resumeVersions || [];
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

    // Find user first
    const user = await User.findOne({
      email: session.user.email?.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find or create applicant profile
    let applicant = await Applicant.findOne({
      userId: user._id,
    });

    if (!applicant) {
      applicant = await Applicant.create({
        userId: user._id,
        isAnonymous: false,
        resumeVersions: [],
      });
    }

    // Create new resume version
    const newResumeVersion = {
      parsedText: resumeData.parsedText || JSON.stringify(resumeData),
      rawFileURL: resumeData.rawFileURL,
      fileName: resumeData.fileName,
      fileType: resumeData.fileType,
      atsScores:
        jobId && atsScore
          ? [
              {
                jobId: jobId,
                score: atsScore,
                keywordsMatched: [],
                skillsMatched: [],
                createdAt: new Date(),
              },
            ]
          : [],
      createdAt: new Date(),
    };

    applicant.resumeVersions.push(newResumeVersion);
    await applicant.save();

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
