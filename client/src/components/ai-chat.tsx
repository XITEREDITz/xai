import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Bot, User, Copy, Code, Lightbulb, Zap, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'generation' | 'explanation' | 'suggestion';
}

interface AiChatProps {
  project: any;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export default function AiChat({ project, onGenerate, isGenerating }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI coding assistant. I can help you build Minecraft ${project.type}s for ${project.platform}. 

What would you like to create today? Here are some things I can help with:
• Generate custom blocks, items, or entities
• Create commands and event handlers
• Build complex game mechanics
• Optimize your existing code
• Explain how Minecraft modding works

Just describe what you want to build!`,
      timestamp: new Date(),
      type: 'suggestion'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const explainCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/ai/explain", {
        code,
        aiModel: project.aiModel,
      });
      return response.json();
    },
    onSuccess: (data) => {
      addMessage('assistant', data.explanation, 'explanation');
    },
    onError: (error: any) => {
      toast({
        title: "Failed to explain code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addMessage = (role: 'user' | 'assistant', content: string, type?: 'generation' | 'explanation' | 'suggestion') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    
    // Add user message
    addMessage('user', userMessage);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Generate code based on the message
      onGenerate(userMessage);
      
      // Add assistant response
      setTimeout(() => {
        setIsTyping(false);
        addMessage('assistant', `I'm generating code for: "${userMessage}". Please wait while I create your ${project.type} code...`, 'generation');
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "Failed to process message",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully",
    });
  };

  const getMessageIcon = (message: Message) => {
    if (message.role === 'user') return <User className="h-4 w-4" />;
    
    switch (message.type) {
      case 'generation':
        return <Code className="h-4 w-4" />;
      case 'explanation':
        return <Lightbulb className="h-4 w-4" />;
      case 'suggestion':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getAiModelIcon = () => {
    switch (project.aiModel) {
      case 'claude':
        return <Sparkles className="h-4 w-4 text-accent" />;
      case 'gemini':
        return <Zap className="h-4 w-4 text-blue-400" />;
      case 'gpt':
        return <Code className="h-4 w-4 text-green-400" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const quickPrompts = [
    "Create a custom sword that shoots fireballs",
    "Make a teleportation command with cooldown",
    "Build a custom ore block that drops emeralds",
    "Create a magic staff with particle effects",
    "Make a custom mob that trades items",
    "Build a protection area system"
  ];

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-[600px]" data-testid="ai-chat-interface">
      {/* Quick Prompts Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Quick Ideas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="w-full text-left justify-start h-auto p-2 text-xs"
              onClick={() => setInputValue(prompt)}
              data-testid={`quick-prompt-${index}`}
            >
              {prompt}
            </Button>
          ))}
          
          {project.generatedCode && (
            <>
              <Separator className="my-4" />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => explainCodeMutation.mutate(project.generatedCode)}
                disabled={explainCodeMutation.isPending}
                data-testid="button-explain-code"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Explain Current Code
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="lg:col-span-3 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getAiModelIcon()}
              <span>AI Assistant</span>
              <Badge variant="outline">
                {project.aiModel === 'claude' && 'Claude Sonnet 4'}
                {project.aiModel === 'gemini' && 'Gemini Pro'}
                {project.aiModel === 'gpt' && 'GPT-5'}
              </Badge>
            </div>
            <Badge variant="secondary" className="text-xs">
              {project.platform} • {project.type}
            </Badge>
          </CardTitle>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef} data-testid="chat-messages">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`message-${message.id}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    {getMessageIcon(message)}
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(message.content)}
                        data-testid={`copy-message-${message.id}`}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <CardContent className="flex-shrink-0 pt-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you want to build..."
              disabled={isGenerating}
              className="flex-1"
              data-testid="chat-input"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isGenerating}
              size="sm"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
