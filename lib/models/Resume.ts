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

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User model
  phone?: string;
  resumeVersions: IResumeVersion[];
  jobPreferences?: string[];
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ATSScoreSchema = new Schema<IATSScore>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job" },
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

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One resume profile per user
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
ResumeSchema.index({ userId: 1 });
// ResumeSchema.index({ "resumeVersions.atsScores.jobId": 1 });
ResumeSchema.index({ createdAt: -1 });

// Post-save middleware to update user's resumes array and scores
ResumeSchema.post("save", async function () {
  if (this.userId) {
    try {
      const User = mongoose.model("User");

      // Update user's resumes array if this is a new resume
      if (this.isNew) {
        await User.findByIdAndUpdate(
          this.userId,
          { $addToSet: { resumes: this._id } },
          { new: true }
        );
        console.log(`Added resume ${this._id} to user ${this.userId} timeline`);
      }

      // Always update user scores when resume is saved (new or modified)
      await (User as any).updateUserScores(this.userId.toString());
      console.log(`Updated scores for user ${this.userId} after resume save`);
    } catch (error) {
      console.error("Error updating user resumes timeline and scores:", error);
    }
  }
});

// Post-remove middleware to update user's resumes array
ResumeSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.userId) {
    try {
      await mongoose
        .model("User")
        .findByIdAndUpdate(doc.userId, { $pull: { resumes: doc._id } });
      console.log(`Removed resume ${doc._id} from user ${doc.userId} timeline`);
    } catch (error) {
      console.error("Error updating user resumes timeline:", error);
    }
  }
});

export default mongoose.models.Resume ||
  mongoose.model<IResume>("Resume", ResumeSchema);
