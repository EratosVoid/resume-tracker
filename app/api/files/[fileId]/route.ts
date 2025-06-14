import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 });
    }

    // Find the file in uploads directory
    const uploadsDir = path.join(process.cwd(), "uploads");

    // Get all files in uploads directory and find the one with matching fileId
    const fs = require("fs");
    const files = fs.readdirSync(uploadsDir);
    const targetFile = files.find((file: string) => file.startsWith(fileId));

    if (!targetFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const filePath = path.join(uploadsDir, targetFile);
    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    const ext = path.extname(targetFile).toLowerCase();
    let contentType = "application/octet-stream";

    switch (ext) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      case ".docx":
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".doc":
        contentType = "application/msword";
        break;
      case ".txt":
        contentType = "text/plain";
        break;
    }

    return new NextResponse(fileBuffer as any, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${targetFile}"`,
      },
    });
  } catch (error) {
    console.error("File serving error:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}
