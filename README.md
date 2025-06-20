A modern, intelligent Applicant Tracking System (ATS) built with Next.js and powered by Google Gemini AI. This platform revolutionizes the recruitment process by providing advanced resume analysis, intelligent candidate matching, and comprehensive tracking capabilities for both recruiters and job seekers.
🌟 Overview
Resume Tracker bridges the gap between candidates and recruiters through AI-powered resume analysis and intelligent job matching. The platform offers a seamless experience for posting jobs, analyzing resumes, and managing applications while maintaining privacy and security at every step.
Key Highlights:

🤖 AI-Powered Analysis: Google Gemini integration for intelligent resume parsing and scoring
🎯 Smart Matching: Advanced algorithms match candidates to job requirements
📊 Comprehensive Scoring: ATS compatibility scores from 0-100% with detailed feedback
🔒 Privacy-First: Flexible privacy controls and anonymous application options
📱 Modern UI: Responsive design with dark/light theme support
🚀 Developer-Friendly: Built with modern tech stack and clean architecture

✨ Complete Feature List
🧠 AI-Powered Resume Analysis

Google Gemini Integration: Advanced natural language processing for resume content extraction
Intelligent Parsing: Automatic extraction of skills, experience, education, and contact information
Content Analysis: Deep understanding of resume context and relevance
Multi-format Support: Comprehensive parsing for PDF, DOCX, and TXT files
Text Extraction Engine: Robust document processing with fallback mechanisms
Alternative Input Method: Manual resume text paste for direct analysis

🎯 Smart Matching & Scoring

ATS Compatibility Scoring: Comprehensive 0-100% scoring system
Skill Matching: Intelligent comparison of candidate skills vs job requirements
Experience Alignment: Assessment of relevant work experience and career progression
Education Matching: Evaluation of educational background against job criteria
Keyword Analysis: Advanced keyword extraction and matching algorithms
Gap Analysis: Identification of missing skills and experience areas
Improvement Suggestions: AI-generated personalized feedback for candidates
Match Percentage: Real-time compatibility percentage calculation

📝 Job Management System

Flexible Job Posting: Complete job creation with rich details and requirements
Public Job Listings: Open applications visible on public job directory
Private Job Postings: Exclusive positions accessible only via shared links
Visibility Control: Dynamic switching between public and private modes
Status Management: Active, Paused, and Closed job status tracking
Application Deadlines: Configurable deadline management with automatic closure
Job Categorization: Organization by industry, location, and experience level
Bulk Operations: Multi-job management capabilities
Job Metrics: Real-time application count and engagement statistics

👥 User Management & Authentication

Role-Based Access Control: Distinct permissions for HR, recruiters, and administrators
Optional Authentication: Anonymous applications without mandatory signup
Profile Creation: Optional candidate profiles for application tracking
Company Profiles: Detailed organizational information for recruiters
Session Management: Secure session handling with NextAuth.js
Account Verification: Email verification and password reset functionality
User Preferences: Customizable dashboard and notification settings

📊 HR Dashboard & Analytics

Comprehensive Overview: Real-time metrics and application statistics
Application Management: Centralized candidate review and filtering system
Advanced Search: Multi-criteria filtering by skills, experience, scores, and status
Candidate Scoring: Sortable candidate lists with ATS scores
Pipeline Tracking: Application progress through hiring stages
Bulk Actions: Mass candidate operations and status updates
Export Capabilities: Data export for external analysis
Performance Metrics: Recruitment funnel analytics and insights
Recent Activity: Timeline of latest applications and job interactions

🛡️ Security & Privacy Features

File Validation: Comprehensive type and size checking for uploads
Input Sanitization: Protection against injection attacks and malicious content
Data Encryption: Secure data transmission and storage
Rate Limiting: API endpoint protection against abuse
Privacy Controls: Granular control over data visibility and sharing
Anonymous Applications: Privacy-first application process
Data Retention: Configurable file expiry and automatic cleanup
GDPR Compliance: Data protection and user rights management
Audit Logging: Comprehensive activity tracking for security monitoring

📁 File Processing & Storage

Multi-Format Support: PDF, DOCX, and TXT file processing
File Size Management: Configurable upload limits (default 5MB)
Cloud Storage Integration: UploadThing for scalable file management
Content Extraction: Advanced text extraction from various document formats
File Sanitization: Security scanning and malware protection
Preview Generation: Document preview capabilities
Batch Processing: Multiple file handling and processing
Storage Optimization: Efficient file compression and storage management

