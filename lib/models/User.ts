import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for applicants who might register without password initially
  role: "hr" | "admin" | "applicant";
  company?: string;
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
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
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

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

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
