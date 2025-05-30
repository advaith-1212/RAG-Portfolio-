
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Sun, Moon, User, Bot, BarChart3, Activity, Code, Database, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCountUp } from '@/hooks/useCountUp';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Index = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Animated counters
  const projectsCount = useCountUp(25, 2000);
  const experienceCount = useCountUp(8, 2000);
  const technologiesCount = useCountUp(40, 2000);
  const successRateCount = useCountUp(98, 2000);

  const quickStartPrompts = [
    "Can you summarize your professional experience?",
    "What are some key projects you've completed?",
    "List your primary technical skills and tools",
    "Could you share details about your educational background?",
    "What are your recent professional activities?",
    "Tell me about your career highlights"
  ];

  // Portfolio metrics with navigation
  const portfolioMetrics = [
    { 
      icon: Code, 
      label: "Projects", 
      value: `${projectsCount}+`, 
      color: "text-cyan-600 dark:text-cyan-400",
      route: "/projects"
    },
    { 
      icon: Globe, 
      label: "Years Exp", 
      value: `${experienceCount}+`, 
      color: "text-emerald-600 dark:text-emerald-400",
      route: "/experience"
    },
    { 
      icon: Database, 
      label: "Technologies", 
      value: `${technologiesCount}+`, 
      color: "text-blue-600 dark:text-blue-400",
      route: "/technologies"
    },
    { 
      icon: Zap, 
      label: "Success Rate", 
      value: `${successRateCount}%`, 
      color: "text-yellow-600 dark:text-yellow-400",
      route: "/success-rate"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Set light mode by default and add welcome message
    document.documentElement.classList.remove('dark');
    const welcomeMessage: Message = {
      id: '1',
      content: "Hello! I'm your AI portfolio assistant. I'm here to help you explore my professional background, skills, and experiences. Feel free to ask me anything about my career journey, or use one of the quick prompts below to get started!",
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve(true);
      }, 1500 + Math.random() * 1000);
    });
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    await simulateTyping();

    // Enhanced AI responses with more technical depth
    const aiResponses = {
      'professional experience': "I have over 8 years of experience in full-stack development and AI/ML engineering, specializing in scalable web applications and data-driven solutions. My career highlights include leading cross-functional teams of 12+ developers, architecting microservices handling 1M+ daily requests, and driving technical innovation across multiple domains including fintech, healthcare, and e-commerce.",
      'projects': "Key projects include: 1) **Real-time Analytics Dashboard** - Built a React/Node.js platform processing 100K+ events/second with 99.9% uptime, 2) **AI-Powered Recommendation Engine** - Developed ML models improving user engagement by 40% using TensorFlow and Python, 3) **Distributed Trading Platform** - Led a team of 8 to build a high-frequency trading system with sub-millisecond latency using Rust and Apache Kafka.",
      'skills': "**Frontend:** React, TypeScript, Next.js, Vue.js, WebGL, D3.js | **Backend:** Node.js, Python, Rust, Java, Go | **Cloud & DevOps:** AWS (Solutions Architect Certified), Docker, Kubernetes, Terraform | **Databases:** PostgreSQL, MongoDB, Redis, ClickHouse | **AI/ML:** TensorFlow, PyTorch, Scikit-learn, OpenAI API | **Tools:** Git, CI/CD, Monitoring (Grafana, Prometheus)",
      'education': "**M.S. Computer Science** - Stanford University (2016) - Focus on Machine Learning and Distributed Systems, GPA: 3.9/4.0 | **B.S. Software Engineering** - UC Berkeley (2014) - Magna Cum Laude | **Certifications:** AWS Solutions Architect Professional, Google Cloud ML Engineer, Kubernetes CKA",
      'default': "That's a great question! I'm designed to discuss various aspects of my professional journey. Could you be more specific about what you'd like to know? You can ask about my experience, skills, projects, education, or recent activities. I can also share insights about specific technologies, methodologies, or industry trends I've worked with."
    };

    const getResponse = (query: string) => {
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('experience') || lowerQuery.includes('career') || lowerQuery.includes('professional')) {
        return aiResponses['professional experience'];
      } else if (lowerQuery.includes('project')) {
        return aiResponses['projects'];
      } else if (lowerQuery.includes('skill') || lowerQuery.includes('technical') || lowerQuery.includes('tools')) {
        return aiResponses['skills'];
      } else if (lowerQuery.includes('education') || lowerQuery.includes('degree') || lowerQuery.includes('university')) {
        return aiResponses['education'];
      } else {
        return aiResponses['default'];
      }
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: getResponse(content),
      sender: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleMetricClick = (route: string) => {
    navigate(route);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-[#55C2BB] dark:bg-gray-900 text-[#0E1B1A] dark:text-white transition-colors">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-r from-[#0E1B1A] to-gray-700 dark:from-cyan-500 dark:to-emerald-500 rounded-xl shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0E1B1A] dark:text-white">
                AI Portfolio Dashboard
              </h1>
              <p className="text-[#0E1B1A]/70 dark:text-white/70 text-lg">
                Interactive Professional Profile System
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#0E1B1A]/10 dark:border-white/10">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[#0E1B1A]/70 dark:text-white/70 text-sm">System Online</span>
            </div>
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="icon"
              className="border-[#0E1B1A]/20 dark:border-white/20 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700/50"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-[#0E1B1A]" />}
            </Button>
          </div>
        </div>

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {portfolioMetrics.map((metric, index) => (
            <Card 
              key={index} 
              className="bg-white/90 dark:bg-gray-800/60 backdrop-blur-sm border-[#0E1B1A]/10 dark:border-white/10 p-4 hover:bg-white dark:hover:bg-gray-700/60 transition-all duration-300 cursor-pointer"
              onClick={() => handleMetricClick(metric.route)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#0E1B1A]/70 dark:text-white/70 text-sm">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color} opacity-80`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col bg-white/90 dark:bg-gray-800/60 backdrop-blur-sm border-[#0E1B1A]/10 dark:border-white/10 shadow-2xl">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#0E1B1A]/10 dark:border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-[#0E1B1A] to-gray-700 dark:from-cyan-500 dark:to-blue-500 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0E1B1A] dark:text-cyan-400">AI Assistant</h3>
                    <p className="text-xs text-[#0E1B1A]/60 dark:text-white/60">Professional Profile Query System</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#0E1B1A]/60 dark:text-white/60">Active</span>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`flex max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                        <div className={`p-2 rounded-xl ${message.sender === 'user' ? 'bg-[#0E1B1A] dark:bg-cyan-600 ml-3' : 'bg-gradient-to-r from-emerald-600 to-cyan-600 mr-3'} shadow-lg`}>
                          {message.sender === 'user' ? 
                            <User className="h-4 w-4 text-white" /> : 
                            <Bot className="h-4 w-4 text-white" />
                          }
                        </div>
                        <div
                          className={`p-4 rounded-2xl shadow-lg ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-[#0E1B1A] to-gray-700 dark:from-cyan-600 dark:to-blue-600 text-white rounded-br-sm'
                              : 'bg-white dark:bg-gray-700/80 text-[#0E1B1A] dark:text-white border border-[#0E1B1A]/10 dark:border-white/10 rounded-bl-sm'
                          } hover-scale`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-lg">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-gray-700/80 border border-[#0E1B1A]/10 dark:border-white/10 p-4 rounded-2xl rounded-bl-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-[#0E1B1A]/10 dark:border-white/10 bg-white/50 dark:bg-gray-800/40">
                <div className="flex space-x-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Query professional profile data..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1 bg-white dark:bg-gray-700/50 border-[#0E1B1A]/20 dark:border-white/20 text-[#0E1B1A] dark:text-white placeholder:text-[#0E1B1A]/60 dark:placeholder:text-white/60 focus:ring-2 focus:ring-[#0E1B1A] dark:focus:ring-cyan-500 focus:border-transparent"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-[#0E1B1A] to-gray-700 dark:from-cyan-600 dark:to-emerald-600 hover:from-[#0E1B1A]/90 hover:to-gray-700/90 dark:hover:from-cyan-700 dark:hover:to-emerald-700 border-0 shadow-lg text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Side Panel - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Start Commands */}
            <Card className="bg-white/90 dark:bg-gray-800/60 backdrop-blur-sm border-[#0E1B1A]/10 dark:border-white/10 p-4">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-5 w-5 text-[#0E1B1A] dark:text-cyan-400" />
                <h3 className="font-semibold text-[#0E1B1A] dark:text-cyan-400">Quick Commands</h3>
              </div>
              <div className="space-y-2">
                {quickStartPrompts.slice(0, 4).map((prompt, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-3 bg-white dark:bg-gray-700/50 border-[#0E1B1A]/20 dark:border-white/20 text-[#0E1B1A] dark:text-white hover:bg-[#0E1B1A]/5 dark:hover:bg-gray-600/50 hover:text-[#0E1B1A] dark:hover:text-cyan-400 text-xs transition-all duration-200 animate-fade-in opacity-0"
                    style={{
                      animationDelay: `${index * 200}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <span className="text-[#0E1B1A] dark:text-cyan-400 mr-2">›</span>
                    {prompt.substring(0, 30)}...
                  </Button>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/90 dark:bg-gray-800/60 backdrop-blur-sm border-[#0E1B1A]/10 dark:border-white/10 p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-5 w-5 text-[#0E1B1A] dark:text-blue-400" />
                <h3 className="font-semibold text-[#0E1B1A] dark:text-blue-400">Recent Activity</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-[#0E1B1A]/70 dark:text-white/70">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  <span>Skills query processed</span>
                  <span className="ml-auto">2m ago</span>
                </div>
                <div className="flex items-center space-x-2 text-[#0E1B1A]/70 dark:text-white/70">
                  <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                  <span>Experience overview generated</span>
                  <span className="ml-auto">5m ago</span>
                </div>
                <div className="flex items-center space-x-2 text-[#0E1B1A]/70 dark:text-white/70">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span>Project details retrieved</span>
                  <span className="ml-auto">12m ago</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg px-6 py-3 border border-[#0E1B1A]/10 dark:border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[#0E1B1A]/70 dark:text-white/70 text-sm">AI Assistant Active</span>
            </div>
            <div className="w-px h-4 bg-[#0E1B1A]/20 dark:bg-white/20"></div>
            <span className="text-[#0E1B1A]/70 dark:text-white/70 text-sm">
              Professional profile data ready for analysis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
