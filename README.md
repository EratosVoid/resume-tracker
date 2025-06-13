# Resume Tracker ATS - AI-Powered Applicant Tracking System

A modern, intelligent applicant tracking system built with Next.js, powered by Google Gemini AI for advanced resume analysis and candidate matching.

![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.8.5-green)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## 🚀 Features

### 🧠 AI-Powered Resume Analysis

- **Google Gemini Integration**: Advanced resume parsing and content extraction
- **Smart Matching**: Intelligent skill and experience matching against job requirements
- **ATS Scoring**: Comprehensive compatibility scoring (0-100%)
- **Improvement Suggestions**: AI-generated feedback for candidates

### 📁 File Processing

- **Multi-format Support**: PDF, DOCX, and TXT file uploads
- **Text Extraction**: Automatic content parsing from uploaded files
- **Security**: File validation and sanitization
- **Alternative Input**: Manual resume text paste option

### 🎯 Dual Mode System

- **Public Job Postings**: Open applications with visible job descriptions
- **Private Job Postings**: Shared link applications with hidden job details
- **Flexible Privacy**: Configurable visibility settings per job

### 👥 User Management

- **Anonymous Applications**: No signup required for basic applications
- **Profile Creation**: Optional applicant profiles for application tracking
- **HR Dashboard**: Comprehensive recruiter interface
- **Role-based Access**: Different permissions for HR, recruiters, and admins

### 📊 Analytics & Tracking

- **Application Metrics**: Track application counts and trends
- **Candidate Scoring**: Sort and filter by ATS scores
- **Status Management**: Track application progress through hiring pipeline
- **Search & Filter**: Advanced filtering by skills, experience, and scores

## 🛠 Technology Stack

- **Frontend**: Next.js 15.3.1 with TypeScript
- **UI Framework**: HeroUI with TailwindCSS
- **Animations**: Framer Motion
- **Database**: MongoDB with Mongoose ODM
- **AI Engine**: Google Gemini API
- **File Upload**: UploadThing
- **Authentication**: NextAuth.js (optional)
- **File Processing**: PDF-parse for document handling
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)
- Google Gemini API key
- UploadThing account (for file uploads)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd resume-tracker-ats
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/resume-tracker-ats

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# NextAuth (Optional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# Application Settings
APP_URL=http://localhost:3000
RESUME_EXPIRY_DAYS=14
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain
```

### 3. Database Setup

Start your MongoDB instance and create the database:

```bash
# Using MongoDB locally
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI with your Atlas connection string
```

### 4. API Keys Setup

#### Google Gemini API

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select existing
3. Generate an API key
4. Add to `GOOGLE_GEMINI_API_KEY` in `.env.local`

#### UploadThing Setup

1. Visit [UploadThing](https://uploadthing.com/)
2. Create account and new app
3. Get App ID and Secret from dashboard
4. Add to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
resume-tracker-ats/
├── app/
│   ├── api/
│   │   ├── jobs/                 # Job CRUD operations
│   │   ├── submissions/          # Resume submission handling
│   │   └── uploadthing/          # File upload configuration
│   ├── jobs/                     # Job listing and detail pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Homepage
│   └── providers.tsx            # App providers (Theme, Toast)
├── components/
│   ├── jobs/
│   │   └── JobList.tsx          # Job listing component
│   └── resume/
│       └── ResumeUpload.tsx     # Resume upload & analysis
├── lib/
│   ├── models/                  # MongoDB schemas
│   │   ├── Applicant.ts
│   │   ├── Job.ts
│   │   ├── Submission.ts
│   │   └── User.ts
│   ├── services/
│   │   ├── gemini.ts           # AI analysis service
│   │   └── fileParser.ts       # File processing service
│   ├── database.ts             # MongoDB connection
│   └── uploadthing.ts          # Upload configuration
└── types/                      # TypeScript type definitions
```

## 🎯 Usage Guide

### For Job Providers (HR/Recruiters)

#### Authentication & Account Setup

1. **Register**: Create an account at `/auth/register` with company details
2. **Login**: Access the dashboard at `/auth/login`
3. **Dashboard**: Get overview of your job postings and application metrics

#### Job Management Features

1. **Post New Jobs**: Complete job posting form with:
   - Basic information (title, description, location)
   - Experience level and employment type
   - Salary information (optional)
   - Required skills and benefits
   - Application deadline

2. **Visibility Control**:
   - **Public Jobs**: Visible on public jobs page, searchable by candidates
   - **Private Jobs**: Only accessible via direct link sharing (perfect for exclusive positions)

3. **Status Management**:
   - **Active**: Currently accepting applications
   - **Paused**: Temporarily not accepting applications
   - **Closed**: No longer accepting applications

4. **Job Operations**:
   - Edit existing job postings
   - Change visibility (public ↔ private)
   - Update job status
   - Delete jobs (with confirmation)
   - View application count and metrics

#### Dashboard Features

- **Real-time Statistics**: Total jobs, active jobs, application counts
- **Recent Jobs Overview**: Quick access to latest postings
- **Quick Actions**: Fast navigation to common tasks
- **Application Management**: Review and filter candidates

### For Job Seekers

1. **Browse Jobs**: Visit `/jobs` to see available public positions
2. **Apply**: Click on any job to view details and apply
3. **Upload Resume**: Drag & drop or select PDF/DOCX/TXT files
4. **Get AI Analysis**: Receive instant ATS score and feedback
5. **Track Applications**: Optionally create profile to track submissions

### Authentication Routes

- `/auth/login` - HR/Recruiter login
- `/auth/register` - Create new HR account
- `/dashboard` - Protected dashboard (requires HR login)
- `/dashboard/jobs` - Job management interface
- `/dashboard/jobs/new` - Post new job form

## 🔧 API Endpoints

### Jobs

- `GET /api/jobs` - List jobs with filtering
- `POST /api/jobs` - Create new job
- `GET /api/jobs/[slug]` - Get job details
- `PUT /api/jobs/[slug]` - Update job
- `DELETE /api/jobs/[slug]` - Delete job

### Submissions

- `POST /api/submissions` - Submit resume application
- `GET /api/submissions` - List submissions (HR only)

### File Upload

- `POST /api/uploadthing` - Handle file uploads

## 🎨 Customization

### UI Themes

The app uses HeroUI with dark/light theme support. Customize in:

- `tailwind.config.js` - TailwindCSS configuration
- `app/providers.tsx` - Theme provider settings

### AI Prompts

Modify AI behavior in `lib/services/gemini.ts`:

- Resume parsing prompts
- Job matching criteria
- Scoring algorithms

### File Processing

Extend file support in `lib/services/fileParser.ts`:

- Add new file types
- Modify size limits
- Custom parsing logic

## 🔒 Security Features

- **File Validation**: Type and size checking
- **Input Sanitization**: Prevents injection attacks
- **Rate Limiting**: API endpoint protection
- **Privacy Controls**: Anonymous vs. profile applications
- **Data Retention**: Configurable file expiry

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Environment Variables for Production

- Update `APP_URL` to your domain
- Use production MongoDB URI
- Secure your API keys
- Configure CORS if needed

### Performance Optimization

- Enable MongoDB indexes (created automatically)
- Configure CDN for file uploads
- Implement Redis for caching (optional)

## 🧪 Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Documentation**: Check the inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

## 🛣 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Email notifications for applications
- [ ] Bulk candidate operations
- [ ] Resume template builder
- [ ] Interview scheduling integration
- [ ] Advanced search with Elasticsearch
- [ ] Multi-language support

---

Built with ❤️ using Next.js, HeroUI, and Google Gemini AI
# resume-tracker
