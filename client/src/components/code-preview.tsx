import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Download, 
  Eye, 
  Code, 
  FileText, 
  Settings, 
  Play,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";

interface CodePreviewProps {
  code: string;
  language?: string;
  onExport: () => void;
}

export default function CodePreview({ code, language = "java", onExport }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState("code");
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Code has been copied to your clipboard",
    });
  };

  const formatCode = (rawCode: string) => {
    if (!rawCode) return "";
    
    // Simple syntax highlighting for Java
    return rawCode
      .split('\n')
      .map((line, index) => {
        let formattedLine = line;
        
        // Keywords
        formattedLine = formattedLine.replace(
          /\b(public|private|protected|static|final|class|interface|extends|implements|import|package|void|int|String|boolean|double|float|long|short|byte|char|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|throws|new|this|super|null|true|false)\b/g,
          '<span class="text-blue-400">$1</span>'
        );
        
        // Annotations
        formattedLine = formattedLine.replace(
          /@\w+/g,
          '<span class="text-yellow-400">$&</span>'
        );
        
        // Strings
        formattedLine = formattedLine.replace(
          /"([^"\\]|\\.)*"/g,
          '<span class="text-green-400">$&</span>'
        );
        
        // Comments
        formattedLine = formattedLine.replace(
          /\/\/.*$/g,
          '<span class="text-muted-foreground">$&</span>'
        );
        
        // Multi-line comments
        formattedLine = formattedLine.replace(
          /\/\*.*?\*\//g,
          '<span class="text-muted-foreground">$&</span>'
        );
        
        return (
          <div key={index} className="flex">
            <span className="text-muted-foreground text-xs w-10 text-right pr-4 select-none">
              {index + 1}
            </span>
            <span 
              className="flex-1"
              dangerouslySetInnerHTML={{ __html: formattedLine }}
            />
          </div>
        );
      });
  };

  const generateDocumentation = () => {
    if (!code) return "No code to document.";
    
    const lines = code.split('\n');
    const classMatch = code.match(/class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : "UnknownClass";
    
    let doc = `# ${className}\n\n`;
    doc += "## Overview\n";
    doc += `This is a generated Minecraft ${language === "java" ? "plugin/mod" : "script"} class.\n\n`;
    
    // Find methods
    const methods = code.match(/(?:public|private|protected)?\s*(?:static\s+)?[\w<>[\]]+\s+(\w+)\s*\([^)]*\)/g);
    if (methods && methods.length > 0) {
      doc += "## Methods\n\n";
      methods.forEach(method => {
        const methodName = method.match(/(\w+)\s*\([^)]*\)/)?.[1];
        if (methodName) {
          doc += `### ${methodName}\n`;
          doc += `\`${method}\`\n\n`;
        }
      });
    }
    
    // Find fields
    const fields = code.match(/(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?[\w<>[\]]+\s+(\w+)\s*[=;]/g);
    if (fields && fields.length > 0) {
      doc += "## Fields\n\n";
      fields.forEach(field => {
        doc += `- \`${field.trim()}\`\n`;
      });
      doc += "\n";
    }
    
    doc += "## Installation\n\n";
    doc += "1. Compile this code into a JAR file\n";
    doc += "2. Place the JAR in your server's plugins folder\n";
    doc += "3. Restart your server\n\n";
    
    doc += "## Usage\n\n";
    doc += "This plugin will automatically load when your server starts. Check the console for any configuration options or commands.\n";
    
    return doc;
  };

  const getCodeAnalysis = () => {
    if (!code) return { issues: [], suggestions: [], metrics: {} };
    
    const lines = code.split('\n');
    const issues = [];
    const suggestions = [];
    
    // Basic analysis
    if (code.includes("System.out.println")) {
      issues.push({
        type: "warning",
        message: "Consider using logger instead of System.out.println for better debugging",
        line: lines.findIndex(line => line.includes("System.out.println")) + 1
      });
    }
    
    if (!code.includes("@Override") && code.includes("onEnable")) {
      suggestions.push({
        type: "info",
        message: "Consider adding @Override annotation to overridden methods",
        line: lines.findIndex(line => line.includes("onEnable")) + 1
      });
    }
    
    const metrics = {
      lines: lines.length,
      methods: (code.match(/(?:public|private|protected)?\s*(?:static\s+)?[\w<>[\]]+\s+\w+\s*\([^)]*\)/g) || []).length,
      classes: (code.match(/class\s+\w+/g) || []).length,
      comments: lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*')).length,
    };
    
    return { issues, suggestions, metrics };
  };

  const analysis = getCodeAnalysis();

  return (
    <div className="space-y-6" data-testid="code-preview">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Generated Code</h2>
          {code && <Badge variant="outline">{language}</Badge>}
        </div>
        
        {code && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              data-testid="button-copy-code"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              data-testid="button-export-code"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      {code ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="code" data-testid="tab-code">
              <Code className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
            <TabsTrigger value="docs" data-testid="tab-docs">
              <FileText className="h-4 w-4 mr-2" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="analysis" data-testid="tab-analysis">
              <Eye className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="setup" data-testid="tab-setup">
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Source Code</span>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{analysis.metrics.lines} lines</span>
                    <span>•</span>
                    <span>{analysis.metrics.methods} methods</span>
                    <span>•</span>
                    <span>{analysis.metrics.classes} classes</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <pre className="text-sm font-mono bg-secondary/20 rounded-lg p-4 overflow-x-auto">
                    <code data-testid="formatted-code">
                      {formatCode(code)}
                    </code>
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap text-sm" data-testid="generated-docs">
                      {generateDocumentation()}
                    </pre>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span>Issues & Warnings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.issues.length > 0 ? (
                    <div className="space-y-3" data-testid="code-issues">
                      {analysis.issues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-500/10 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Line {issue.line}</p>
                            <p className="text-sm text-muted-foreground">{issue.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">No issues found</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span>Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.suggestions.length > 0 ? (
                    <div className="space-y-3" data-testid="code-suggestions">
                      {analysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-blue-500/10 rounded-lg">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Line {suggestion.line}</p>
                            <p className="text-sm text-muted-foreground">{suggestion.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span className="text-sm">No suggestions available</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="setup" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4" data-testid="setup-instructions">
                  <div>
                    <h3 className="font-semibold mb-2">1. Compile Your Code</h3>
                    <div className="bg-secondary/20 rounded-lg p-3">
                      <code className="text-sm">javac -cp spigot.jar YourPlugin.java</code>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">2. Create plugin.yml</h3>
                    <div className="bg-secondary/20 rounded-lg p-3">
                      <pre className="text-sm">
{`name: YourPlugin
version: 1.0.0
main: YourMainClass
api-version: 1.19
author: Your Name
description: Generated by X.AI`}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">3. Package as JAR</h3>
                    <div className="bg-secondary/20 rounded-lg p-3">
                      <code className="text-sm">jar cf YourPlugin.jar *.class plugin.yml</code>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">4. Install on Server</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Copy the JAR file to your server's plugins folder</li>
                      <li>Restart your server or use /reload</li>
                      <li>Check console for successful loading</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-[400px] text-center">
            <div className="space-y-4">
              <Code className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No Code Generated Yet</h3>
                <p className="text-muted-foreground">
                  Use the AI chat or visual builder to generate your Minecraft mod code
                </p>
              </div>
              <Button variant="outline" size="sm" data-testid="button-generate-hint">
                <Play className="h-4 w-4 mr-2" />
                Start Building
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
