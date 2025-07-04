import { GoogleGenerativeAI } from "@google/generative-ai";
import { IParsedResumeData } from "../models/Submission";
import { IJob } from "../models/Job";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface GeminiAnalysisResult {
  parsedData: IParsedResumeData;
  atsScore: number;
  analysis: {
    skillsMatched: string[];
    skillsMissing: string[];
    experienceMatch: number;
    improvementSuggestions: string[];
    strengthsIdentified: string[];
  };
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  async parseResume(resumeText: string): Promise<IParsedResumeData> {
    const prompt = `
    You are an expert resume parsing specialist with advanced knowledge of resume formats, industry standards, and ATS optimization requirements. Your task is to extract and intelligently process structured data from resume text with maximum accuracy and completeness.

    PARSING EXPERTISE:
    - Multi-format resume analysis (chronological, functional, hybrid, modern, traditional)
    - Industry-specific terminology and role classification
    - Skills taxonomy and technology stack identification
    - Experience calculation and career progression analysis
    - Contact information normalization and validation
    - Educational credential standardization

    INTELLIGENT EXTRACTION GUIDELINES:

    1. CONTACT INFORMATION PROCESSING:
    - Extract name from headers, signatures, or first mentions
    - Handle name variations (nicknames, middle names, suffixes)
    - Normalize phone numbers to consistent format
    - Validate email format and extract primary address
    - Look for contact info in headers, footers, or contact sections

    2. SKILLS IDENTIFICATION & STANDARDIZATION:
    - Extract from dedicated skills sections, job descriptions, and project details
    - Standardize technology names (e.g., "JS" → "JavaScript", "React.js" → "React")
    - Include both hard and soft skills when explicitly mentioned
    - Recognize skill categories: programming languages, frameworks, tools, methodologies
    - Avoid duplicates and use consistent naming conventions
    - Extract implied skills from job titles and responsibilities

    3. EXPERIENCE PARSING SOPHISTICATION:
    - Handle various date formats (MM/YYYY, Month Year, Season Year, "Present", "Current")
    - Calculate overlapping positions and total experience accurately
    - Extract meaningful job descriptions, focusing on achievements and responsibilities
    - Handle career gaps, contract work, and concurrent positions
    - Recognize internships, part-time work, and consulting roles
    - Parse company names from various formats and contexts

    4. EDUCATION DATA EXTRACTION:
    - Identify degrees, certifications, and educational programs
    - Handle incomplete education information (in progress, expected graduation)
    - Extract relevant coursework, honors, and academic achievements
    - Recognize online courses, bootcamps, and professional development
    - Standardize degree nomenclature (e.g., "BS" → "Bachelor of Science")

    5. CERTIFICATION RECOGNITION:
    - Extract professional certifications, licenses, and credentials
    - Include certification bodies and expiration dates when available
    - Recognize industry-standard certifications across domains
    - Handle certification numbers and verification codes

    6. PROFESSIONAL SUMMARY CONSTRUCTION:
    - Extract existing summary/objective statements
    - If missing, intelligently construct from career highlights and experience
    - Focus on years of experience, key skills, and industry focus
    - Keep concise but informative (2-3 sentences maximum)

    7. EXPERIENCE CALCULATION LOGIC:
    - Calculate total years including months for precision
    - Handle concurrent positions by using the maximum end date range
    - Account for gaps appropriately (don't subtract gaps from total)
    - Round to nearest half-year for practical purposes
    - Consider internships and part-time work proportionally

    CORNER CASE HANDLING:
    - Multi-column layouts and creative formatting
    - Non-standard section headers and organization
    - International date formats and educational systems
    - Career changers with diverse backgrounds
    - Freelancers and consultants with project-based work
    - Recent graduates with limited experience
    - Senior professionals with extensive histories
    - Resumes with spelling errors or formatting issues
    - Incomplete or fragmented information
    - Mixed languages or international elements

    QUALITY ASSURANCE & VALIDATION:
    - Cross-reference extracted data for consistency
    - Validate date ranges and chronological order
    - Ensure email and phone number format correctness
    - Remove duplicate entries and normalize similar items
    - Maintain data integrity and professional standards
    - Handle edge cases gracefully without errors

    ATS OPTIMIZATION FOCUS:
    - Extract keywords that match common ATS patterns
    - Identify industry-relevant terminology and jargon
    - Capture quantified achievements and metrics
    - Recognize action verbs and accomplishment language
    - Parse technical specifications and version numbers
    - Extract location information and work authorization status

    ERROR HANDLING & FALLBACKS:
    - Gracefully handle missing or malformed data
    - Use null values for truly unavailable information
    - Apply reasonable defaults only when contextually obvious
    - Maintain JSON structure integrity regardless of input quality
    - Log parsing challenges without breaking output format

    Extract structured data from this resume text. Return a JSON object with the following structure:

    {
      "name": "Full name",
      "email": "Email address", 
      "phone": "Phone number",
      "skills": ["skill1", "skill2", ...],
      "experience": [
        {
          "company": "Company name",
          "position": "Job title", 
          "duration": "Duration (e.g., 2020-2023)",
          "description": "Brief description"
        }
      ],
      "education": [
        {
          "institution": "School/University name",
          "degree": "Degree type and field",
          "year": "Graduation year"
        }
      ],
      "certifications": ["cert1", "cert2", ...],
      "summary": "Brief professional summary",
      "totalExperienceYears": number
    }

    Resume text:
    ${resumeText}

    CRITICAL REQUIREMENTS:
    - Extract ALL available information with maximum accuracy
    - Calculate total experience years based on complete work history analysis
    - Use empty arrays or null values for unavailable information
    - Ensure JSON is valid and parseable
    - Apply intelligent inference only when strongly supported by context
    - Maintain consistent data formatting and professional standards
    - Focus on ATS-relevant information extraction for optimal matching capabilities

    Return ONLY the JSON object with no additional text or formatting.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const parsedData = JSON.parse(jsonMatch[0]);

      // Validate and sanitize the parsed data
      return this.validateParsedData(parsedData);
    } catch (error) {
      console.error("Error parsing resume with Gemini:", error);
      // Return basic fallback data
      return this.createFallbackData(resumeText);
    }
  }

  async analyzeResumeForJob(
    resumeText: string,
    jobData: IJob,
    parsedResumeData?: IParsedResumeData
  ): Promise<GeminiAnalysisResult> {
    // If we don't have parsed data, parse it first
    const parsedData = parsedResumeData || (await this.parseResume(resumeText));

    const prompt = `
    You are an elite ATS (Applicant Tracking System) optimization expert with deep expertise in resume-job matching algorithms, hiring manager psychology, and talent acquisition best practices. Your specialized knowledge spans across multiple industries, experience levels, and modern recruiting technologies.

    CORE EXPERTISE:
    - ATS algorithm simulation and keyword matching optimization
    - Semantic skill mapping and technology stack analysis
    - Experience relevance scoring and career progression evaluation
    - Industry-specific requirement interpretation and gap analysis
    - Hiring manager decision-making patterns and preferences
    - Market-competitive candidate positioning strategies

    ADVANCED ANALYSIS FRAMEWORK:

    1. SKILL MATCHING INTELLIGENCE (40% Weight):
    - Exact keyword matching with case-insensitive comparison
    - Semantic similarity analysis (e.g., "React" matches "React.js", "ReactJS")
    - Skill hierarchy recognition (e.g., "Senior Java Developer" implies "Java", "OOP", "Software Development")
    - Technology stack completeness assessment
    - Related skill inference (e.g., "Frontend Developer" suggests "HTML", "CSS", "JavaScript")
    - Skill recency and relevance weighting
    - Industry-standard skill clustering and categorization

    2. EXPERIENCE RELEVANCE SCORING (30% Weight):
    - Years of experience vs. requirement alignment
    - Role progression and seniority level assessment
    - Industry domain experience matching
    - Responsibility scope and impact evaluation
    - Career trajectory consistency analysis
    - Leadership and management experience validation
    - Project complexity and scale assessment

    3. EDUCATION ALIGNMENT EVALUATION (15% Weight):
    - Degree requirement matching and educational hierarchy
    - Relevant coursework and academic focus areas
    - Certification and professional development alignment
    - Continuous learning and skill development evidence
    - Educational institution prestige and program quality
    - Alternative education pathways (bootcamps, online courses) recognition

    4. OVERALL CANDIDATE FIT ASSESSMENT (15% Weight):
    - Cultural and role alignment indicators
    - Career stability and commitment patterns
    - Communication skills and professional presentation
    - Geographic and logistical fit considerations
    - Compensation expectation alignment (when inferable)
    - Growth potential and adaptability markers

    SOPHISTICATED MATCHING ALGORITHMS:

    KEYWORD ANALYSIS:
    - Multi-level matching: exact, partial, semantic, contextual
    - Synonym recognition and alternative terminology
    - Acronym expansion and abbreviation handling
    - Version-specific technology matching (e.g., "Python 3.8" vs "Python")
    - Compound skill recognition (e.g., "Full-Stack Development" = multiple skills)

    EXPERIENCE WEIGHTING:
    - Recent experience prioritization (last 5 years = 80% weight)
    - Role relevance multipliers based on job title similarity
    - Achievement quantification bonus scoring
    - Leadership experience premium for senior roles
    - Specialization depth vs. breadth analysis

    GAP ANALYSIS & PRIORITIZATION:
    - Critical vs. nice-to-have skill differentiation
    - Learnable vs. experience-dependent skill classification
    - Market availability and skill rarity consideration
    - Training timeline and difficulty assessment
    - Compensation impact of missing skills

    IMPROVEMENT STRATEGY FORMULATION:
    - Immediate actionable changes (resume optimization)
    - Short-term skill development recommendations
    - Long-term career development pathway suggestions
    - Industry certification and training program guidance
    - Networking and experience acquisition strategies

    ATS OPTIMIZATION TECHNIQUES:
    - Keyword density optimization recommendations
    - Section organization and formatting improvements
    - ATS-friendly formatting suggestions
    - Content gap filling strategies
    - Quantification and impact statement enhancement

    CORNER CASE HANDLING:
    - Career changers and non-traditional backgrounds
    - Over-qualified vs. under-qualified candidate scenarios
    - International experience and education translation
    - Contract/consulting vs. full-time experience weighting
    - Industry transition and transferable skill recognition
    - Remote work experience and distributed team collaboration
    - Startup vs. enterprise experience contextualization

    SCORING CALIBRATION:
    - 90-100: Exceptional fit, immediate interview candidate
    - 80-89: Strong fit, highly likely to advance
    - 70-79: Good fit, worth considering with minor gaps
    - 60-69: Moderate fit, significant development needed
    - 50-59: Weak fit, major gaps present
    - Below 50: Poor fit, substantial misalignment

    Analyze this resume against the job description and provide a comprehensive ATS analysis.

    Job Description:
    Title: ${jobData.title}
    Description: ${jobData.description}
    Required Skills: ${jobData.skills?.join(", ") || "Not specified"}
    Experience Level: ${jobData.experienceLevel || "Not specified"}
    Requirements: ${jobData.requirements?.join(", ") || "Not specified"}

    Resume Data:
    Name: ${parsedData.name}
    Skills: ${parsedData.skills.join(", ")}
    Total Experience: ${parsedData.totalExperienceYears} years
    Summary: ${parsedData.summary}

    ANALYSIS REQUIREMENTS:
    Apply the weighted scoring methodology:
    1. Skill matching analysis (40% weight) - Deep keyword and semantic matching
    2. Experience relevance evaluation (30% weight) - Years, role alignment, progression
    3. Education alignment assessment (15% weight) - Degree, certifications, training
    4. Overall candidate fit scoring (15% weight) - Cultural fit, stability, growth potential

    Please provide analysis in this exact JSON format:
    {
      "atsScore": number (0-100),
      "skillsMatched": ["skill1", "skill2"],
      "skillsMissing": ["missing1", "missing2"],
      "experienceMatch": number (0-100),
      "improvementSuggestions": ["suggestion1", "suggestion2"],
      "strengthsIdentified": ["strength1", "strength2"]
    }

    CRITICAL ANALYSIS STANDARDS:
    - Be exceptionally thorough and precise in skill matching
    - Provide specific, actionable improvement recommendations
    - Identify concrete strengths that hiring managers value
    - Consider both ATS algorithm requirements and human reviewer preferences
    - Account for industry-specific nuances and role-level expectations
    - Maintain objectivity while providing constructive feedback
    - Focus on competitive positioning and market differentiation

    Return ONLY the JSON object with comprehensive, professional analysis.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in analysis response");
      }

      const analysis = JSON.parse(jsonMatch[0]);

      return {
        parsedData,
        atsScore: Math.min(100, Math.max(0, analysis.atsScore || 0)),
        analysis: {
          skillsMatched: analysis.skillsMatched || [],
          skillsMissing: analysis.skillsMissing || [],
          experienceMatch: Math.min(
            100,
            Math.max(0, analysis.experienceMatch || 0)
          ),
          improvementSuggestions: analysis.improvementSuggestions || [],
          strengthsIdentified: analysis.strengthsIdentified || [],
        },
      };
    } catch (error) {
      console.error("Error analyzing resume with Gemini:", error);
      // Return fallback analysis
      return this.createFallbackAnalysis(parsedData, jobData);
    }
  }

  private validateParsedData(data: any): IParsedResumeData {
    return {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      skills: Array.isArray(data.skills) ? data.skills : [],
      experience: Array.isArray(data.experience)
        ? data.experience.map((exp: any) => ({
            company: exp.company || "",
            position: exp.position || "",
            duration: exp.duration || "",
            description: exp.description || "",
          }))
        : [],
      education: Array.isArray(data.education)
        ? data.education.map((edu: any) => ({
            institution: edu.institution || "",
            degree: edu.degree || "",
            year: edu.year || "",
          }))
        : [],
      certifications: Array.isArray(data.certifications)
        ? data.certifications
        : [],
      summary: data.summary || "",
      totalExperienceYears:
        typeof data.totalExperienceYears === "number"
          ? data.totalExperienceYears
          : 0,
    };
  }

  private createFallbackData(resumeText: string): IParsedResumeData {
    // Basic text analysis as fallback
    const emailMatch = resumeText.match(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    );
    const phoneMatch = resumeText.match(
      /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/
    );

    return {
      name: "",
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      summary: resumeText.substring(0, 200) + "...",
      totalExperienceYears: 0,
    };
  }

  private createFallbackAnalysis(
    parsedData: IParsedResumeData,
    jobData: IJob
  ): GeminiAnalysisResult {
    // Basic fallback analysis
    const jobSkills = jobData.skills || [];
    const resumeSkills = parsedData.skills || [];

    const skillsMatched = jobSkills.filter((skill) =>
      resumeSkills.some(
        (resumeSkill) =>
          resumeSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(resumeSkill.toLowerCase())
      )
    );

    const matchPercentage =
      jobSkills.length > 0
        ? (skillsMatched.length / jobSkills.length) * 100
        : 50;
    const atsScore = Math.round(
      matchPercentage * 0.6 + parsedData.totalExperienceYears * 5
    );

    return {
      parsedData,
      atsScore: Math.min(100, Math.max(0, atsScore)),
      analysis: {
        skillsMatched,
        skillsMissing: jobSkills.filter(
          (skill) => !skillsMatched.includes(skill)
        ),
        experienceMatch: Math.min(100, parsedData.totalExperienceYears * 20),
        improvementSuggestions: [
          "Unable to generate detailed suggestions due to API limitations",
        ],
        strengthsIdentified: ["Basic resume parsing completed"],
      },
    };
  }

  private extractJsonFromResponse(text: string): any {
  // Method 1: Try to find JSON within code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (e) {
      console.warn('Failed to parse JSON from code block:', e);
    }
  }

  // Method 2: Find the first complete JSON object
  let braceCount = 0;
  let jsonStart = -1;
  let jsonEnd = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === '{') {
      if (braceCount === 0) {
        jsonStart = i;
      }
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0 && jsonStart !== -1) {
        jsonEnd = i;
        break;
      }
    }
  }

  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn('Failed to parse extracted JSON:', e);
    }
  }

  // Method 3: Try the original regex approach as fallback
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.warn('Failed to parse JSON with regex:', e);
    }
  }

  throw new Error("No valid JSON found in response");
}

  async analyzeGeneratedResume(resumeData: any): Promise<GeminiAnalysisResult> {
  try {
    // Format resume data for analysis
    const resumeText = `
    Target Role: ${resumeData.targetRole || 'Not specified'}
    Experience Level: ${resumeData.experience || 'Not specified'}

    Personal Info:
    ${Object.entries(resumeData.personalInfo || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

    Skills:
    ${resumeData.skills?.map((s: any) => s.name || s).join(', ') || 'No skills listed'}

    Work Experience:
    ${resumeData.workExperience?.join('\n') || 'No work experience listed'}

    Projects:
    ${resumeData.projects?.join('\n') || 'No projects listed'}

    Education:
    ${resumeData.education?.join('\n') || 'No education listed'}

    Achievements:
    ${resumeData.achievements?.join('\n') || 'No achievements listed'}
        `.trim();

        // Improved prompt with clearer instructions
        const prompt = `You are an ATS resume analyzer. Analyze the following resume and provide your response in EXACTLY this JSON format with no additional text or explanation:

    {
      "atsScore": number (0-100),
      "validatedSkills": ["skill1", "skill2"],
      "completeSections": ["section1", "section2"],
      "nextSteps": ["step1", "step2"]
    }

    ANALYSIS REQUIREMENTS:
    1. atsScore: Rate ATS compatibility from 0-100 based on keyword density, formatting, and completeness
    2. validatedSkills: List the actual skills found in the resume (not "0")
    3. completeSections: List sections that are well-filled from: ["Summary", "Experience", "Education", "Skills", "Projects", "Achievements"]
    4. nextSteps: Provide 3-5 specific improvement suggestions

    Resume to analyze:
    ${resumeText}

    IMPORTANT: Return ONLY the JSON object, no markdown formatting, no explanations, no additional text.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Raw Gemini response:', text); // Debug log

    // Use the improved JSON extraction
    const analysis = this.extractJsonFromResponse(text);

    // Validate the response structure
    const validatedAnalysis = {
      atsScore: typeof analysis.atsScore === 'number' ? 
        Math.min(100, Math.max(0, analysis.atsScore)) : 70,
      validatedSkills: Array.isArray(analysis.validatedSkills) ? 
        analysis.validatedSkills : [],
      completeSections: Array.isArray(analysis.completeSections) ? 
        analysis.completeSections : [],
      nextSteps: Array.isArray(analysis.nextSteps) ? 
        analysis.nextSteps : ['Add more specific details', 'Include quantifiable achievements']
    };

    return {
      parsedData: resumeData,
      atsScore: validatedAnalysis.atsScore,
      analysis: {
        skillsMatched: validatedAnalysis.validatedSkills,
        skillsMissing: [],
        experienceMatch: 0,
        improvementSuggestions: validatedAnalysis.nextSteps,
        strengthsIdentified: validatedAnalysis.completeSections
      }
    };

  } catch (error) {
    console.error('Resume analysis error:', error);
    
    // Enhanced fallback analysis
    const fallbackSkills = resumeData.skills?.map((s: any) => s.name || s).filter(Boolean) || [];
    const hasContent = {
      summary: !!(resumeData.summary || resumeData.personalInfo),
      experience: !!(resumeData.workExperience && resumeData.workExperience.length > 0),
      education: !!(resumeData.education && resumeData.education.length > 0),
      skills: fallbackSkills.length > 0,
      projects: !!(resumeData.projects && resumeData.projects.length > 0),
      achievements: !!(resumeData.achievements && resumeData.achievements.length > 0)
    };

    const completeSections = Object.entries(hasContent)
      .filter(([_, hasData]) => hasData)
      .map(([section, _]) => section.charAt(0).toUpperCase() + section.slice(1));

    const baseScore = completeSections.length * 15; // 15 points per complete section
    const skillBonus = Math.min(fallbackSkills.length * 2, 10); // Up to 10 bonus points for skills

    return {
      parsedData: resumeData,
      atsScore: Math.min(90, baseScore + skillBonus), // Cap at 90 for fallback
      analysis: {
        skillsMatched: fallbackSkills,
        skillsMissing: [],
        experienceMatch: 0,
        improvementSuggestions: [
          'Add more quantifiable achievements with specific metrics',
          'Include industry-relevant keywords and technical skills',
          'Expand project descriptions with technologies used',
          'Add professional summary highlighting key strengths',
          'Ensure consistent formatting throughout the document'
        ],
        strengthsIdentified: completeSections
      }
    };
  }
}
}

export const geminiService = new GeminiService();
