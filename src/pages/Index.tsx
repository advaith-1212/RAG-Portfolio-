import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Sun, Moon, User, Bot, BarChart3, Activity, Code, Database, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCountUp } from '@/hooks/useCountUp';
import { PageTemplate } from '@/components/ui/page-template';

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
  const [isDarkMode, setIsDarkMode] = useState(true);
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
      color: "text-cyan-400",
      route: "/projects"
    },
    { 
      icon: Globe, 
      label: "Years Exp", 
      value: `${experienceCount}+`, 
      color: "text-emerald-400",
      route: "/experience"
    },
    { 
      icon: Database, 
      label: "Technologies", 
      value: `${technologiesCount}+`, 
      color: "text-blue-400",
      route: "/technologies"
    },
    { 
      icon: Zap, 
      label: "Success Rate", 
      value: `${successRateCount}%`, 
      color: "text-yellow-400",
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
    // Set dark mode by default and add welcome message
    document.documentElement.classList.add('dark');
    setIsDarkMode(true);
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

    try {
      // Make API call to the backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content })
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }
      
      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
    <PageTemplate>
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              AI Portfolio Dashboard
            </h1>
            <p className="text-white/70 text-lg">
              Interactive Professional Profile System
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-white/70 text-sm">System Online</span>
          </div>
          <Button
            onClick={toggleDarkMode}
            variant="outline"
            size="icon"
            className="border-white/20 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-white" />}
          </Button>
        </div>
      </div>

      {/* Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {portfolioMetrics.map((metric, index) => (
          <Card 
            key={index} 
            className="bg-gray-800/60 backdrop-blur-sm border-white/10 p-4 hover:bg-gray-700/60 transition-all duration-300 cursor-pointer"
            onClick={() => handleMetricClick(metric.route)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">{metric.label}</p>
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
          <Card className="h-[600px] flex flex-col bg-gray-800/60 backdrop-blur-sm border-white/10 shadow-2xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400">AI Assistant</h3>
                  <p className="text-xs text-white/60">Professional Profile Query System</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/60">Active</span>
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
                      <div className={`p-2 rounded-xl ${message.sender === 'user' ? 'bg-cyan-600 ml-3' : 'bg-gradient-to-r from-emerald-600 to-cyan-600 mr-3'} shadow-lg`}>
                        {message.sender === 'user' ? 
                          <User className="h-4 w-4 text-white" /> : 
                          <Bot className="h-4 w-4 text-white" />
                        }
                      </div>
                      <div
                        className={`p-4 rounded-2xl shadow-lg ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-700/80 text-white border border-white/10 rounded-bl-sm'
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
                      <div className="bg-gray-700/80 border border-white/10 p-4 rounded-2xl rounded-bl-sm">
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
            <div className="p-4 border-t border-white/10 bg-gray-800/40">
              <div className="flex space-x-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Query professional profile data..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1 bg-gray-700/50 border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 border-0 shadow-lg text-white"
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
          <Card className="bg-gray-800/60 backdrop-blur-sm border-white/10 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <h3 className="font-semibold text-cyan-400">Quick Commands</h3>
            </div>
            <div className="space-y-2">
              {quickStartPrompts.slice(0, 4).map((prompt, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 bg-gray-700/50 border-white/20 text-white hover:bg-gray-600/50 hover:text-cyan-400 text-xs transition-all duration-200 animate-fade-in opacity-0"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="text-cyan-400 mr-2">›</span>
                  {prompt.substring(0, 30)}...
                </Button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-800/60 backdrop-blur-sm border-white/10 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-blue-400">Recent Activity</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-white/70">
                <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                <span>Skills query processed</span>
                <span className="ml-auto">2m ago</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                <span>Experience overview generated</span>
                <span className="ml-auto">5m ago</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
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
        <div className="inline-flex items-center space-x-4 bg-gray-800/40 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-white/70 text-sm">AI Assistant Active</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <span className="text-white/70 text-sm">
            Professional profile data ready for analysis
          </span>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Index;
