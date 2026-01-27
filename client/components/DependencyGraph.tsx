import React from "react";
import { DependencyGraphVisualization } from "./DependencyGraphVisualization";
import { buildGraphForTech, dependencyGraphData } from "@/data/dependencyGraphData";

interface DependencyGraphProps {
  techStack: {
    name: string;
    version?: string;
    type?: string;
    logo?: string;
    cveCount?: number;
    id?: string;
  };
}

export function DependencyGraph({ techStack }: DependencyGraphProps) {
  // Try to find the tech in our data
  let graphData = null;

  if (techStack.id) {
    graphData = buildGraphForTech(techStack.id, dependencyGraphData);
  } else {
    // Fallback: try to match by name
    const matchedTech = dependencyGraphData.technologies.find(
      (t) => t.product.toLowerCase() === techStack.name.toLowerCase(),
    );
    if (matchedTech) {
      graphData = buildGraphForTech(matchedTech.id, dependencyGraphData);
    }
  }

  return (
    <DependencyGraphVisualization
      techStack={techStack}
      nodes={graphData?.nodes}
      edges={graphData?.edges}
    />
  );
}
