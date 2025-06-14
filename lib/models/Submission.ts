import mongoose, { Document, Schema } from "mongoose";

export interface IParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description?: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year?: string;
  }[];
  certifications?: string[];
  summary?: string;
  totalExperienceYears: number;
}

export interface ISubmission extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId?: mongoose.Types.ObjectId;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  atsScore: number;
  parsedResumeData: IParsedResumeData;
  uploadedFileURL?: string;
  fileName?: string;
  fileType?: string;
  rawResumeText: string;
  geminiAnalysis?: {
    skillsMatched: string[];
    skillsMissing: string[];
    experienceMatch: number;
    improvementSuggestions: string[];
    strengthsIdentified: string[];
  };
  status: "new" | "reviewed" | "shortlisted" | "rejected" | "hired";
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ParsedResumeDataSchema = new Schema<IParsedResumeData>(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    skills: [{ type: String }],
    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        duration: { type: String, required: true },
        description: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        year: { type: String },
      },
    ],
    certifications: [{ type: String }],
    summary: { type: String },
    totalExperienceYears: { type: Number, default: 0 },
  },
  { _id: false }
);

const GeminiAnalysisSchema = new Schema(
  {
    skillsMatched: [{ type: String }],
    skillsMissing: [{ type: String }],
    experienceMatch: { type: Number, min: 0, max: 100 },
    improvementSuggestions: [{ type: String }],
    strengthsIdentified: [{ type: String }],
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    applicantPhone: { type: String, trim: true },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    parsedResumeData: {
      type: ParsedResumeDataSchema,
      required: true,
    },
    uploadedFileURL: { type: String },
    fileName: { type: String },
    fileType: { type: String },
    rawResumeText: {
      type: String,
      required: true,
    },
    geminiAnalysis: GeminiAnalysisSchema,
    status: {
      type: String,
      enum: ["new", "reviewed", "shortlisted", "rejected", "hired"],
      default: "new",
    },
    reviewNotes: { type: String },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: { type: Date },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
SubmissionSchema.index({ jobId: 1, submittedAt: -1 });
SubmissionSchema.index({ applicantId: 1 });
SubmissionSchema.index({ applicantEmail: 1 });
SubmissionSchema.index({ atsScore: -1 });
SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ submittedAt: -1 });

// Post-save middleware to update job application count when new submission is created
SubmissionSchema.post("save", async function () {
  if (this.isNew) {
    try {
      await mongoose
        .model("Job")
        .findByIdAndUpdate(this.jobId, { $inc: { applicationCount: 1 } });
      console.log(`Incremented application count for job ${this.jobId}`);
    } catch (error) {
      console.error("Error incrementing job application count:", error);
    }
  }
});

// Post-remove middleware to update job application count when submission is deleted
SubmissionSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      await mongoose
        .model("Job")
        .findByIdAndUpdate(doc.jobId, { $inc: { applicationCount: -1 } });
      console.log(`Decremented application count for job ${doc.jobId}`);
    } catch (error) {
      console.error("Error decrementing job application count:", error);
    }
  }
});

SubmissionSchema.post("deleteOne", async function () {
  try {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      await mongoose
        .model("Job")
        .findByIdAndUpdate(doc.jobId, { $inc: { applicationCount: -1 } });
      console.log(`Decremented application count for job ${doc.jobId}`);
    }
  } catch (error) {
    console.error("Error decrementing job application count:", error);
  }
});

export default mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);
