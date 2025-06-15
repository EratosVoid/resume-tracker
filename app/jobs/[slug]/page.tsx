import { Metadata } from "next";
import { notFound } from "next/navigation";
import JobDetails from "@/components/jobs/JobDetails";
import JobApplicationSection from "@/components/jobs/JobApplicationSection";

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

async function getJob(slug: string) {
  try {
    const response = await fetch(
      `${process.env.APP_URL || "http://localhost:3000"}/api/jobs/${slug}`,
      {
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.job;
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return {
      title: "Job Not Found - Resume Tracker ATS",
    };
  }

  return {
    title: `${job.title} - Resume Tracker ATS`,
    description: job.description.substring(0, 160) + "...",
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="h-screen max-h-screen bg-gradient-to-br from-default-50 via-background to-primary-50/20 overflow-y-auto scroll-smooth">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/10"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
              🚀 Now Hiring
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {job.title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Join our team and help us build the future together
            </p>

            {/* Apply Now Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#apply-section"
                className="group inline-flex items-center px-10 py-5 bg-white hover:bg-white/95 backdrop-blur-sm rounded-full text-primary-600 font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-white/50 hover:border-white shadow-lg"
              >
                <span className="mr-3">Apply Now</span>
                <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-primary-600 transform group-hover:translate-x-0.5 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </a>

              <div className="flex items-center text-white/80 text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Quick & Easy Application
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-8">
          {/* Job Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <JobDetails job={job} />
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-success-50 to-success-100/50 backdrop-blur-sm rounded-xl p-6 border border-success-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">💼</span>
                </div>
                <div>
                  <h3 className="font-semibold text-success-800">
                    Great Benefits
                  </h3>
                  <p className="text-sm text-success-600">
                    Competitive package included
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 backdrop-blur-sm rounded-xl p-6 border border-primary-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800">
                    Growth Opportunities
                  </h3>
                  <p className="text-sm text-primary-600">
                    Advance your career with us
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100/50 backdrop-blur-sm rounded-xl p-6 border border-secondary-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800">
                    Top Rated Company
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Join our award-winning team
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compelling CTA Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl p-12 text-white border border-primary-500/20 dark:border-slate-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white dark:bg-primary-300 rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-300 dark:bg-secondary-400 rounded-full translate-x-16 translate-y-16"></div>
              <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-300 dark:bg-primary-400 rounded-full"></div>
            </div>

            <div className="relative text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/30 dark:border-white/20">
                <span className="text-3xl">🚀</span>
              </div>

              <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-white">
                Your Career Breakthrough
                <span className="block text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-primary-300 dark:to-secondary-300 bg-clip-text">
                  Starts Here
                </span>
              </h3>

              <p className="text-xl text-white/90 dark:text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                Don't just find a job—discover your potential. Join a team that
                values innovation, growth, and the unique perspective you bring
                to the table.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/10">
                  <div className="text-3xl font-bold text-yellow-300 dark:text-primary-300 mb-1">
                    2-3 days
                  </div>
                  <div className="text-sm text-white/80 dark:text-slate-300">
                    Average response time
                  </div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/10">
                  <div className="text-3xl font-bold text-orange-300 dark:text-secondary-300 mb-1">
                    94%
                  </div>
                  <div className="text-sm text-white/80 dark:text-slate-300">
                    Candidate satisfaction
                  </div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/10">
                  <div className="text-3xl font-bold text-green-300 dark:text-success-300 mb-1">
                    5 min
                  </div>
                  <div className="text-sm text-white/80 dark:text-slate-300">
                    Application time
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#apply-section"
                  className="group inline-flex items-center px-10 py-5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-white/20"
                >
                  <span className="mr-3">Apply Now - It's Free</span>
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-300">
                    <svg
                      className="w-3 h-3 text-primary-600 transform group-hover:translate-x-0.5 transition-transform duration-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </a>

                <div className="flex items-center text-white/80 dark:text-slate-300 text-sm">
                  <svg
                    className="w-4 h-4 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No cover letter required
                </div>
              </div>
            </div>
          </div>

          {/* Quick Apply Section */}
          <div id="apply-section" className="relative scroll-mt-8">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 dark:from-primary-500/5 dark:via-secondary-500/5 dark:to-primary-500/5 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent dark:from-slate-800/40 dark:via-slate-900/20 dark:to-transparent rounded-3xl backdrop-blur-sm"></div>

            {/* Floating Elements */}
            <div className="absolute top-4 right-8 w-20 h-20 bg-primary-200/30 dark:bg-primary-400/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-8 left-12 w-16 h-16 bg-secondary-200/30 dark:bg-secondary-400/20 rounded-full blur-lg"></div>

            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 dark:border-slate-700/60 overflow-hidden target:ring-4 target:ring-primary-200 dark:target:ring-primary-400 target:ring-opacity-50 transition-all duration-500">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 dark:from-primary-700 dark:via-primary-600 dark:to-secondary-600 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white/20 dark:via-white/5 dark:to-white/10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 dark:bg-white/15 backdrop-blur-sm rounded-2xl mb-4 border border-white/30 dark:border-white/20">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Ready to Apply?
                  </h2>
                  <p className="text-primary-100 dark:text-primary-200 text-lg">
                    Submit your application and join our amazing team
                  </p>
                </div>
              </div>

              {/* Application Form */}
              <div className="p-8">
                <JobApplicationSection job={job} />
              </div>

              {/* Trust Indicators */}
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-success-50 to-success-100/50 dark:from-success-900/20 dark:to-success-800/30 backdrop-blur-sm rounded-xl p-4 border border-success-200/50 dark:border-success-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success-500 dark:bg-success-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">⏱️</span>
                        </div>
                        <span className="text-success-700 dark:text-success-300 font-medium">
                          Response Time
                        </span>
                      </div>
                      <span className="font-bold text-success-600 dark:text-success-400">
                        2-3 days
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/30 backdrop-blur-sm rounded-xl p-4 border border-primary-200/50 dark:border-primary-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 dark:bg-primary-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">📈</span>
                        </div>
                        <span className="text-primary-700 dark:text-primary-300 font-medium">
                          Success Rate
                        </span>
                      </div>
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        94%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white py-16 border-t border-slate-700/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Join Our Team?
          </h2>
          <p className="text-lg text-slate-300 dark:text-slate-400 mb-8">
            Don't miss out on this opportunity. Apply now and take the next step
            in your career.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center text-sm text-slate-400 dark:text-slate-500">
              <span className="mr-2">🔒</span>
              Your data is secure and confidential
            </div>
            <div className="flex items-center text-sm text-slate-400 dark:text-slate-500">
              <span className="mr-2">⚡</span>
              Application processed within 24 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
