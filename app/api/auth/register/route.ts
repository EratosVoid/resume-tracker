import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import Resume from "@/lib/models/Resume";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(), // Optional for applicants who might not need accounts initially
  company: z.string().optional(),
  role: z.enum(["hr", "applicant"]).optional().default("applicant"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // If role is HR but no company provided, require company
    if (
      validatedData.role === "hr" &&
      (!validatedData.company || validatedData.company.trim().length < 2)
    ) {
      return NextResponse.json(
        { error: "Company name is required for recruiter accounts" },
        { status: 400 }
      );
    }

    // If role is HR but no password provided, require password
    if (
      validatedData.role === "hr" &&
      (!validatedData.password || validatedData.password.length < 6)
    ) {
      return NextResponse.json(
        { error: "Password is required for recruiter accounts" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: validatedData.email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Prepare user data
    const userData: any = {
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      role: validatedData.role,
    };

    // Add password if provided (required for HR, optional for applicants)
    if (validatedData.password) {
      userData.password = validatedData.password;
    }

    // Add company if provided
    if (validatedData.company && validatedData.company.trim()) {
      userData.company = validatedData.company.trim();
    }

    // Create user (password will be hashed automatically by the User model's pre-save middleware)
    const user = await User.create(userData);

    // If user is an applicant, create a resume profile
    if (validatedData.role === "applicant") {
      await Resume.create({
        userId: user._id,
        isAnonymous: false,
        resumeVersions: [],
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

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
