import React from 'react';
import { ArrowLeft, Code2, Database, Cloud, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '@/components/ui/page-template';

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
    <PageTemplate
      title="Technologies & Skills"
      subtitle="40+ technologies mastered"
    >
      <div className="flex flex-col gap-6">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="w-fit border-white/20 bg-gray-800/80 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {techCategories.map((category, index) => (
            <Card key={index} className="p-6 bg-gray-800/60 backdrop-blur-sm border-white/10">
              <div className="flex items-center mb-4">
                <category.icon className="h-6 w-6 text-white/80 mr-3" />
                <h3 className="text-xl font-semibold text-white">{category.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex} 
                    className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default Technologies;
