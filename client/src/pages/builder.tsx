import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Project, User } from "@shared/schema";
import Navbar from "@/components/navbar";
import VisualBuilder from "@/components/visual-builder";
import CodePreview from "@/components/code-preview";
import AiChat from "@/components/ai-chat";
import AdModal from "@/components/ad-modal";
import { Save, Download, Play, Settings, Zap, Sparkles, Code, Coins } from "lucide-react";


export default function Builder() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("builder");
  const [showAdModal, setShowAdModal] = useState(false);
  const [project, setProject] = useState<Project>({
    id: '',
    userId: '',
    name: 'New Project',
    description: '',
    type: 'plugin',
    platform: 'bukkit',
    components: [],
    generatedCode: '',
    aiModel: 'claude',
    templateId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Fetch project if editing existing one
  const { data: existingProject, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  // Fetch user data for coin balance
  const { data: userData } = useQuery<User>({
    queryKey: ['/api/auth/me'],
  });

  useEffect(() => {
    if (existingProject) {
      setProject(existingProject);
    }
  }, [existingProject]);

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async () => {
      if (projectId) {
        return apiRequest("PUT", `/api/projects/${projectId}`, project);
      } else {
        return apiRequest("POST", "/api/projects", project);
      }
    },
    onSuccess: () => {
      toast({
        title: "Project saved",
        description: "Your project has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // AI generation mutation
  const generateCodeMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/ai/generate", {
        prompt,
        aiModel: project.aiModel,
        projectId: project.id,
        type: project.type,
        platform: project.platform,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setProject(prev => ({ ...prev, generatedCode: data.code }));
      toast({
        title: "Code generated successfully",
        description: `Cost: ${data.coinsCost} coins. Remaining: ${data.remainingCoins}`,
      });
    },
    onError: (error: any) => {
      if (error.message.includes("Insufficient coins")) {
        setShowAdModal(true);
      } else {
        toast({
          title: "Generation failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleSave = () => {
    saveProjectMutation.mutate();
  };

  const handleGenerate = (prompt: string) => {
    generateCodeMutation.mutate(prompt);
  };

  const handleExport = () => {
    if (!project.generatedCode) {
      toast({
        title: "No code to export",
        description: "Generate some code first before exporting.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([project.generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-')}.java`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Code exported",
      description: "Your Java code has been downloaded.",
    });
  };

  const updateProject = (updates: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Builder Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-semibold" data-testid="project-title">{project.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{project.type}</Badge>
                  <Badge variant="outline">{project.platform}</Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    {project.aiModel === 'claude' && <Sparkles className="h-3 w-3" />}
                    {project.aiModel === 'gemini' && <Zap className="h-3 w-3" />}
                    {project.aiModel === 'gpt' && <Code className="h-3 w-3" />}
                    <span>{project.aiModel}</span>
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {userData && (
                <div className="flex items-center space-x-2 bg-secondary rounded-lg px-3 py-1">
                  <Coins className="text-yellow-400 h-4 w-4" />
                  <span className="text-sm font-mono" data-testid="coin-balance">{userData.coins}</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saveProjectMutation.isPending}
                data-testid="button-save-project"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={!project.generatedCode}
                data-testid="button-export-code"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Builder Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4" data-testid="builder-tabs">
            <TabsTrigger value="builder" data-testid="tab-builder">Visual Builder</TabsTrigger>
            <TabsTrigger value="chat" data-testid="tab-chat">AI Chat</TabsTrigger>
            <TabsTrigger value="code" data-testid="tab-code">Code Preview</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6 mt-6">
            <VisualBuilder
              project={project}
              onUpdateProject={updateProject}
              onGenerate={handleGenerate}
              isGenerating={generateCodeMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6 mt-6">
            <AiChat
              project={project}
              onGenerate={handleGenerate}
              isGenerating={generateCodeMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="code" className="space-y-6 mt-6">
            <CodePreview
              code={project.generatedCode || ''}
              language="java"
              onExport={handleExport}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card data-testid="project-settings">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Project Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={project.name}
                      onChange={(e) => updateProject({ name: e.target.value })}
                      placeholder="Enter project name"
                      data-testid="input-project-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-type">Type</Label>
                    <Select
                      value={project.type}
                      onValueChange={(value: 'plugin' | 'mod') => updateProject({ type: value })}
                    >
                      <SelectTrigger data-testid="select-project-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plugin">Plugin</SelectItem>
                        <SelectItem value="mod">Mod</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={project.platform}
                      onValueChange={(value) => updateProject({ platform: value })}
                    >
                      <SelectTrigger data-testid="select-platform">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bukkit">Bukkit</SelectItem>
                        <SelectItem value="spigot">Spigot</SelectItem>
                        <SelectItem value="paper">Paper</SelectItem>
                        <SelectItem value="forge">Forge</SelectItem>
                        <SelectItem value="fabric">Fabric</SelectItem>
                        <SelectItem value="quilt">Quilt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ai-model">AI Model</Label>
                    <Select
                      value={project.aiModel || 'claude'}
                      onValueChange={(value) => updateProject({ aiModel: value })}
                    >
                      <SelectTrigger data-testid="select-ai-model">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <span>Claude Sonnet 4</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gemini">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-blue-400" />
                            <span>Gemini Pro</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gpt">
                          <div className="flex items-center space-x-2">
                            <Code className="h-4 w-4 text-green-400" />
                            <span>GPT-5</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={project.description || ''}
                    onChange={(e) => updateProject({ description: e.target.value })}
                    placeholder="Describe your mod/plugin..."
                    rows={4}
                    data-testid="textarea-description"
                  />
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Auto-save</h4>
                    <p className="text-sm text-muted-foreground">
                      Your project is automatically saved as you make changes
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Enabled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ad Modal */}
      {showAdModal && (
        <AdModal
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onAdCompleted={() => {
            setShowAdModal(false);
            queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
          }}
        />
      )}
    </div>
  );
}