🎨 User Interface & Experience

Modern Design: HeroUI component library with Tailwind CSS
Responsive Layout: Mobile-first design with cross-device compatibility
Dark/Light Themes: User-preferred theme selection and system detection
Smooth Animations: Framer Motion for enhanced user interactions
Intuitive Navigation: Clear information architecture and user flows
Accessibility: WCAG compliant with keyboard navigation and screen reader support
Progressive Enhancement: Graceful degradation for various browsers and devices
Real-time Feedback: Instant notifications and status updates with React Hot Toast

🔗 API & Integration Features

RESTful API: Well-structured endpoints for all major operations
Job CRUD Operations: Complete job lifecycle management
Submission Handling: Robust application processing pipeline
File Upload API: Secure and efficient file upload endpoints
Authentication API: User management and session handling
Search API: Advanced filtering and search capabilities
Webhook Support: Integration with external systems and notifications
Rate Limiting: API protection and usage monitoring

📈 Analytics & Reporting

Application Metrics: Detailed statistics on job applications and candidate flow
Performance Tracking: Job posting effectiveness and engagement rates
Candidate Analytics: Insights into applicant demographics and qualifications
Recruitment Funnel: Stage-by-stage conversion tracking
Time-to-Fill: Hiring timeline analysis and optimization
Source Tracking: Application channel performance
Custom Reports: Configurable reporting for specific needs
Data Visualization: Charts and graphs for better insights

🛠️ Technology Stack
Frontend

Next.js 15.3.1: React framework with server-side rendering and API routes
TypeScript: Type-safe development with enhanced IDE support
HeroUI: Modern React component library
Tailwind CSS: Utility-first CSS framework for rapid styling
Framer Motion: Animation library for smooth transitions
React Hot Toast: Elegant notification system

Backend & Database

MongoDB: NoSQL database for flexible document storage
Mongoose ODM: Object document mapping for MongoDB
NextAuth.js: Authentication library with multiple provider support
Node.js 18+: JavaScript runtime environment

AI & Processing

Google Gemini API: Large language model for resume analysis
PDF-parse: Document parsing library for text extraction
Natural Language Processing: Advanced text analysis and understanding

File Management & Storage

UploadThing: File upload service with CDN capabilities
File Validation: Type checking and security scanning
Storage Optimization: Efficient file management and cleanup

📋 Prerequisites
Before getting started, ensure you have the following installed and configured:

Node.js 18+: Download from nodejs.org
MongoDB: Local installation or MongoDB Atlas cloud database
Google Gemini API Key: Get from Google AI Studio
UploadThing Account: Sign up at uploadthing.com
Git: For version control and repository management

🚀 Installation & Setup
1. Clone the Repository
bashgit clone https://github.com/EratosVoid/resume-tracker.git
cd resume-tracker
2. Install Dependencies
bashnpm install
# or
yarn install
# or
pnpm install
3. Environment Configuration
Create a .env.local file in the project root:
bash# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Google Gemini AI Configuration
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# NextAuth Configuration (Optional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_nextauth_secret

# UploadThing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Application Settings
APP_URL=http://localhost:3000
RESUME_EXPIRY_DAYS=14
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain

⚠️ Security Note: Never commit your .env.local file to version control. Add it to your .gitignore file.

4. Database Setup
Local MongoDB:
bash# Start MongoDB service
mongod

# Database will be created automatically on first connection
MongoDB Atlas (Cloud):

Create a cluster at MongoDB Atlas
Create a database user with appropriate permissions
Get your connection string from the Atlas dashboard
Replace MONGODB_URI in .env.local with your Atlas connection string

5. API Keys Configuration
Google Gemini API:

Visit Google AI Studio
Create a new project or select an existing one
Generate an API key following Google's documentation
Add the key to GOOGLE_GEMINI_API_KEY in your .env.local file

UploadThing Setup:

Visit UploadThing
Create an account and set up a new app
Obtain your App ID and Secret from the dashboard
Add both values to your .env.local file


🔐 Important: Keep all API keys secure and never share them publicly.

6. Start Development Server
bashnpm run dev
# or
yarn dev
# or
pnpm dev
Open http://localhost:3000 in your browser to see the application.
🔐 Security Best Practices
Environment Variables

