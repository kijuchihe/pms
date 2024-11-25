import ProjectDetailPage from "@/modules/projects/project-detail.page";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Project Detail - Project Management System",
  description: "A modern project management system",
}

export default function ProjectDetail() {
  return <ProjectDetailPage />;
}