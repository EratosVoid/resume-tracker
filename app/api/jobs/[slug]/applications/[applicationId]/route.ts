import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/database";
import Job from "@/lib/models/Job";
import Submission from "@/lib/models/Submission";

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string; applicationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { status } = await request.json();

    // Map frontend status to backend status
    const statusMap: { [key: string]: string } = {
      pending: "new",
      reviewed: "reviewed",
      shortlisted: "shortlisted",
      rejected: "rejected",
    };

    const backendStatus = statusMap[status];
    if (!backendStatus) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Find the job and verify ownership
    const job = await Job.findOne({
      slug: params.slug,
      createdBy: session.user.id,
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the application status
    const application = await Submission.findOneAndUpdate(
      {
        _id: params.applicationId,
        jobId: job._id,
      },
      {
        status: backendStatus,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}
