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
  userId?: mongoose.Types.ObjectId; // Reference to User who submitted (can be anonymous)
  resumeId?: mongoose.Types.ObjectId; // Reference to Resume model
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
  isAnonymous: boolean;
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
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
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
SubmissionSchema.index({ jobId: 1, submittedAt: -1 });
SubmissionSchema.index({ userId: 1 });
SubmissionSchema.index({ resumeId: 1 });
SubmissionSchema.index({ applicantEmail: 1 });
SubmissionSchema.index({ atsScore: -1 });
SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ submittedAt: -1 });
SubmissionSchema.index({ isAnonymous: 1 });
SubmissionSchema.index({ createdAt: -1 }); // For timeline ordering

// Post-save middleware to update job application count and user timeline when new submission is created
SubmissionSchema.post("save", async function () {
  if (this.isNew) {
    try {
      // Update job application count
      await mongoose
        .model("Job")
        .findByIdAndUpdate(this.jobId, { $inc: { applicationCount: 1 } });
      console.log(`Incremented application count for job ${this.jobId}`);

      // Update user's submissions timeline if not anonymous
      if (this.userId && !this.isAnonymous) {
        await mongoose
          .model("User")
          .findByIdAndUpdate(
            this.userId,
            { $addToSet: { submissions: this._id } },
            { new: true }
          );
        console.log(
          `Added submission ${this._id} to user ${this.userId} timeline`
        );
      }
    } catch (error) {
      console.error("Error updating submission-related counts:", error);
    }
  }
});

// Post-remove middleware to update job application count and user timeline when submission is deleted
SubmissionSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      // Update job application count
      await mongoose
        .model("Job")
        .findByIdAndUpdate(doc.jobId, { $inc: { applicationCount: -1 } });
      console.log(`Decremented application count for job ${doc.jobId}`);

      // Update user's submissions timeline if not anonymous
      if (doc.userId && !doc.isAnonymous) {
        await mongoose
          .model("User")
          .findByIdAndUpdate(doc.userId, { $pull: { submissions: doc._id } });
        console.log(
          `Removed submission ${doc._id} from user ${doc.userId} timeline`
        );
      }
    } catch (error) {
      console.error("Error updating submission-related counts:", error);
    }
  }
});

SubmissionSchema.post("deleteOne", async function () {
  try {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      // Update job application count
      await mongoose
        .model("Job")
        .findByIdAndUpdate(doc.jobId, { $inc: { applicationCount: -1 } });
      console.log(`Decremented application count for job ${doc.jobId}`);

      // Update user's submissions timeline if not anonymous
      if (doc.userId && !doc.isAnonymous) {
        await mongoose
          .model("User")
          .findByIdAndUpdate(doc.userId, { $pull: { submissions: doc._id } });
        console.log(
          `Removed submission ${doc._id} from user ${doc.userId} timeline`
        );
      }
    }
  } catch (error) {
    console.error("Error updating submission-related counts:", error);
  }
});

export default mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);