Never commit .env.local or any environment files to version control
Add to .gitignore: Ensure all environment files are ignored
Use strong secrets: Generate secure random strings for NEXTAUTH_SECRET
Rotate keys regularly: Update API keys and secrets periodically
Platform secrets: Use your hosting platform's secure environment variable storage

Required .gitignore Entries
gitignore# Environment files
.env.local
.env.development.local
.env.test.local
.env.production.local
.env

# Sensitive files
*.pem
*.key
secrets/
API Key Security

Restrict API keys: Use API key restrictions where available (IP/domain restrictions)
Monitor usage: Track API key usage for unusual activity
Separate environments: Use different API keys for development/staging/production
Revoke unused keys: Remove API keys that are no longer needed

🔒 Security Features
File Security

Type Validation: Strict MIME type checking
Size Limits: Configurable upload size restrictions
Malware Scanning: Basic file content validation
Sanitization: Content cleaning and validation
Storage Security: Secure file storage with access controls

Data Protection

Input Validation: Comprehensive input sanitization
SQL Injection Prevention: Parameterized queries and ODM protection
XSS Protection: Content Security Policy and input escaping
CSRF Protection: Token-based request validation
Rate Limiting: API endpoint abuse prevention

Privacy Controls

Anonymous Applications: No mandatory user registration
Data Minimization: Collect only necessary information
Retention Policies: Automatic data cleanup and expiry
Access Controls: Role-based permissions system
Audit Logging: Comprehensive activity tracking

Authentication Security

Secure Sessions: HTTPOnly cookies with secure flags
Password Hashing: bcrypt with salt for password storage
JWT Security: Signed tokens with expiration
OAuth Integration: Secure third-party authentication
Account Verification: Email verification for security

📁 Project Structure
resume-tracker/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── jobs/                 # Job CRUD operations
│   │   ├── submissions/          # Resume submission handling
│   │   └── uploadthing/          # File upload configuration
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── dashboard/                # Protected dashboard area
│   │   ├── jobs/                 # Job management interface
│   │   └── analytics/            # Analytics and reporting
│   ├── jobs/                     # Public job listings
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage
│   ├── providers.tsx             # App providers (Theme, Toast, Auth)
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components
│   ├── jobs/                     # Job-related components
│   │   ├── JobList.tsx           # Job listing component
│   │   ├── JobCard.tsx           # Individual job card
│   │   └── JobForm.tsx           # Job creation/editing form
│   ├── resume/                   # Resume processing components
│   │   ├── ResumeUpload.tsx      # Resume upload & analysis
│   │   ├── ResumeAnalysis.tsx    # Analysis results display
│   │   └── ScoreCard.tsx         # ATS score visualization
│   ├── dashboard/                # Dashboard components
│   │   ├── Overview.tsx          # Dashboard overview
│   │   ├── CandidateList.tsx     # Candidate management
│   │   └── Analytics.tsx         # Analytics components
│   └── layout/                   # Layout components
│       ├── Header.tsx            # Application header
│       ├── Footer.tsx            # Application footer
│       └── Sidebar.tsx           # Dashboard sidebar
├── lib/                          # Utility libraries and services
│   ├── models/                   # MongoDB schemas
│   │   ├── Applicant.ts          # Applicant data model
│   │   ├── Job.ts                # Job posting model
│   │   ├── Submission.ts         # Application submission model
│   │   └── User.ts               # User account model
│   ├── services/                 # Business logic services
│   │   ├── gemini.ts             # AI analysis service
│   │   ├── fileParser.ts         # File processing service
│   │   ├── matching.ts           # Job matching algorithms
│   │   └── analytics.ts          # Analytics service
│   ├── utils/                    # Utility functions
│   │   ├── validation.ts         # Input validation
│   │   ├── formatting.ts         # Data formatting
│   │   └── constants.ts          # Application constants
│   ├── database.ts               # MongoDB connection
│   └── uploadthing.ts            # Upload configuration
├── types/                        # TypeScript type definitions
│   ├── job.ts                    # Job-related types
│   ├── user.ts                   # User-related types
│   ├── submission.ts             # Submission types
│   └── api.ts                    # API response types
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   ├── icons/                    # Icon files
│   └── favicon.ico               # Site favicon
├── docs/                         # Documentation
│   ├── API.md                    # API documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── CONTRIBUTING.md           # Contribution guidelines
├── tests/                        # Test files
│   ├── __tests__/                # Component tests
│   └── api/                      # API endpoint tests
├── .env.local                    # Environment variables
├── tailwind.config.js            # Tailwind CSS configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Project dependencies
└── README.md                     # Project documentation
💼 Usage Guide
For Recruiters/HR
1. Account Setup
bash# Navigate to registration
/auth/register

