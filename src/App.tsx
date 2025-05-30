import React, { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/ui/layout";

// Lazy load cursor components for better initial loading
const InteractiveCursor = lazy(() => import("@/components/ui/interactive-cursor").then(mod => ({ default: mod.InteractiveCursor })));
const CursorTrail = lazy(() => import("@/components/ui/cursor-trail").then(mod => ({ default: mod.CursorTrail })));

// Lazy load page components for better performance
const Index = lazy(() => import("./pages/Index"));
const Projects = lazy(() => import("./pages/Projects"));
const Experience = lazy(() => import("./pages/Experience"));
const Technologies = lazy(() => import("./pages/Technologies"));
const SuccessRate = lazy(() => import("./pages/SuccessRate"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Simple loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" />
      <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
      <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
    </div>
  </div>
);

// Create query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

const App = () => {
  // Only load cursor effects after main content is loaded
  const [showCursorEffects, setShowCursorEffects] = useState(false);
  
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Listen for changes
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    // Enable cursor effects after a delay to prioritize main content loading
    const timer = setTimeout(() => {
      setShowCursorEffects(true);
    }, 800); // Slightly reduced delay for better UX
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearTimeout(timer);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Only load cursor effects if not preferring reduced motion */}
        {showCursorEffects && !prefersReducedMotion && (
          <Suspense fallback={null}>
            <InteractiveCursor 
              color="rgba(56, 189, 248, 0.8)"
              ringColor="rgba(56, 189, 248, 0.4)"
              size={8}
              hoverSize={12}
              ringSize={32}
              hoverRingSize={48}
            />
            <CursorTrail 
              color="rgba(124, 58, 237, 0.6)"
              size={6}
              trailLength={5} // Further reduced for better performance
            />
          </Suspense>
        )}
        
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/technologies" element={<Technologies />} />
                <Route path="/success-rate" element={<SuccessRate />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
