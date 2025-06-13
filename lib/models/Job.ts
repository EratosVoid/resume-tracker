import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  requirements?: string[];
  skills?: string[];
  experienceLevel?: "entry" | "mid" | "senior" | "executive";
  location?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  isPublic: boolean;
  createdBy: mongoose.Types.ObjectId;
  slug: string;
  deadline?: Date;
  status: "active" | "closed" | "draft";
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "executive"],
      default: "mid",
    },
    location: { type: String, trim: true },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "USD" },
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
JobSchema.index({ slug: 1 });
JobSchema.index({ isPublic: 1, status: 1 });
JobSchema.index({ createdBy: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ deadline: 1 });

// Pre-save middleware to ensure slug is unique
JobSchema.pre("save", async function (next) {
  if (!this.isModified("title") && this.slug) {
    return next();
  }

  // Generate slug from title
  let baseSlug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

  let slug = baseSlug;
  let counter = 1;

  // Check if slug exists and increment counter if needed
  while (await mongoose.models.Job.findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