Create account with company details
Verify email address
Complete profile setup

2. Dashboard Access
bash# Access protected dashboard
/dashboard

Overview: View recruitment metrics and recent activity
Quick Stats: Total jobs, active positions, application counts
Recent Jobs: Fast access to latest postings
Application Trends: Visual analytics of candidate flow

3. Job Management
bash# Job management interface
/dashboard/jobs
Creating Jobs:

Basic Information: Title, description, company details
Requirements: Skills, experience level, education
Employment Details: Type, location, salary range
Benefits: Company benefits and perks
Visibility Settings: Public vs private posting
Application Deadlines: Automatic closure configuration

Job Operations:

Edit Existing: Modify job details and requirements
Status Control: Active, Paused, Closed status management
Visibility Toggle: Switch between public and private
Analytics: View application metrics and candidate quality
Bulk Actions: Manage multiple jobs simultaneously

4. Candidate Management
bash# Application review interface
/dashboard/applications
Review Features:

Candidate Profiles: Comprehensive applicant information
ATS Scores: Sort by compatibility scores (0-100%)
Skill Matching: Visual skill alignment indicators
Application Status: Track progress through hiring pipeline
Bulk Operations: Mass status updates and actions
Export Options: Download candidate data for analysis

Advanced Filtering:

Score Range: Filter by ATS compatibility scores
Skills: Search by specific technical skills
Experience: Filter by years of experience
Education: Sort by educational background
Application Date: Time-based filtering
Status: Filter by application stage

For Job Seekers
1. Browse Opportunities
bash# Public job listings
/jobs

Job Discovery: Browse all public job postings
Search Functionality: Find jobs by keywords, location, type
Filter Options: Experience level, employment type, company size
Job Details: Comprehensive job descriptions and requirements

2. Application Process
Resume Upload:

Drag & Drop: Simple file uploading interface
Multiple Formats: Support for PDF, DOCX, TXT files
File Validation: Automatic type and size checking
Alternative Input: Manual text paste option

AI Analysis:

Instant Scoring: Real-time ATS compatibility score
Detailed Feedback: Specific improvement suggestions
Skill Matching: Comparison with job requirements
Gap Analysis: Identification of missing qualifications

3. Application Tracking (Optional)
bash# Create profile for tracking
/profile/create

Application History: Track all submitted applications
Status Updates: Real-time application progress
Interview Scheduling: Manage interview appointments
Communication: Direct messaging with recruiters

🔌 API Documentation
Job Management Endpoints
List Jobs
httpGET /api/jobs?page=1&limit=10&status=active&public=true
Parameters:

page: Page number for pagination
limit: Number of jobs per page
status: Filter by job status (active, paused, closed)
public: Filter public/private jobs
search: Search term for job title/description
location: Filter by job location
type: Employment type filter

