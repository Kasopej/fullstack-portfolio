'use client'
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectsQuery } from "@/queries/endpoints/projects.queries";
import Image from "next/image";

const ProjectSKeletonLoader = () => {
  return (
    <article className="w-full">
      <Skeleton className="w-full aspect-video mb-4" />
      <div className="flex flex-col gap-4">
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-full h-12" />
      </div>
    </article>
  );
};

export default function ProjectList() {
      const { data: projects = [] } = useGetProjectsQuery();
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <article key={project.id} className="w-full flex flex-col gap-4">
            <Image
              src={project.image}
              alt={project.title}
              className="w-full aspect-video"
            />
            <div className="flex flex-col gap-4">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
        <ProjectSKeletonLoader />
        <ProjectSKeletonLoader />
      </div>
    );
}