import React from 'react';
import { ArrowLeft, TrendingUp, CheckCircle, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '@/components/ui/page-template';

const SuccessRate = () => {
  const navigate = useNavigate();

  const metrics = [
    {
      title: "Project Completion Rate",
      value: "98%",
      description: "Successfully delivered projects on time and within scope",
      icon: CheckCircle,
      color: "text-emerald-400"
    },
    {
      title: "Client Satisfaction",
      value: "96%",
      description: "Average client satisfaction score across all projects",
      icon: Target,
      color: "text-blue-400"
    },
    {
      title: "On-Time Delivery",
      value: "99%",
      description: "Projects delivered within agreed timelines",
      icon: Clock,
      color: "text-purple-400"
    },
    {
      title: "Performance Improvement",
      value: "85%",
      description: "Average performance improvement in client systems",
      icon: TrendingUp,
      color: "text-orange-400"
    }
  ];

  return (
    <PageTemplate
      title="Success Metrics"
      subtitle="98% overall success rate"
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

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6 bg-gray-800/60 backdrop-blur-sm border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <metric.icon className={`h-8 w-8 ${metric.color} mr-3`} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{metric.title}</h3>
                    <p className={`text-3xl font-bold ${metric.color} mt-1`}>{metric.value}</p>
                  </div>
                </div>
              </div>
              <p className="text-white/70">{metric.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-gray-800/60 backdrop-blur-sm border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Success Factors</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">150+</div>
              <div className="text-white/70">Satisfied Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">500+</div>
              <div className="text-white/70">Bugs Fixed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">99.9%</div>
              <div className="text-white/70">Uptime Achieved</div>
            </div>
          </div>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default SuccessRate;
