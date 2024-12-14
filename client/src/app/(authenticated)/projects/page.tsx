import ProjectsPage from "@/modules/projects/projects.page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Project Management System",
  description: "A modern project management system",
  keywords: "project management, team collaboration, task management",
  openGraph: {
    title: "Projects - Project Management System",
    description: "A modern project management system",
    url: "/projects",
    siteName: "Project Management System",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Project Management System",
      },
    ],
  },
  creator: 'Kingsley Ihemelandu',
  appLinks: {
    web: {
      url: 'https://my-pms.vercel.app',
    },
  }
}

export default function Projects() {
  return <ProjectsPage />
}