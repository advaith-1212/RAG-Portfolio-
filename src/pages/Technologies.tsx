
import React from 'react';
import { ArrowLeft, Code2, Database, Cloud, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Technologies = () => {
  const navigate = useNavigate();

  const techCategories = [
    {
      category: "Frontend",
      icon: Code2,
      technologies: ["React", "TypeScript", "Next.js", "Vue.js", "WebGL", "D3.js", "Tailwind CSS", "SASS"]
    },
    {
      category: "Backend", 
      icon: Database,
      technologies: ["Node.js", "Python", "Rust", "Java", "Go", "Express", "FastAPI", "Django"]
    },
    {
      category: "Cloud & DevOps",
      icon: Cloud,
      technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Grafana", "Prometheus", "Jenkins"]
    },
    {
      category: "Mobile & Other",
      icon: Smartphone,
      technologies: ["React Native", "Flutter", "GraphQL", "REST APIs", "WebSocket", "Microservices"]
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
            <h1 className="text-3xl font-bold text-[#0E1B1A] dark:text-white">Technologies & Skills</h1>
            <p className="text-[#0E1B1A]/70 dark:text-white/70">40+ technologies mastered</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {techCategories.map((category, index) => (
            <Card key={index} className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-[#0E1B1A]/10 dark:border-white/10">
              <div className="flex items-center mb-4">
                <category.icon className="h-6 w-6 text-[#0E1B1A]/80 dark:text-white/80 mr-3" />
                <h3 className="text-xl font-semibold text-[#0E1B1A] dark:text-white">{category.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex} 
                    className="bg-[#0E1B1A]/10 dark:bg-white/10 text-[#0E1B1A] dark:text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Technologies;
