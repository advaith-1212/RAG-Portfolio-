import React from 'react';
import { PageTemplate } from '@/components/ui/page-template';
import { MagnetLinesDemo } from '@/components/ui/magnet-lines-demo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MagnetDemo = () => {
  const navigate = useNavigate();

  return (
    <PageTemplate
      title="Magnet Lines Demo"
      subtitle="Interactive component that responds to mouse movement"
    >
      <div className="flex flex-col gap-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-fit flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
        
        <Card className="p-8 bg-gray-800/60 backdrop-blur-sm border-white/10 shadow-2xl">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Magnet Lines</h2>
              <p className="text-white/70">
                Move your cursor around to see the lines respond to your movement
              </p>
            </div>
            
            <MagnetLinesDemo />
            
            <div className="text-sm text-white/60 bg-gray-700/50 p-4 rounded-md">
              <p className="mb-2 font-medium">How it works:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The component creates a grid of lines using CSS Grid</li>
                <li>Each line tracks the cursor position using pointer events</li>
                <li>The rotation angle is calculated based on the distance and angle from each line to the cursor</li>
                <li>CSS transforms are applied dynamically to create the magnetic effect</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default MagnetDemo; 