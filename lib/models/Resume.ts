import mongoose, { Document, Schema } from "mongoose";

export interface IATSScore {
  jobId?: mongoose.Types.ObjectId;
  score?: number;
  keywordsMatched?: string[];
  skillsMatched?: string[];
  experienceYears?: number;
  createdAt?: Date;
}

export interface IPersonalInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface ISkill {
  name?: string;
  proof?: string;
  validated?: boolean;
}

export interface IWorkExperience {
  company?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
}

export interface IEducation {
  school?: string;
  degree?: string;
  field?: string;
  graduationYear?: string;
  gpa?: string;
  honors?: string;
}

export interface IProject {
  name?: string;
  description?: string;
  technologies?: string[];
  link?: string;
  github?: string;
  achievements?: string[];
}

export interface IAchievement {
  title?: string;
  description?: string;
  date?: string;
  proof?: string;
}

export interface IGeneratedResume {
  personalInfo?: IPersonalInfo;
  summary?: string;
  experience?: IWorkExperience[];
  education?: IEducation[];
  skills?: string[];
  projects?: IProject[];
  achievements?: IAchievement[];
}

export interface IResumeVersion {
  // Original data structure
  parsedText?: string;
  rawFileURL?: string;
  fileName?: string;
  fileType?: string;

  // New structured data for generated resumes
  structuredData?: {
    personalInfo?: IPersonalInfo;
    targetRole?: string;
    experience?: string;
    skills?: ISkill[];
    workExperience?: IWorkExperience[];
    education?: IEducation[];
    projects?: IProject[];
    achievements?: IAchievement[];
  };

  // Generated resume content
  generatedResume?: IGeneratedResume;

  // Metadata
  creationMode: "upload" | "form" | "chat";
  atsScore: number;
  shareableId?: string; // For public sharing
  isPublic: boolean;

  atsScores: IATSScore[];
  createdAt: Date;
}

export interface IResume extends Document {
  userId?: mongoose.Types.ObjectId; // Optional for anonymous resumes
  phone?: string;
  resumeVersions: IResumeVersion[];
  jobPreferences?: string[];
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PersonalInfoSchema = new Schema<IPersonalInfo>({
  fullName: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  location: { type: String, required: false },
  linkedin: { type: String },
  portfolio: { type: String },
});

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: false },
  proof: { type: String },
  validated: { type: Boolean, default: false },
});

const WorkExperienceSchema = new Schema<IWorkExperience>({
  company: { type: String, required: false },
  title: { type: String, required: false },
  startDate: { type: String, required: false },
  endDate: { type: String, required: false },
  description: { type: String, required: false },
  achievements: [{ type: String }],
});

const EducationSchema = new Schema<IEducation>({
  school: { type: String, required: false },
  degree: { type: String, required: false },
  field: { type: String, required: false },
  graduationYear: { type: String, required: false },
  gpa: { type: String },
  honors: { type: String },
});

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: false },
  description: { type: String, required: false },
  technologies: [{ type: String }],
  link: { type: String },
  github: { type: String },
  achievements: [{ type: String }],
});

const AchievementSchema = new Schema<IAchievement>({
  title: { type: String, required: false },
  description: { type: String, required: false },
  date: { type: String, required: false },
  proof: { type: String },
});

const GeneratedResumeSchema = new Schema<IGeneratedResume>({
  personalInfo: { type: PersonalInfoSchema, required: false },
  summary: { type: String, required: false },
  experience: [WorkExperienceSchema],
  education: [EducationSchema],
  skills: [{ type: String }],
  projects: [ProjectSchema],
  achievements: [AchievementSchema],
});

const ATSScoreSchema = new Schema<IATSScore>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job" },
  score: { type: Number, required: false, min: 0, max: 100, default: 0 },
  keywordsMatched: [{ type: String }],
  skillsMatched: [{ type: String }],
  experienceYears: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ResumeVersionSchema = new Schema<IResumeVersion>({
  // Original fields
  parsedText: { type: String },
  rawFileURL: { type: String },
  fileName: { type: String },
  fileType: { type: String },

  // New structured data fields
  structuredData: {
    personalInfo: PersonalInfoSchema,
    targetRole: { type: String },
    experience: { type: String },
    skills: [SkillSchema],
    workExperience: [WorkExperienceSchema],
    education: [EducationSchema],
    projects: [ProjectSchema],
    achievements: [AchievementSchema],
  },

  generatedResume: GeneratedResumeSchema,

  // Metadata
  creationMode: {
    type: String,
    enum: ["upload", "form", "chat"],
    required: true,
  },
  atsScore: { type: Number, default: 0, min: 0, max: 100 },
  shareableId: {
    type: String,
    unique: true,
    sparse: true,
    default: function () {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      );
    },
  },
  isPublic: { type: Boolean, default: false },

  atsScores: [ATSScoreSchema],
  createdAt: { type: Date, default: Date.now },
});

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow anonymous resumes
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
ResumeSchema.index({ "resumeVersions.shareableId": 1 });
ResumeSchema.index({ "resumeVersions.isPublic": 1 });
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
