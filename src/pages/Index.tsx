
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Sun, Moon, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickStartPrompts = [
    "Can you summarize your professional experience?",
    "What are some key projects you've completed?",
    "List your primary technical skills and tools",
    "Could you share details about your educational background?",
    "What are your recent professional activities?",
    "Tell me about your career highlights"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
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

    // Simulated AI response for now - you'll replace this with actual AI integration
    const aiResponses = {
      'professional experience': "I have over [X] years of experience in [field], specializing in [specialization]. My career highlights include leading cross-functional teams, delivering high-impact projects, and driving technical innovation across multiple domains.",
      'projects': "Some of my key projects include: 1) [Project Name] - A comprehensive solution that improved efficiency by 40%, 2) [Project Name] - Led a team of 8 developers to build a scalable platform, 3) [Project Name] - Implemented AI/ML solutions that reduced processing time by 60%.",
      'skills': "My technical expertise spans: Frontend (React, TypeScript, Next.js), Backend (Node.js, Python, Java), Cloud (AWS, Azure, GCP), Databases (PostgreSQL, MongoDB), AI/ML (TensorFlow, PyTorch), and DevOps (Docker, Kubernetes, CI/CD).",
      'education': "I hold a [Degree] in [Field] from [University], where I graduated with [honors/GPA]. I've also completed various certifications in cloud computing, machine learning, and project management.",
      'default': "That's a great question! I'm designed to discuss various aspects of my professional journey. Could you be more specific about what you'd like to know? You can ask about my experience, skills, projects, education, or recent activities."
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Portfolio Assistant
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Interactive Professional Profile
              </p>
            </div>
          </div>
          <Button
            onClick={toggleDarkMode}
            variant="outline"
            size="icon"
            className="transition-transform hover:scale-105"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                    <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-blue-600 ml-2' : 'bg-gradient-to-r from-purple-600 to-indigo-600 mr-2'}`}>
                      {message.sender === 'user' ? 
                        <User className="h-4 w-4 text-white" /> : 
                        <Bot className="h-4 w-4 text-white" />
                      }
                    </div>
                    <div
                      className={`p-4 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                      } shadow-md hover-scale`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start space-x-2">
                    <div className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl rounded-bl-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Quick Start Prompts */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                Quick Start Conversations:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickStartPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    variant="outline"
                    size="sm"
                    className="text-left justify-start h-auto p-3 hover-scale text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about my professional background..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This AI assistant is trained on my professional profile. 
            <span className="font-medium"> Ask anything about my experience, skills, or projects!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
