import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/database";
import Job from "@/lib/models/Job";
import Submission from "@/lib/models/Submission";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { slug } = await params;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    // Find the job and verify ownership
    const job = await Job.findOne({
      slug: slug,
      createdBy: session.user.id,
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or unauthorized" },
        { status: 404 }
      );
    }

    // Build filter query
    const filter: any = { jobId: job._id };
    if (status && status !== "all") {
      filter.status = status;
    }

    // Get applications with pagination
    const applications = await Submission.find(filter)
      .sort({ atsScore: -1, submittedAt: -1 }) // Sort by ATS score first, then by date
      .skip(skip)
      .limit(limit)
      .populate("applicantId", "name email phone")
      .lean();

    const total = await Submission.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    // Transform the data to include applicant info
    const transformedApplications = applications.map((app: any) => ({
      _id: app._id,
      name: app.applicantId?.name || app.applicantName || "Anonymous",
      email: app.applicantId?.email || app.applicantEmail || "",
      phone: app.applicantId?.phone || app.applicantPhone || "",
      resumeUrl: app.uploadedFileURL,
      parsedResumeData: app.parsedResumeData,
      atsScore: app.atsScore || 0,
      skillsMatched: app.geminiAnalysis?.skillsMatched || [],
      submittedAt: app.submittedAt,
      status: app.status === "new" ? "pending" : app.status,
    }));

    return NextResponse.json({
      applications: transformedApplications,
      pagination: {
        page,
        pages,
        total,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
