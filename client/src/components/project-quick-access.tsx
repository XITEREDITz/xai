import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { useLocation } from "wouter";
import { 
  FolderOpen, 
  Code, 
  Wrench, 
  Plus, 
  Play,
  ArrowRight,
  X
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  type: string;
  platform: string;
  generatedCode?: string;
  updatedAt: string;
}

interface ProjectQuickAccessProps {
  className?: string;
  showOnPages?: string[];
}

export default function ProjectQuickAccess({ 
  className = "", 
  showOnPages = ["/", "/dashboard"] 
}: ProjectQuickAccessProps) {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Only show on specified pages
  useEffect(() => {
    const shouldShow = showOnPages.includes(location) || 
                      showOnPages.some(page => location.startsWith(page));
    setIsVisible(shouldShow);
  }, [location, showOnPages]);

  // Fetch user's projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: isVisible,
    retry: false
  });

  // Don't render if not visible or no projects
  if (!isVisible || (!isLoading && projects.length === 0)) {
    return null;
  }

  // Get recent projects (up to 3)
  const recentProjects = projects
    .sort((a: Project, b: Project) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
            size="lg"
          >
            <FolderOpen className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-80 p-0 mr-4 mb-4" 
          side="top" 
          align="end"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FolderOpen className="h-5 w-5" />
                  Quick Access
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Recent Projects */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Recent Projects
                    </h4>
                    
                    {recentProjects.map((project: Project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => {
                          setLocation(`/builder/${project.id}`);
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {project.type === 'plugin' ? 
                            <Code className="h-4 w-4 flex-shrink-0" /> : 
                            <Wrench className="h-4 w-4 flex-shrink-0" />
                          }
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {project.name}
                            </p>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {project.platform}
                              </Badge>
                              {project.generatedCode && (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                  ✓
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-3 border-t space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setLocation("/projects");
                        setIsOpen(false);
                      }}
                    >
                      <FolderOpen className="h-4 w-4 mr-2" />
                      View All Projects
                    </Button>
                    
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        setLocation("/builder");
                        setIsOpen(false);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Project
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
