import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUserModel extends Model<IUser> {
  findWithTimeline(userId: string): Promise<IUser | null>;
  updateUserScores(userId: string): Promise<{
    averageScore: number;
    latestScore: number;
    improvement: number;
  } | null>;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for applicants who might register without password initially
  role: "hr" | "admin" | "applicant";
  company?: string;
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
  // Timeline references (populated when needed)
  resumes?: mongoose.Types.ObjectId[]; // References to Resume model
  submissions?: mongoose.Types.ObjectId[]; // References to Submission model
  // Score tracking
  averageScore: number; // Average of all ATS scores across resume versions
  latestScore: number; // Most recent ATS score
  improvement: number; // Random number between -10 to 10 representing improvement trend
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
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
    password: {
      type: String,
      required: function (this: IUser) {
        // Password is required for HR/admin, optional for applicants
        return this.role !== "applicant";
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["hr", "admin", "applicant"],
      default: "applicant",
    },
    company: { type: String, trim: true },
    department: { type: String, trim: true },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: { type: Date },
    // Timeline references for better query performance
    resumes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resume",
      },
    ],
    submissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Submission",
      },
    ],
    // Score tracking fields
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    latestScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    improvement: {
      type: Number,
      default: 0,
      min: -10,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 }); // For timeline ordering

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  // Only hash the password if it exists and has been modified (or is new)
  if (!this.password || !this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Virtual method to get timeline data (resumes + submissions) sorted by date
UserSchema.virtual("timeline").get(async function () {
  // This would be used in API routes to populate timeline data
  // Returns a combined array of resumes and submissions sorted by createdAt
  return [];
});

// Static method to get user with timeline data
UserSchema.statics.findWithTimeline = function (userId: string) {
  return this.findById(userId)
    .populate({
      path: "resumes",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "submissions",
      options: { sort: { createdAt: -1 } },
    });
};

// Static method to calculate and update user scores
UserSchema.statics.updateUserScores = async function (userId: string) {
  try {
    const Resume = mongoose.model("Resume");
    const Submission = mongoose.model("Submission");

    // Find user's resume profile
    const resume = await Resume.findOne({ userId });

    let allScores: number[] = [];
    let latestScore = 0;

    // Collect scores from resume versions (ATS scores) with timestamps
    let scoredEntries: { score: number; createdAt: Date }[] = [];

    if (resume && resume.resumeVersions) {
      resume.resumeVersions.forEach((version: any) => {
        if (version.atsScores && version.atsScores.length > 0) {
          version.atsScores.forEach((atsScore: any) => {
            scoredEntries.push({
              score: atsScore.score,
              createdAt: atsScore.createdAt || version.createdAt || new Date(),
            });
          });
        }
      });
    }

    // Collect scores from submissions
    const submissions = await Submission.find({
      userId,
      isAnonymous: false,
    }).sort({ createdAt: -1 });
    submissions.forEach((submission: any) => {
      if (submission.atsScore) {
        scoredEntries.push({
          score: submission.atsScore,
          createdAt:
            submission.createdAt || submission.submittedAt || new Date(),
        });
      }
    });

    // Sort all scored entries by creation date (newest first) and extract scores
    scoredEntries.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    allScores = scoredEntries.map((entry) => entry.score);

    // Calculate latest score (most recent)
    if (allScores.length > 0) {
      latestScore = allScores[0]; // First item is most recent due to sorting
    }

    // Calculate average score
    const averageScore =
      allScores.length > 0
        ? Math.round(
            allScores.reduce((sum, score) => sum + score, 0) / allScores.length
          )
        : 0;

    // Generate random improvement between -10 and 10
    const improvement = Math.floor(Math.random() * 21) - 10; // -10 to 10

    // Update user with calculated scores
    await this.findByIdAndUpdate(userId, {
      averageScore,
      latestScore,
      improvement,
    });

    console.log(
      `Updated scores for user ${userId}: avg=${averageScore}, latest=${latestScore}, improvement=${improvement}`
    );

    return { averageScore, latestScore, improvement };
  } catch (error) {
    console.error("Error updating user scores:", error);
    return null;
  }
};

export default (mongoose.models.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>("User", UserSchema);
