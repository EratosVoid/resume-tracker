import mongoose, { Document, Schema } from "mongoose";

export interface IATSScore {
  jobId: mongoose.Types.ObjectId;
  score: number;
  keywordsMatched: string[];
  skillsMatched: string[];
  experienceYears: number;
  createdAt: Date;
}

export interface IResumeVersion {
  parsedText: string;
  rawFileURL?: string;
  fileName?: string;
  fileType?: string;
  atsScores: IATSScore[];
  createdAt: Date;
}

export interface IApplicant extends Document {
  name: string;
  email: string;
  phone?: string;
  resumeVersions: IResumeVersion[];
  jobPreferences?: string[];
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ATSScoreSchema = new Schema<IATSScore>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  keywordsMatched: [{ type: String }],
  skillsMatched: [{ type: String }],
  experienceYears: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ResumeVersionSchema = new Schema<IResumeVersion>({
  parsedText: { type: String, required: true },
  rawFileURL: { type: String },
  fileName: { type: String },
  fileType: { type: String },
  atsScores: [ATSScoreSchema],
  createdAt: { type: Date, default: Date.now },
});

const ApplicantSchema = new Schema<IApplicant>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: { type: String, trim: true },
    resumeVersions: [ResumeVersionSchema],
    jobPreferences: [{ type: String }],
    isAnonymous: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
ApplicantSchema.index({ email: 1 });
ApplicantSchema.index({ "resumeVersions.atsScores.jobId": 1 });
ApplicantSchema.index({ createdAt: -1 });

export default mongoose.models.Applicant ||
  mongoose.model<IApplicant>("Applicant", ApplicantSchema);
