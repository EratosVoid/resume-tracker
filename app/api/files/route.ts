import { NextRequest, NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), "uploads");

    try {
      const files = await readdir(uploadsDir);
      const fileList = await Promise.all(
        files.map(async (fileName) => {
          const filePath = path.join(uploadsDir, fileName);
          const stats = await stat(filePath);
          const fileId = fileName.split(".")[0]; // Extract UUID from filename

          return {
            fileId,
            fileName,
            size: stats.size,
            uploadedAt: stats.birthtime.toISOString(),
            modifiedAt: stats.mtime.toISOString(),
          };
        })
      );

      return NextResponse.json({
        success: true,
        files: fileList,
        count: fileList.length,
      });
    } catch (error) {
      // Directory doesn't exist or is empty
      return NextResponse.json({
        success: true,
        files: [],
        count: 0,
      });
    }
  } catch (error) {
    console.error("File listing error:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
