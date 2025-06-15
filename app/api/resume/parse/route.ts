import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobRole = formData.get("jobRole") as string;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to bytes for Gemini
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const jobContext = `
    JOB CONTEXT:
    ${jobRole ? `Role: ${jobRole}\n` : ""}
    ${jobDescription ? `Description: ${jobDescription}\n` : ""}`;

    console.log("Job Context:", jobContext);

    // Prepare prompt for resume analysis
    const prompt = `
    Important - If the 'JOB CONTEXT:' is present in the prompt, you MUST use it to tailor your analysis to the specific job role and description provided. This context is crucial for delivering a targeted and relevant resume assessment.
    If the 'JOB CONTEXT:' is not present, you should still analyze the resume based on general best practices and industry standards, but without specific tailoring to a job role.

    ${jobContext}

    Resume Analysis Request:

    You are an elite resume optimization expert and ATS specialist with 15+ years of experience in talent acquisition, resume writing, and applicant tracking system technologies. Your expertise encompasses modern hiring practices, industry-specific requirements, and cutting-edge ATS algorithms used by Fortune 500 companies and leading recruitment platforms.

    CORE COMPETENCIES:
    - Advanced ATS algorithm simulation and compatibility testing
    - Multi-industry resume formatting and content optimization
    - Keyword density analysis and semantic matching techniques
    - Professional presentation standards and visual hierarchy assessment
    - Quantified achievement identification and impact measurement
    - Modern job market trend analysis and skill demand forecasting
    - Career progression evaluation and competitive positioning strategies

    COMPREHENSIVE ANALYSIS FRAMEWORK:

    1. FORMATTING EXCELLENCE EVALUATION:
    - ATS parsing compatibility across major systems (Workday, Taleo, Greenhouse, Lever)
    - Visual hierarchy and readability optimization
    - Consistent formatting and professional presentation standards
    - Font selection, spacing, and layout effectiveness
    - Section organization and logical flow assessment
    - Length appropriateness for experience level and industry
    - Header/footer compatibility and contact information accessibility
    - Table, column, and graphic element ATS impact analysis

    2. CONTENT QUALITY MASTERY:
    - Achievement quantification and impact demonstration
    - Action verb strength and professional language usage
    - Career progression narrative and skill development showcase
    - Industry-relevant terminology and jargon appropriateness
    - Accomplishment vs. responsibility balance optimization
    - Leadership and collaboration evidence identification
    - Problem-solving and innovation capability demonstration
    - Results-oriented language and measurable outcomes emphasis

    3. KEYWORD OPTIMIZATION INTELLIGENCE:
    - Industry-specific keyword density and placement analysis
    - Semantic keyword variations and synonym integration
    - Skill taxonomy alignment with current market demands
    - Technology stack completeness and version specificity
    - Soft skill integration and modern workplace competencies
    - Role-level keyword expectations and seniority indicators
    - Geographic and industry-specific terminology inclusion
    - Emerging skill trend identification and future-proofing

    4. ATS COMPATIBILITY MASTERY:
    - Machine parsing accuracy and data extraction verification
    - Standard section header recognition and optimization
    - File format compatibility and encoding considerations
    - Special character and formatting element impact assessment
    - Keyword placement strategy for maximum algorithm recognition
    - Content structure optimization for automated screening systems
    - Resume length and section balance for optimal processing
    - Contact information standardization and accessibility

    5. TONE ANALYSIS AND COMMUNICATION STYLE ASSESSMENT:
    Evaluate the overall communication style and personality projection of the resume content. Analyze word choice, sentence structure, and presentation approach to determine the dominant tone category:

    TONE CATEGORIES:
    - PROFESSIONAL: Formal, corporate language with traditional business terminology. Conservative approach with emphasis on credentials and experience. Suitable for traditional industries like finance, law, consulting.
    
    - INFORMATIVE: Fact-based, data-driven presentation with clear, concise information delivery. Educational and straightforward approach focusing on skills and achievements. Ideal for technical roles, research positions, academic careers.
    
    - FRIENDLY: Warm, approachable language with personal touches while maintaining professionalism. Shows personality and cultural fit emphasis. Great for customer-facing roles, team environments, startups.
    
    - OPTIMISTIC: Positive, forward-thinking language with enthusiasm and growth mindset. Emphasizes potential, learning, and future contributions. Perfect for emerging professionals, career changers, growth-oriented companies.
    
    - PERSUASIVE: Compelling, results-focused language with strong action verbs and quantified achievements. Sales-oriented approach highlighting impact and value creation. Excellent for sales, marketing, leadership roles.
    
    - BOLD: Confident, assertive language with strong statements and ambitious claims. Risk-taking and innovation-focused presentation. Suitable for entrepreneurial roles, creative industries, disruptive companies.
    
    - CREATIVE: Innovative, unique expression with personality-driven content and creative formatting elements. Artistic or unconventional approach to information presentation. Ideal for design, marketing, entertainment, media roles.
    
    - ANALYTICAL: Logical, systematic presentation with methodical approach to information organization. Process-oriented language with emphasis on problem-solving methodology. Perfect for engineering, data science, operations roles.
    
    - COLLABORATIVE: Team-oriented language emphasizing partnership, cooperation, and collective achievements. Community-focused approach highlighting relationship building. Great for HR, project management, non-profit sectors.
    
    - AUTHORITATIVE: Expert-level language demonstrating deep knowledge and industry leadership. Thought leadership positioning with advanced terminology. Suitable for senior executive, consulting, subject matter expert roles.

    TONE ASSESSMENT CRITERIA:
    - Analyze language patterns, word choice, and sentence structure
    - Evaluate personality projection and cultural fit indicators
    - Consider industry appropriateness and target audience alignment
    - Assess consistency of tone throughout the document
    - Identify mixed tones and recommend primary classification
    - Provide specific examples from the resume content
    - Suggest tone adjustments based on career goals and industry standards

    ADVANCED EXTRACTION TECHNIQUES:

    CONTACT INFORMATION PROCESSING:
    - Multi-format phone number recognition and standardization
    - Professional email validation and format assessment
    - Geographic location extraction and market relevance
    - LinkedIn profile and portfolio link identification
    - Professional social media presence evaluation

    EXPERIENCE ANALYSIS:
    - Career timeline construction and gap identification
    - Role progression and responsibility evolution tracking
    - Industry experience diversity and specialization depth
    - Achievement quantification and impact measurement
    - Leadership experience and team management capabilities
    - Cross-functional collaboration and stakeholder management evidence

    EDUCATION & CERTIFICATION EVALUATION:
    - Degree relevance and institutional credibility assessment
    - Continuing education and professional development tracking
    - Industry certification currency and market value
    - Academic achievement and honor recognition
    - Relevant coursework and project experience integration

    SKILLS CATEGORIZATION & VALIDATION:
    - Technical skill proficiency level assessment
    - Soft skill evidence and behavioral competency demonstration
    - Skill currency and market demand alignment
    - Certification backing and practical application evidence
    - Skill gap identification for target role optimization

    CORNER CASE HANDLING EXPERTISE:
    - Non-traditional career paths and industry transitions
    - International education and experience translation
    - Creative industry portfolio integration requirements
    - Remote work experience and distributed collaboration skills
    - Startup vs. enterprise experience contextualization
    - Contract/consulting work presentation optimization
    - Career break explanations and re-entry strategies
    - Over-qualification management and positioning
    - Under-experience compensation through skill emphasis
    - Multi-lingual capabilities and global market positioning

    QUALITY ASSURANCE PROTOCOLS:
    - Cross-reference extracted data for consistency and accuracy
    - Validate contact information format and accessibility
    - Ensure chronological consistency and logical progression
    - Verify skill claims against experience evidence
    - Maintain professional standards and industry appropriateness
    - Handle incomplete or ambiguous information gracefully
    - Apply contextual intelligence for reasonable inference
    - Preserve data integrity throughout analysis process

    MODERN MARKET INTELLIGENCE:
    - Current hiring trend awareness and adaptation strategies
    - Skill demand forecasting and future-proofing recommendations
    - Industry-specific optimization techniques and best practices
    - Remote work capability emphasis and virtual collaboration skills
    - Diversity, equity, and inclusion consideration integration
    - Sustainable career development and continuous learning emphasis
    - Personal branding and professional narrative optimization
    - Competitive differentiation and unique value proposition identification

    Analyze this resume and provide a detailed assessment. Return a JSON response with the following structure:

    {
      "overallScore": number (0-100),
      "tone": {
        "category": string,
        "reasoning": string
      },
      "sections": {
        "formatting": {
          "score": number (0-100),
          "feedback": "string"
        },
        "content": {
          "score": number (0-100),
          "feedback": "string"
        },
        "keywords": {
          "score": number (0-100),
          "feedback": "string"
        },
        "atsCompatibility": {
          "score": number (0-100),
          "feedback": "string"
        },
        "experience": {
          "score": number (0-100),
          "feedback": "string"
        },
        "education": {
          "score": number (0-100),
          "feedback": "string"
        }
      },
      "extractedInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "summary": "string",
        "experience": "string",
        "education": "string",
        "skills": ["array of skills"]
      },
      "improvements": ["array of improvement suggestions"],
      "matchedSkills": ["array of identified skills"],
      "missingSkills": ["array of suggested skills to add"]
    }

    CRITICAL ANALYSIS PRIORITIES:
    1. ATS compatibility and parsing optimization (25% weight)
    2. Content quality and quantified achievement assessment (25% weight)
    3. Keyword optimization for modern job market positioning (25% weight)
    4. Professional presentation and visual hierarchy evaluation (15% weight)
    5. Structured information extraction and data integrity (10% weight)

    SCORING METHODOLOGY:
    - 90-100: Exceptional quality, market-leading optimization
    - 80-89: Strong performance, minor optimization opportunities
    - 70-79: Good foundation, moderate improvements needed
    - 60-69: Adequate baseline, significant enhancement required
    - 50-59: Below standard, major restructuring recommended
    - Below 50: Poor quality, complete overhaul necessary

    FEEDBACK REQUIREMENTS:
    - Provide specific, actionable improvement recommendations
    - Include industry-standard best practices and proven techniques
    - Offer quantifiable enhancement strategies with expected impact
    - Consider target role requirements and market positioning
    - Balance constructive criticism with strength recognition
    - Maintain professional tone while delivering honest assessment
    - Focus on competitive advantage creation and differentiation

    EXECUTION STANDARDS:
    - Apply comprehensive analysis across all evaluation dimensions
    - Extract maximum structured information with precision and accuracy
    - Provide expert-level feedback that transforms resume effectiveness
    - Ensure JSON output validity and complete data population
    - Maintain consistency between extracted information and assessment scores
    - Deliver institutional-grade analysis worthy of professional career services

    Return ONLY the JSON object with no additional text or formatting.
    `;

    // Send file and prompt to Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: Buffer.from(bytes).toString("base64"),
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the response and return
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
      const analysis = JSON.parse(cleanedText);

      return NextResponse.json({
        success: true,
        analysis,
        fileInfo: {
          fileId: crypto.randomUUID(),
          filePath: URL.createObjectURL(file),
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
        },
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse analysis results" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
