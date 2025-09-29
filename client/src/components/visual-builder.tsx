import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Code, 
  Box, 
  Sword, 
  Shield, 
  Gem, 
  Terminal, 
  Zap, 
  Database, 
  Settings, 
  Plus, 
  Trash2, 
  Edit,
  Play,
  MousePointer
} from "lucide-react";

interface Component {
  id: string;
  type: string;
  name: string;
  properties: Record<string, any>;
  position: { x: number; y: number };
}

interface VisualBuilderProps {
  project: any;
  onUpdateProject: (updates: any) => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const componentLibrary = {
  'blocks-items': [
    { type: 'custom-block', name: 'Custom Block', icon: Box, color: 'text-primary' },
    { type: 'weapon', name: 'Weapon', icon: Sword, color: 'text-accent' },
    { type: 'armor', name: 'Armor', icon: Shield, color: 'text-blue-400' },
    { type: 'tool', name: 'Tool', icon: Gem, color: 'text-yellow-400' },
  ],
  'mechanics': [
    { type: 'command', name: 'Command', icon: Terminal, color: 'text-green-400' },
    { type: 'event-handler', name: 'Event Handler', icon: Zap, color: 'text-yellow-400' },
    { type: 'data-storage', name: 'Data Storage', icon: Database, color: 'text-blue-400' },
  ],
};

export default function VisualBuilder({ project, onUpdateProject, onGenerate, isGenerating }: VisualBuilderProps) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const { toast } = useToast();

  const addComponent = useCallback((componentType: any, position: { x: number; y: number }) => {
    const newComponent: Component = {
      id: `${componentType.type}-${Date.now()}`,
      type: componentType.type,
      name: componentType.name,
      properties: getDefaultProperties(componentType.type),
      position,
    };

    const updatedComponents = [...(project.components || []), newComponent];
    onUpdateProject({ components: updatedComponents });
    
    toast({
      title: "Component added",
      description: `${componentType.name} has been added to your project`,
    });
  }, [project.components, onUpdateProject, toast]);

  const removeComponent = useCallback((componentId: string) => {
    const updatedComponents = project.components?.filter((c: Component) => c.id !== componentId) || [];
    onUpdateProject({ components: updatedComponents });
    
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
    
    toast({
      title: "Component removed",
      description: "Component has been removed from your project",
    });
  }, [project.components, selectedComponent, onUpdateProject, toast]);

