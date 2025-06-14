# Models Documentation

## Overview

This directory contains the MongoDB models for the Resume Tracker ATS system. The models are designed with timeline functionality to track user activity chronologically.

## Model Structure

### User Model (`User.ts`)

- Core user information (name, email, role, etc.)
- **Timeline Arrays**: `resumes[]` and `submissions[]` - automatically maintained chronological references
- Roles: `"hr" | "admin" | "applicant"`
- Static method: `findWithTimeline()` for populating timeline data

### Resume Model (`Resume.ts`)

- Formerly "Applicant" model - renamed for clarity
- Linked to User via `userId`
- Contains `resumeVersions[]` with ATS scores and file metadata
- Automatically updates User's `resumes[]` timeline on create/delete

### Submission Model (`Submission.ts`)

- Individual job applications/resume submissions
- **New fields**: `userId` and `resumeId` for better linking
- `isAnonymous` flag for anonymous submissions
- Automatically updates both Job's `applicationCount` and User's `submissions[]` timeline

### Job Model (`Job.ts`)

- Job postings with public/private visibility
- Tracks `applicationCount` automatically via Submission middleware
- Links to User via `createdBy` (HR/admin users)

## Timeline Functionality

### How Timeline Works

1. **User.resumes[]**: Auto-populated when Resume documents are created/deleted
2. **User.submissions[]**: Auto-populated when Submission documents are created/deleted (excluding anonymous)
3. **Indexes**: All models have `createdAt: -1` indexes for chronological sorting
4. **Population**: Use `User.findWithTimeline(userId)` to get full timeline data

### Timeline Ordering

- All timeline arrays maintain chronological order (newest first)
- Use `createdAt` field for sorting when querying
- Anonymous submissions are excluded from user timelines but still tracked in jobs

## Key Relationships

```
User (1) ←→ (1) Resume
User (1) ←→ (*) Submission  // when not anonymous
User (1) ←→ (*) Job         // HR users creating jobs

Job (1) ←→ (*) Submission
Resume (1) ←→ (*) Submission // when resume is saved

Submission → Job (required)
Submission → User (optional, when not anonymous)
Submission → Resume (optional, when user has saved resume)
```

## Migration Notes

- **Breaking Change**: `Applicant` model renamed to `Resume`
- **New Fields**: `userId` and `resumeId` added to Submission
- **New Fields**: `isAnonymous` added to Submission
- **New Arrays**: `resumes[]` and `submissions[]` added to User
- Update any existing imports from `Applicant` to `Resume`
