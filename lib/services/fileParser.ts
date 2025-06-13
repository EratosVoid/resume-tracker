import pdfParse from "pdf-parse";

export interface FileParseResult {
  text: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export class FileParserService {
  private readonly maxFileSize = parseInt(
    process.env.MAX_FILE_SIZE || "5242880"
  ); // 5MB default
  private readonly allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(
    ","
  ) || [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  async parseFile(file: File): Promise<FileParseResult> {
    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new Error(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(
        `File type ${file.type} is not supported. Allowed types: ${this.allowedTypes.join(", ")}`
      );
    }

    const result: FileParseResult = {
      text: "",
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    try {
      switch (file.type) {
        case "application/pdf":
          result.text = await this.parsePDF(file);
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          result.text = await this.parseDOCX(file);
          break;
        case "text/plain":
          result.text = await this.parseTXT(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${file.type}`);
      }

      // Validate that we extracted some text
      if (!result.text || result.text.trim().length < 10) {
        throw new Error("Unable to extract meaningful text from the file");
      }

      return result;
    } catch (error) {
      console.error("Error parsing file:", error);
      throw new Error(
        `Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async parseBuffer(
    buffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<FileParseResult> {
    // Validate file size
    if (buffer.length > this.maxFileSize) {
      throw new Error(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Validate file type
    if (!this.allowedTypes.includes(mimeType)) {
      throw new Error(
        `File type ${mimeType} is not supported. Allowed types: ${this.allowedTypes.join(", ")}`
      );
    }

    const result: FileParseResult = {
      text: "",
      fileName,
      fileType: mimeType,
      fileSize: buffer.length,
    };

    try {
      switch (mimeType) {
        case "application/pdf":
          result.text = await this.parsePDFBuffer(buffer);
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          result.text = await this.parseDOCXBuffer(buffer);
          break;
        case "text/plain":
          result.text = buffer.toString("utf-8");
          break;
        default:
          throw new Error(`Unsupported file type: ${mimeType}`);
      }

      // Validate that we extracted some text
      if (!result.text || result.text.trim().length < 10) {
        throw new Error("Unable to extract meaningful text from the file");
      }

      return result;
    } catch (error) {
      console.error("Error parsing buffer:", error);
      throw new Error(
        `Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private async parsePDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return this.parsePDFBuffer(buffer);
  }

  private async parsePDFBuffer(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error("Failed to parse PDF file");
    }
  }

  private async parseDOCX(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return this.parseDOCXBuffer(buffer);
  }

  private async parseDOCXBuffer(buffer: Buffer): Promise<string> {
    try {
      // For DOCX parsing, we'll need to implement this or use a library
      // For now, we'll return a placeholder and suggest using a DOCX parsing library
      console.warn(
        "DOCX parsing not fully implemented. Consider using mammoth.js or similar library"
      );

      // Basic attempt to extract text from DOCX
      // This is a very basic implementation and might not work for all DOCX files
      const text = buffer.toString("utf8");

      // Try to extract readable text (this is very rudimentary)
      const matches = text.match(/[\x20-\x7E\s]{4,}/g);
      if (matches) {
        return matches.join(" ").replace(/\s+/g, " ").trim();
      }

      throw new Error("Unable to extract text from DOCX file");
    } catch (error) {
      console.error("Error parsing DOCX:", error);
      throw new Error(
        "Failed to parse DOCX file. Please convert to PDF or plain text."
      );
    }
  }

  private async parseTXT(file: File): Promise<string> {
    try {
      return await file.text();
    } catch (error) {
      console.error("Error parsing TXT:", error);
      throw new Error("Failed to parse text file");
    }
  }

  validateFileType(file: File): boolean {
    return this.allowedTypes.includes(file.type);
  }

  validateFileSize(file: File): boolean {
    return file.size <= this.maxFileSize;
  }

  getMaxFileSize(): number {
    return this.maxFileSize;
  }

  getAllowedTypes(): string[] {
    return [...this.allowedTypes];
  }

  getFormattedMaxFileSize(): string {
    const sizeInMB = this.maxFileSize / 1024 / 1024;
    return `${sizeInMB}MB`;
  }
}

export const fileParserService = new FileParserService();
