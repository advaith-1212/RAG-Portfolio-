
import React from 'react';
import { ArrowLeft, Code, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();

  const projects = [
    {
      title: "Real-time Analytics Dashboard",
      description: "Built a React/Node.js platform processing 100K+ events/second with 99.9% uptime",
      tech: ["React", "Node.js", "WebSocket", "Redis"],
      status: "Live"
    },
    {
      title: "AI-Powered Recommendation Engine", 
      description: "Developed ML models improving user engagement by 40% using TensorFlow and Python",
      tech: ["TensorFlow", "Python", "FastAPI", "PostgreSQL"],
      status: "Live"
    },
    {
      title: "Distributed Trading Platform",
      description: "Led a team of 8 to build a high-frequency trading system with sub-millisecond latency",
      tech: ["Rust", "Apache Kafka", "Kubernetes", "ClickHouse"],
      status: "Live"
    }
  ];

  return (
    <div className="min-h-screen bg-[#55C2BB] dark:bg-gray-900 text-[#0E1B1A] dark:text-white transition-colors">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="mr-4 border-[#0E1B1A]/20 dark:border-white/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#0E1B1A] dark:text-white">Projects Portfolio</h1>
            <p className="text-[#0E1B1A]/70 dark:text-white/70">25+ completed projects</p>
          </div>
        </div>

        <div className="grid gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-[#0E1B1A]/10 dark:border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#0E1B1A] dark:text-white">{project.title}</h3>
                  <p className="text-[#0E1B1A]/70 dark:text-white/70 mt-2">{project.description}</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded text-sm">
                  {project.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, techIndex) => (
                  <span key={techIndex} className="bg-[#0E1B1A]/10 dark:bg-white/10 text-[#0E1B1A] dark:text-white px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-[#0E1B1A]/20 dark:border-white/20">
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </Button>
                <Button size="sm" variant="outline" className="border-[#0E1B1A]/20 dark:border-white/20">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
