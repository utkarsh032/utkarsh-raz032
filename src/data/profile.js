export const profile = {
  name: "Utkarsh Raj",
  initials: "UR",
  role: "Full-stack developer",
  tagline: "Software engineer · Full-stack developer",
  location: "Greater Noida, IN",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST · UTC+5:30",
  available: true,
  availability: "Open to new roles",
  email: "utkarshraj525@gmail.com",
  resume: "/Utkarsh_Raj_Resume.pdf",
  siteUrl: "https://utkarsh-raz032.netlify.app",
  ogImage: "/og.png",
  motto: "Building better software, one problem at a time.",
  links: {
    github: "https://github.com/utkarsh032",
    linkedin: "https://www.linkedin.com/in/utkarsh-raj032official/",
  },
  githubUser: "utkarsh032",
  // Contact section: what people can reach out about. Each sets the email subject.
  openTo: [
    { id: "role", label: "Full-time role", subject: "Full-time role" },
    { id: "project", label: "Freelance project", subject: "Project enquiry" },
    { id: "collab", label: "Collaboration", subject: "Collaboration" },
    { id: "hello", label: "Just saying hi", subject: "Hello" },
  ],
};

// Primary navigation: ids must match <Section id>
export const resumeDoc = { title: `${profile.name} · Resume`, href: profile.resume, meta: "PDF" };

export const navSections = [
  { id: "work", label: "Work" },
  { id: "method", label: "Method" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
