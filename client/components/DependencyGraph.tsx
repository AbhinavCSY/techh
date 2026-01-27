import React from "react";
import { DependencyGraphVisualization } from "./DependencyGraphVisualization";

interface DependencyGraphProps {
  techStack: {
    name: string;
    version?: string;
    type?: string;
    logo?: string;
    cveCount?: number;
  };
}

export function DependencyGraph({ techStack }: DependencyGraphProps) {
  return <DependencyGraphVisualization techStack={techStack} />;
}
