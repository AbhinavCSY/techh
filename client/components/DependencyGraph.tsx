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

// Mapping from tech names to dependency graph IDs
const techNameToGraphId: Record<string, string> = {
  "Log4j": "tech-log4j",
  "Spring Framework": "tech-spring",
  "Apache HTTP Server": "tech-httpd",
  "Apache Tomcat": "tech-tomcat",
  "curl": "tech-curl",
  "OpenSSL": "tech-openssl",
  "Node.js": "tech-nodejs",
  "Express.js": "tech-express",
  "React": "tech-react",
  "Django": "tech-django",
  "AWS SDK for Python (boto3)": "tech-boto3",
  "Nginx": "tech-nginx",
  "PostgreSQL": "tech-postgres",
  "MySQL": "tech-mysql",
  "MongoDB": "tech-mongodb",
  "Redis": "tech-redis",
  "Docker": "tech-docker",
  "containerd": "tech-containerd",
  "Kubernetes": "tech-kubernetes",
  "Swagger": "tech-swagger",
  "Swagger Doc": "tech-swagger",
  "Amazon S3 Bucket": "tech-s3",
  "Amazon S3": "tech-s3",
  "Customer Management Service": "tech-java-app",
  "Java Virtual Machine": "tech-jvm",
};

export function DependencyGraph({ techStack }: DependencyGraphProps) {
  // Try to find the tech in our dependency graph data
  let graphData = null;
  let graphTechId: string | null = null;

  // First try to match by name in the mapping
  if (techStack.name && techNameToGraphId[techStack.name]) {
    graphTechId = techNameToGraphId[techStack.name];
    graphData = buildGraphForTech(graphTechId, dependencyGraphData);
  }

  // Fallback: try to match by name directly in our data
  if (!graphData) {
    const matchedTech = dependencyGraphData.technologies.find(
      (t) => t.product.toLowerCase() === techStack.name.toLowerCase(),
    );
    if (matchedTech) {
      graphTechId = matchedTech.id;
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
