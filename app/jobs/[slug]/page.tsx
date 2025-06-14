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
    <div className="h-screen max-h-screen bg-gradient-to-br from-default-50 via-background to-primary-50/20 overflow-y-auto">
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
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join our team and help us build the future together
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Quick Apply Section */}
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-3xl backdrop-blur-sm"></div>

            {/* Floating Elements */}
            <div className="absolute top-4 right-8 w-20 h-20 bg-primary-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-8 left-12 w-16 h-16 bg-secondary-200/30 rounded-full blur-lg"></div>

            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Ready to Apply?
                  </h2>
                  <p className="text-primary-100 text-lg">
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
                  <div className="bg-gradient-to-r from-success-50 to-success-100/50 backdrop-blur-sm rounded-xl p-4 border border-success-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">⏱️</span>
                        </div>
                        <span className="text-success-700 font-medium">
                          Response Time
                        </span>
                      </div>
                      <span className="font-bold text-success-600">
                        2-3 days
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 backdrop-blur-sm rounded-xl p-4 border border-primary-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">📈</span>
                        </div>
                        <span className="text-primary-700 font-medium">
                          Success Rate
                        </span>
                      </div>
                      <span className="font-bold text-primary-600">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-default-900 to-default-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
          <p className="text-lg text-default-300 mb-8">
            Don't miss out on this opportunity. Apply now and take the next step
            in your career.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center text-sm text-default-400">
              <span className="mr-2">🔒</span>
              Your data is secure and confidential
            </div>
            <div className="flex items-center text-sm text-default-400">
              <span className="mr-2">⚡</span>
              Application processed within 24 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
