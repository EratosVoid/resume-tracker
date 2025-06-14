import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import connectDB from "../../../../lib/database";
import Job from "../../../../lib/models/Job";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

const updateJobSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  location: z.string().optional(),
  experienceLevel: z.enum(["entry", "mid", "senior", "executive"]).optional(),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "internship", "freelance"])
    .optional(),
  salary: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().default("USD"),
    })
    .optional(),
  skills: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  deadline: z.string().optional(),
  isPublic: z.boolean().optional(),
  status: z.enum(["active", "paused", "closed"]).optional(),
});

// GET /api/jobs/[slug] - Fetch a specific job by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { slug } = await params;

    // Find job by slug
    const job = await Job.findOne({
      slug,
      status: "active",
    }).populate("createdBy", "name company");

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if job is private and user doesn't have access
    const session = await getServerSession(authOptions);
    if (
      !job.isPublic &&
      (!session || job.createdBy._id.toString() !== session.user.id)
    ) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // For private jobs, we might want to add additional checks here
    // For now, we'll return the job if it exists

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// PUT /api/jobs/[slug] - Update a job (for HR/Recruiters)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "hr") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { slug } = await params;
    const job = await Job.findOne({ slug });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if user owns this job
    if (job.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateJobSchema.parse(body);

    // Prepare update data
    const updateData: any = { ...validatedData };

    // Update slug if title changed
    if (validatedData.title && validatedData.title !== job.title) {
      updateData.slug =
        validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        Date.now();
    }

    const updatedJob = await Job.findOneAndUpdate({ slug }, updateData, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name company");

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[slug] - Delete a job (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "hr") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { slug } = await params;

    // Soft delete by updating status
    const job = await Job.findOne({ slug });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if user owns this job
    if (job.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Job.findOneAndDelete({ slug });

    return NextResponse.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
