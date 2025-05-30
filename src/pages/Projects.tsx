import React from 'react';
import { PageTemplate } from '@/components/ui/page-template';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
}

const projectsData: Project[] = [
  {
    id: '1',
    title: 'Real-time Analytics Dashboard',
    description: 'Built a React/Node.js platform processing 100K+ events/second with 99.9% uptime. The system includes real-time data visualization, customizable widgets, and advanced filtering capabilities.',
    technologies: ['React', 'Node.js', 'WebSockets', 'Redis', 'D3.js', 'AWS'],
    githubUrl: 'https://github.com/example/analytics-dashboard',
    liveUrl: 'https://analytics-dashboard.example.com'
  },
  {
    id: '2',
    title: 'AI-Powered Recommendation Engine',
    description: 'Developed ML models improving user engagement by 40% using TensorFlow and Python. The recommendation system analyzes user behavior patterns to deliver personalized content suggestions.',
    technologies: ['Python', 'TensorFlow', 'Flask', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/example/recommendation-engine'
  },
  {
    id: '3',
    title: 'Distributed Trading Platform',
    description: 'Led a team of 8 to build a high-frequency trading system with sub-millisecond latency using Rust and Apache Kafka. The platform handles millions of transactions daily with robust fault tolerance.',
    technologies: ['Rust', 'Kafka', 'gRPC', 'ClickHouse', 'Kubernetes'],
    githubUrl: 'https://github.com/example/trading-platform'
  },
  {
    id: '4',
    title: 'Healthcare Data Integration API',
    description: 'Designed and implemented a HIPAA-compliant API for healthcare data integration across multiple systems. The solution improved data accessibility while maintaining strict security protocols.',
    technologies: ['TypeScript', 'Express', 'GraphQL', 'MongoDB', 'OAuth2'],
    githubUrl: 'https://github.com/example/healthcare-api'
  }
];

const Projects = () => {
  return (
    <PageTemplate
      title="Projects Portfolio"
      subtitle="Showcasing key projects and technical achievements"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectsData.map((project) => (
          <Card 
            key={project.id}
            className="bg-gray-800/60 backdrop-blur-sm border-white/10 p-6 hover:bg-gray-700/60 transition-all duration-300"
          >
            <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
            <p className="text-white/70 text-sm mb-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <Badge 
                  key={tech} 
                  className="bg-gray-700/80 text-cyan-400 hover:bg-gray-600/80"
                >
                  {tech}
                </Badge>
              ))}
            </div>
            
            <div className="flex space-x-3 mt-4">
              {project.githubUrl && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white/20 hover:bg-gray-700/80"
                  onClick={() => window.open(project.githubUrl, '_blank')}
                >
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </Button>
              )}
              
              {project.liveUrl && (
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600"
                  onClick={() => window.open(project.liveUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          variant="ghost" 
          className="text-white/70 hover:text-white hover:bg-transparent"
        >
          View More Projects
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </PageTemplate>
  );
};

export default Projects;
