export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Resume Tracker ATS",
  description:
    "AI-powered Applicant Tracking System with intelligent resume analysis and matching",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Jobs",
      href: "/jobs",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Jobs",
      href: "/jobs",
    },
    {
      label: "Login",
      href: "/auth/login",
    },
  ],
  links: {
    github: "https://github.com/your-username/resume-tracker",
    docs: "/docs",
  },
};