Response:
json{
  "jobs": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
Create Job
httpPOST /api/jobs
Content-Type: application/json
Authorization: Bearer {token}
Request Body:
json{
  "title": "Senior Software Engineer",
  "description": "Join our team...",
  "requirements": ["React", "Node.js", "TypeScript"],
  "location": "San Francisco, CA",
  "type": "full-time",
  "salary": {
    "min": 120000,
    "max": 180000,
    "currency": "USD"
  },
  "public": true,
  "deadline": "2024-12-31T23:59:59Z"
}
Update Job
httpPUT /api/jobs/{slug}
Content-Type: application/json
Authorization: Bearer {token}
Delete Job
httpDELETE /api/jobs/{slug}
Authorization: Bearer {token}
Application Management Endpoints
Submit Application
httpPOST /api/submissions
Content-Type: multipart/form-data
Form Data:

file: Resume file (PDF/DOCX/TXT)
jobId: Target job identifier
coverLetter: Optional cover letter text
contactInfo: Applicant contact information

List Applications (HR Only)
httpGET /api/submissions?jobId={id}&status=pending&page=1
Authorization: Bearer {token}
Update Application Status
httpPUT /api/submissions/{id}/status
Content-Type: application/json
Authorization: Bearer {token}
json{
  "status": "reviewed",
  "notes": "Strong candidate, schedule interview"
}
File Upload Endpoints
Upload Resume
httpPOST /api/uploadthing
Content-Type: multipart/form-data
Response:
json{
  "url": "https://utfs.io/f/abc123...",
  "size": 1024000,
  "type": "application/pdf",
  "name": "resume.pdf"
}
🎨 Customization Guide
Theme Customization
Tailwind Configuration
javascript// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}
Theme Provider Settings
typescript// app/providers.tsx
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        themes={['light', 'dark', 'modern']}
      >
        {children}
      </ThemeProvider>
    </NextUIProvider>
  )
}
AI Behavior Customization
Resume Analysis Prompts
typescript// lib/services/gemini.ts
export const RESUME_ANALYSIS_PROMPT = `
Analyze the following resume and provide:
1. ATS compatibility score (0-100)
2. Key skills extraction
3. Experience level assessment
4. Improvement suggestions
5. Missing keywords analysis

Resume content: {resumeText}
Job requirements: {jobRequirements}
`;
Scoring Algorithm
typescript// lib/services/matching.ts
export function calculateATSScore(
  resume: ParsedResume,
  job: JobRequirements
): ATSScore {
  const skillsScore = calculateSkillsMatch(resume.skills, job.requiredSkills);
  const experienceScore = calculateExperienceMatch(resume.experience, job.minExperience);
  const educationScore = calculateEducationMatch(resume.education, job.education);
  
  return {
    overall: Math.round((skillsScore * 0.5 + experienceScore * 0.3 + educationScore * 0.2)),
    breakdown: { skillsScore, experienceScore, educationScore }
  };
}
File Processing Customization
Add New File Types
typescript// lib/services/fileParser.ts
export const SUPPORTED_TYPES = {
  'application/pdf': parsePDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': parseDOCX,
  'text/plain': parseTXT,
  'application/rtf': parseRTF, // New format
  'text/html': parseHTML       // New format
};
Custom Parsing Logic
typescriptexport async function parseRTF(buffer: Buffer): Promise<string> {
  // Implement RTF parsing logic
  const text = await customRTFParser(buffer);
  return sanitizeText(text);
}
🚀 Deployment Guide
Environment Setup
bash# Production environment variables (example structure)
NODE_ENV=production
APP_URL=https://your-production-domain.com
MONGODB_URI=your_production_mongodb_uri
GOOGLE_GEMINI_API_KEY=your_production_gemini_key
UPLOADTHING_SECRET=your_production_uploadthing_secret
NEXTAUTH_SECRET=your_production_nextauth_secret

⚠️ Security Warning: Never expose production environment variables in your codebase. Use your hosting platform's environment variable management system.

Build Process
bash# Build for production
npm run build

# Test production build locally
npm start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
Deployment Options
Vercel (Recommended)
bash# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
Vercel Configuration (.vercel/project.json):
json{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri-secret",
    "GOOGLE_GEMINI_API_KEY": "@gemini-api-key-secret"
  }
}

💡 Note: Use Vercel's environment variable dashboard to securely store your production secrets.

Docker Deployment
dockerfile# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
bash# Build and run
docker build -t resume-tracker .
docker run -p 3000:3000 --env-file .env resume-tracker
PM2 Process Manager
bash# Install PM2
npm i -g pm2

# Start application
pm2 start npm --name "resume-tracker" -- start

# Process configuration
pm2 startup
pm2 save
Production Optimizations

Database Indexing: Optimize MongoDB queries with proper indexes
CDN Integration: Use CDN for static assets and file uploads
Caching Strategy: Implement Redis for session and data caching
Performance Monitoring: Set up monitoring and alerting
Backup Strategy: Regular database and file backups
SSL/TLS: Ensure HTTPS for all communications

🧪 Testing
Test Suite
bash# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- FileParser.test.ts

