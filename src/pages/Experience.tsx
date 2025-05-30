
import React from 'react';
import { ArrowLeft, Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Experience = () => {
  const navigate = useNavigate();

  const experiences = [
    {
      company: "TechCorp Inc.",
      role: "Senior Full-Stack Engineer",
      period: "2020 - Present",
      description: "Leading cross-functional teams of 12+ developers, architecting microservices handling 1M+ daily requests",
      achievements: ["Improved system performance by 40%", "Led migration to cloud architecture", "Mentored 8 junior developers"]
    },
    {
      company: "StartupXYZ",
      role: "Full-Stack Developer", 
      period: "2018 - 2020",
      description: "Built scalable web applications from ground up, focusing on user experience and performance",
      achievements: ["Developed 3 major product features", "Reduced load times by 60%", "Implemented CI/CD pipeline"]
    },
    {
      company: "DevStudio",
      role: "Frontend Developer",
      period: "2016 - 2018", 
      description: "Created responsive web interfaces and collaborated with design teams",
      achievements: ["Built 15+ client websites", "Implemented modern design systems", "Optimized for mobile-first"]
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
            <h1 className="text-3xl font-bold text-[#0E1B1A] dark:text-white">Professional Experience</h1>
            <p className="text-[#0E1B1A]/70 dark:text-white/70">8+ years in software development</p>
          </div>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <Card key={index} className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-[#0E1B1A]/10 dark:border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-6 w-6 text-[#0E1B1A]/60 dark:text-white/60" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#0E1B1A] dark:text-white">{exp.role}</h3>
                    <p className="text-[#0E1B1A]/80 dark:text-white/80 font-medium">{exp.company}</p>
                  </div>
                </div>
                <div className="flex items-center text-[#0E1B1A]/60 dark:text-white/60">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{exp.period}</span>
                </div>
              </div>
              <p className="text-[#0E1B1A]/70 dark:text-white/70 mb-4">{exp.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium text-[#0E1B1A] dark:text-white">Key Achievements:</h4>
                <ul className="list-disc list-inside space-y-1 text-[#0E1B1A]/70 dark:text-white/70">
                  {exp.achievements.map((achievement, achIndex) => (
                    <li key={achIndex}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
