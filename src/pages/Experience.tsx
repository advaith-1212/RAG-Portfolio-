import React from 'react';
import { ArrowLeft, Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '@/components/ui/page-template';

const Experience = () => {
  const navigate = useNavigate();

  const experiences = [
  {
    company: "TrenchExchange",
    role: "Founding Team",
    period: "Dec 2024 – Present",
    description:
      "Defined JTBD for real-time alpha discovery. Scoped MVP, sequenced roadmap, executed early BD and investor outreach.",
    achievements: [
      "Designed snipe-in/safe-out execution flows",
      "Ran product demos; converted feedback into user stories",
      "Built early VC pipeline and partnership funnel",
      
    ]
  },
  {
    company: "Deccan AI",
    role: "ML Ops Intern (R&D)",
    period: "Mar 2025 – Jul 2025",
    description:
      "Owned protocol design, rubric creation, dataset curation, and analysis for two research studies; delivered synthetic-data pipelines for enterprise clients.",
    achievements: [
      "Delivered E2E data pipelines for Microsoft and Apple",
      "Owned Google SFT-Data supply/delivery workflows",
      "Standardized failure-mode taxonomies across teams"
    ]
  },
  {
    company: "IEEE",
    role: "Invited Peer Reviewer",
    period: "May 2024 – Sep 2025",
    description:
      "Reviewed AI/ML papers for INDISCON, CVMI, ISSC; assessed novelty, methodology, and rigor under strict deadlines.",
    achievements: [
      "Produced formal review reports and recommendations",
      "Strengthened academic profile through repeated invitations",
      "Contributed to global research communities"
    ]
  }
];

  return (
    <PageTemplate
      title="Professional Experience"
      subtitle="8+ years in software development"
    >
      <div className="space-y-6">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="mb-4 border-white/20 bg-gray-800/80 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {experiences.map((exp, index) => (
          <Card key={index} className="p-6 bg-gray-800/60 backdrop-blur-sm border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <Building className="h-6 w-6 text-white/60" />
                <div>
                  <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                  <p className="text-white/80 font-medium">{exp.company}</p>
                </div>
              </div>
              <div className="flex items-center text-white/60">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">{exp.period}</span>
              </div>
            </div>
            <p className="text-white/70 mb-4">{exp.description}</p>
            <div className="space-y-2">
              <h4 className="font-medium text-white">Key Achievements:</h4>
              <ul className="list-disc list-inside space-y-1 text-white/70">
                {exp.achievements.map((achievement, achIndex) => (
                  <li key={achIndex}>{achievement}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </PageTemplate>
  );
};

export default Experience;