# Watch mode for development
npm run test:watch
Test Structure
tests/
├── __tests__/
│   ├── components/
│   │   ├── ResumeUpload.test.tsx
│   │   └── JobList.test.tsx
│   ├── pages/
│   │   └── api/
│   │       ├── jobs.test.ts
│   │       └── submissions.test.ts
│   └── utils/
│       ├── fileParser.test.ts
│       └── matching.test.ts
├── fixtures/
│   ├── sample-resume.pdf
│   ├── sample-job.json
│   └── test-data.ts
└── setup.ts
Testing Examples
typescript// __tests__/components/ResumeUpload.test.tsx
describe('ResumeUpload Component', () => {
  it('should accept PDF files', async () => {
    const { getByTestId } = render(<ResumeUpload />);
    const fileInput = getByTestId('file-input');
    
    const file = new File(['test'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(getByTestId('upload-status')).toHaveTextContent('File accepted');
  });
});

// __tests__/api/jobs.test.ts
describe('/api/jobs', () => {
  it('should return paginated job list', async () => {
    const response = await fetch('/api/jobs?page=1&limit=5');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.jobs).toHaveLength(5);
    expect(data.pagination.total).toBeGreaterThan(0);
  });
});
🤝 Contributing
We welcome contributions from the community! Please follow these guidelines:
Development Setup

Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Install dependencies: npm install
Set up environment variables
Start development server: npm run dev

Code Standards

TypeScript: Use strict typing throughout
ESLint: Follow the configured linting rules
Prettier: Code formatting consistency
Commits: Use conventional commit messages
Testing: Write tests for new features

Pull Request Process

Update documentation for new features
Ensure all tests pass: npm test
Update type definitions if needed
Request review from maintainers
Address feedback and merge conflicts

Commit Convention
bashfeat: add new resume parsing algorithm
fix: resolve file upload timeout issue
docs: update API documentation
style: improve mobile responsive design
test: add unit tests for job matching
refactor: optimize database queries
Issue Templates

Bug Report: Use the bug report template
Feature Request: Use the feature request template
Security Issue: Report privately via email

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This project is licensed under the MIT License - see the LICENSE file for details.
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.


## 📞 Support

- **Documentation**: Check the inline code comments and this README
- **Issues**: Report bugs via [GitHub Issues](https://github.com/EratosVoid/resume-tracker/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/EratosVoid/resume-tracker/discussions) for questions and feature requests
- **Email**: Contact the maintainer at [your-email@example.com]

## 🔮 Roadmap

### Near Term (v1.1)
- [ ] Advanced analytics dashboard with charts and metrics
- [ ] Email notifications for new applications
- [ ] Bulk candidate operations (approve/reject multiple)
- [ ] Export applications to CSV/Excel

### Medium Term (v1.2)
- [ ] Resume template builder for candidates
- [ ] Interview scheduling integration
- [ ] Candidate communication system
- [ ] Mobile app (React Native)

### Long Term (v2.0)
- [ ] Advanced search with Elasticsearch
- [ ] Multi-language support (i18n)
- [ ] Video interview integration
- [ ] Advanced AI insights and predictions
- [ ] Multi-tenant architecture for agencies

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/your-username/resume-tracker.git
   ```
3. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make** your changes and commit
   ```bash
   git commit -m 'Add: amazing new feature'
   ```
5. **Push** to your branch
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add tests for new features
- Update documentation for any API changes
- Ensure all tests pass before submitting PR
- Use conventional commit messages

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/EratosVoid/resume-tracker?style=social)
![GitHub forks](https://img.shields.io/github/forks/EratosVoid/resume-tracker?style=social)
![GitHub issues](https://img.shields.io/github/issues/EratosVoid/resume-tracker)
![GitHub license](https://img.shields.io/github/license/EratosVoid/resume-tracker)

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **HeroUI** - For the beautiful UI components
- **Google Gemini** - For powerful AI capabilities
- **Vercel** - For seamless deployment platform
- **MongoDB** - For reliable database solutions
- **UploadThing** - For file upload infrastructure

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Initial release with core ATS functionality
- ✅ Google Gemini AI integration
- ✅ Public/private job postings
- ✅ Resume upload and analysis
- ✅ HR dashboard with candidate management
- ✅ Real-time scoring and feedback

---

<div align="center">
  <p>Built with ❤️ using Next.js, HeroUI, and Google Gemini AI</p>
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    </a>
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://www.mongodb.com">
      <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
  </p>
  
  <p>⭐ Star this repo if you find it helpful!</p>
</div>