  const updateComponent = useCallback((componentId: string, updates: Partial<Component>) => {
    const updatedComponents = project.components?.map((c: Component) => 
      c.id === componentId ? { ...c, ...updates } : c
    ) || [];
    
    onUpdateProject({ components: updatedComponents });
    
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [project.components, selectedComponent, onUpdateProject]);

  const handleDragStart = (e: React.DragEvent, componentType: any) => {
    setDraggedComponent(componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedComponent) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    addComponent(draggedComponent, position);
    setDraggedComponent(null);
  };

  const generateFromComponents = () => {
    if (!project.components || project.components.length === 0) {
      toast({
        title: "No components to generate",
        description: "Add some components to your project first",
        variant: "destructive",
      });
      return;
    }

    const componentDescriptions = project.components.map((comp: Component) => {
      const props = Object.entries(comp.properties)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      return `${comp.name} (${comp.type}) with properties: ${props}`;
    });

    const prompt = `Create a ${project.type} for ${project.platform} with the following components:\n\n${componentDescriptions.join('\n')}\n\nMake sure all components work together properly and follow ${project.platform} best practices.`;
    
    onGenerate(prompt);
  };

  const getDefaultProperties = (type: string): Record<string, any> => {
    switch (type) {
      case 'custom-block':
        return {
          hardness: 3.0,
          toolRequired: 'pickaxe',
          dropItem: 'itself',
          stackSize: 64,
        };
      case 'weapon':
        return {
          damage: 8,
          durability: 1561,
          enchantable: true,
          material: 'diamond',
        };
      case 'armor':
        return {
          protection: 3,
          durability: 429,
          enchantable: true,
          armorType: 'chestplate',
        };
      case 'tool':
        return {
          efficiency: 8,
          durability: 1561,
          enchantable: true,
          harvestLevel: 3,
        };
      case 'command':
        return {
          name: 'mycommand',
          permission: 'mod.command',
          cooldown: 0,
          aliases: [],
        };
      case 'event-handler':
        return {
          event: 'PlayerJoinEvent',
          priority: 'NORMAL',
          cancelable: false,
        };
      case 'data-storage':
        return {
          type: 'yaml',
          location: 'config.yml',
          autoSave: true,
        };
      default:
        return {};
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-[600px]" data-testid="visual-builder">
      {/* Component Library */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Components
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="blocks-items" className="w-full">
            <TabsList className="grid w-full grid-cols-2 text-xs">
              <TabsTrigger value="blocks-items" className="text-xs">Blocks & Items</TabsTrigger>
              <TabsTrigger value="mechanics" className="text-xs">Mechanics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blocks-items" className="space-y-2 mt-4">
              <div className="grid grid-cols-2 gap-2">
                {componentLibrary['blocks-items'].map((component) => {
                  const IconComponent = component.icon;
                  return (
                    <div
                      key={component.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, component)}
                      className="bg-card border border-border rounded p-3 cursor-grab hover:bg-card/80 text-center transition-colors"
                      data-testid={`component-${component.type}`}
                    >
                      <IconComponent className={`${component.color} mb-1 h-4 w-4 mx-auto`} />
                      <div className="text-xs">{component.name}</div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="mechanics" className="space-y-2 mt-4">
              {componentLibrary.mechanics.map((component) => {
                const IconComponent = component.icon;
                return (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                    className="bg-card border border-border rounded p-2 cursor-grab hover:bg-card/80 flex items-center space-x-2 transition-colors"
                    data-testid={`component-${component.type}`}
                  >
                    <IconComponent className={`${component.color} h-4 w-4`} />
                    <span className="text-xs">{component.name}</span>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Build Canvas */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Build Canvas
            </CardTitle>
            <Button
              onClick={generateFromComponents}
              disabled={isGenerating || !project.components?.length}
              size="sm"
              data-testid="button-generate-from-canvas"
            >
              <Play className="h-4 w-4 mr-2" />
              Generate Code
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div
            className="relative border-2 border-dashed border-border rounded-lg h-[450px] overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-testid="build-canvas"
          >
            {/* Empty State */}
            {(!project.components || project.components.length === 0) && (
              <div className="absolute inset-4 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MousePointer className="h-12 w-12 mb-4 opacity-50 mx-auto" />
                  <p className="text-sm">Drag components here to start building</p>
                  <p className="text-xs mt-2">Or describe your mod in natural language</p>
                </div>
              </div>
            )}

            {/* Placed Components */}
            {project.components?.map((component: Component) => {
              const libraryComponent = [
                ...componentLibrary['blocks-items'],
                ...componentLibrary.mechanics
              ].find(c => c.type === component.type);
              
              if (!libraryComponent) return null;
              
              const IconComponent = libraryComponent.icon;
              
              return (
                <div
                  key={component.id}
                  className={`absolute bg-card border border-border rounded-lg p-3 shadow-lg cursor-pointer transition-all ${
                    selectedComponent?.id === component.id ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{
                    left: component.position.x,
                    top: component.position.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => setSelectedComponent(component)}
                  data-testid={`placed-component-${component.id}`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <IconComponent className={`${libraryComponent.color} h-4 w-4`} />
                    <span className="text-sm font-medium">{component.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeComponent(component.id);
                      }}
                      data-testid={`remove-component-${component.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {Object.entries(component.properties).slice(0, 2).map(([key, value]) => (
                      <div key={key}>{key}: {String(value)}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Properties Panel */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Properties</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedComponent ? (
            <div className="space-y-4" data-testid="component-properties">
              <div>
                <Label className="text-xs text-muted-foreground">Component Name</Label>
                <Input
                  value={selectedComponent.name}
                  onChange={(e) => updateComponent(selectedComponent.id, { name: e.target.value })}
                  className="mt-1"
                  data-testid="input-component-name"
                />
              </div>

              <Badge variant="outline" className="w-fit">
                {selectedComponent.type}
              </Badge>

              <Separator />

              {Object.entries(selectedComponent.properties).map(([key, value]) => (
                <div key={key}>
                  <Label className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  {typeof value === 'boolean' ? (
                    <Select
                      value={value ? 'true' : 'false'}
                      onValueChange={(newValue) => updateComponent(selectedComponent.id, {
                        properties: { ...selectedComponent.properties, [key]: newValue === 'true' }
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : typeof value === 'number' ? (
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => updateComponent(selectedComponent.id, {
                        properties: { ...selectedComponent.properties, [key]: parseFloat(e.target.value) || 0 }
                      })}
                      className="mt-1"
                      data-testid={`input-${key}`}
                    />
                  ) : (
                    <Input
                      value={String(value)}
                      onChange={(e) => updateComponent(selectedComponent.id, {
                        properties: { ...selectedComponent.properties, [key]: e.target.value }
                      })}
                      className="mt-1"
                      data-testid={`input-${key}`}
                    />
                  )}
                </div>
              ))}

              <Separator />

              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => removeComponent(selectedComponent.id)}
                data-testid="button-remove-selected-component"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Component
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8" data-testid="no-component-selected">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a component to edit its properties</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
