import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "../../../lib/database";
import Job from "../../../lib/models/Job";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

// Validation schema for job creation
const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
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
  skills: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  deadline: z.string().optional(),
  decision: z.string().min(1, "Decision Logic is required"),
  isPublic: z.boolean().default(true),
  status: z.enum(["active", "paused", "closed"]).default("active"),
});

// GET /api/jobs - Fetch jobs (public and paginated)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const experienceLevel = searchParams.get("experienceLevel");
    const location = searchParams.get("location");
    const publicOnly = searchParams.get("public");
    const userOnly = searchParams.get("userOnly");
    const status = searchParams.get("status");

    // Build query
    const query: any = {};

    // Get session for user-specific filtering
    const session = await getServerSession(authOptions);

    if (userOnly === "true") {
      if (!session || session.user.role !== "hr") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      query.createdBy = session.user.id;
    } else {
      // For public endpoints, only show public jobs
      if (publicOnly !== "false") {
        query.isPublic = true;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    if (publicOnly === "true") {
      query.isPublic = true;
    } else if (publicOnly === "false") {
      query.isPublic = false;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch jobs with pagination
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name company"),
      Job.countDocuments(query),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "hr") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createJobSchema.parse(body);
    console.log("Validated job data:", validatedData);
    await connectDB();

    // Generate slug from title
    const slug =
      validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now();

    const job = await Job.create({
      ...validatedData,
      slug,
      createdBy: session.user.id,
      applicationCount: 0,
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);

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
