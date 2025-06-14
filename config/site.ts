export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ResumeIQ",
  description:
    "AI-powered platform for job seekers to create winning resumes and recruiters to find perfect candidates faster",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Jobs",
      href: "/jobs",
    },
    {
      label: "Create Resume",
      href: "/resume/create",
    },
    {
      label: "Upload Resume",
      href: "/resume/upload",
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
      label: "Create Resume",
      href: "/resume/create",
    },
    {
      label: "Upload Resume",
      href: "/resume/upload",
    },
    {
      label: "For Recruiters",
      href: "/auth/register?type=hr",
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
