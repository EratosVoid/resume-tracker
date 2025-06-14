import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/database";
import Job from "../../../lib/models/Job";
import Submission from "../../../lib/models/Submission";
import Applicant from "../../../lib/models/Applicant";
import { geminiService } from "../../../lib/services/gemini";
import { fileParserService } from "../../../lib/services/fileParser";
import { z } from "zod";

// Validation schema for submission
const createSubmissionSchema = z
  .object({
    jobSlug: z.string().min(1),
    applicantName: z.string().min(1).max(100),
    applicantEmail: z.string().email(),
    applicantPhone: z.string().optional(),
    resumeText: z.string().optional(),
    fileUrl: z.string().url().optional(),
    fileName: z.string().optional(),
    fileType: z.string().optional(),
    createProfile: z.boolean().default(false),
  })
  .refine((data) => data.resumeText || data.fileUrl, {
    message: "Either resume text or file URL must be provided",
  });

// POST /api/submissions - Create a new resume submission
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = createSubmissionSchema.parse(body);

    // Find the job
    const job = await Job.findOne({
      slug: validatedData.jobSlug,
      status: "active",
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or no longer active" },
        { status: 404 }
      );
    }

    let resumeText = validatedData.resumeText || "";

    // If file URL is provided, we might need to fetch and parse it
    // For now, we'll assume the file has already been parsed on the client side
    if (!resumeText && validatedData.fileUrl) {
      // In a real implementation, you might fetch the file from the URL and parse it
      // For now, we'll throw an error if no text is provided
      return NextResponse.json(
        { error: "Resume text must be provided" },
        { status: 400 }
      );
    }

    // Analyze resume with Gemini AI
    console.log("Analyzing resume with Gemini AI...");
    const analysis = await geminiService.analyzeResumeForJob(resumeText, job);

    // Create or find applicant
    let applicantId: string | undefined;

    if (validatedData.createProfile) {
      // Check if applicant already exists
      let applicant = await Applicant.findOne({
        email: validatedData.applicantEmail,
      });

      if (!applicant) {
        // Create new applicant
        applicant = new Applicant({
          name: validatedData.applicantName,
          email: validatedData.applicantEmail,
          phone: validatedData.applicantPhone,
          isAnonymous: false,
          resumeVersions: [
            {
              parsedText: resumeText,
              rawFileURL: validatedData.fileUrl,
              fileName: validatedData.fileName,
              fileType: validatedData.fileType,
              atsScores: [
                {
                  jobId: job._id,
                  score: analysis.atsScore,
                  keywordsMatched: analysis.analysis.skillsMatched,
                  skillsMatched: analysis.analysis.skillsMatched,
                  experienceYears: analysis.parsedData.totalExperienceYears,
                  createdAt: new Date(),
                },
              ],
              createdAt: new Date(),
            },
          ],
        });

        await applicant.save();
      } else {
        // Add new resume version to existing applicant
        applicant.resumeVersions.push({
          parsedText: resumeText,
          rawFileURL: validatedData.fileUrl,
          fileName: validatedData.fileName,
          fileType: validatedData.fileType,
          atsScores: [
            {
              jobId: job._id,
              score: analysis.atsScore,
              keywordsMatched: analysis.analysis.skillsMatched,
              skillsMatched: analysis.analysis.skillsMatched,
              experienceYears: analysis.parsedData.totalExperienceYears,
              createdAt: new Date(),
            },
          ],
          createdAt: new Date(),
        });

        await applicant.save();
      }

      applicantId = applicant._id.toString();
    }

    // Create submission
    const submission = new Submission({
      jobId: job._id,
      applicantId: applicantId || undefined,
      applicantName: validatedData.applicantName,
      applicantEmail: validatedData.applicantEmail,
      applicantPhone: validatedData.applicantPhone,
      atsScore: analysis.atsScore,
      parsedResumeData: analysis.parsedData,
      uploadedFileURL: validatedData.fileUrl,
      fileName: validatedData.fileName,
      fileType: validatedData.fileType,
      rawResumeText: resumeText,
      geminiAnalysis: analysis.analysis,
      status: "new",
    });

    await submission.save();

    // Ensure the job's application count is updated
    // (The post-save middleware should handle this, but we'll do it explicitly to be sure)
    try {
      await Job.findByIdAndUpdate(job._id, {
        $inc: { applicationCount: 1 },
      });
      console.log(`Updated application count for job ${job._id}`);
    } catch (error) {
      console.error("Error updating job application count:", error);
      // Don't fail the submission if count update fails
    }

    return NextResponse.json(
      {
        message: "Resume submitted successfully",
        submission: {
          id: submission._id,
          atsScore: submission.atsScore,
          status: submission.status,
          analysis: submission.geminiAnalysis,
        },
        jobTitle: job.title,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating submission:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit resume" },
      { status: 500 }
    );
  }
}

// GET /api/submissions - Fetch submissions (for HR/Recruiters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const jobSlug = searchParams.get("jobSlug");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const minScore = searchParams.get("minScore");

    // Build query
    const query: any = {};

    if (jobSlug) {
      const job = await Job.findOne({ slug: jobSlug });
      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
      query.jobId = job._id;
    }

    if (status) {
      query.status = status;
    }

    if (minScore) {
      query.atsScore = { $gte: parseInt(minScore) };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch submissions with job details
    const [submissions, total] = await Promise.all([
      Submission.find(query)
        .populate("jobId", "title slug")
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Submission.countDocuments(query),
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
