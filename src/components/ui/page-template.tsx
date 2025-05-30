import React, { ReactNode } from "react";

interface PageTemplateProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl relative z-20 min-h-screen">
      {/* Page Header */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-white">{title}</h1>
          )}
          {subtitle && (
            <p className="text-white/70 text-lg">{subtitle}</p>
          )}
        </div>
      )}
      
      {/* Page Content */}
      {children}
    </div>
  );
}; 