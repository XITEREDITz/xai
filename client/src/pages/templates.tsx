import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/navbar";
import { Search, Star, Download, Filter, Code, Zap, Sparkles, Sword, Shield, Gem, Wrench } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  rating: number;
  downloads: number;
  isPremium: boolean;
  imageUrl?: string;
}

const categoryIcons = {
  'survival': Sword,
  'rpg': Shield,
  'tech': Wrench,
  'magic': Sparkles,
  'utility': Code,
  'adventure': Gem,
};

const difficultyColors = {
  'beginner': 'text-green-500 border-green-500',
  'intermediate': 'text-yellow-500 border-yellow-500',
  'advanced': 'text-red-500 border-red-500',
};

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['/api/templates'],
  });

  const filteredTemplates = templates.filter((template: Template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = Array.from(new Set(templates.map((t: Template) => t.category)));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="templates-title">
            Template Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start with proven mod templates and customize to your needs. From simple utilities to complex RPG systems.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-templates"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48" data-testid="select-category">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty Filter */}
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full lg:w-48" data-testid="select-difficulty">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-muted rounded w-16"></div>
                    <div className="h-3 bg-muted rounded w-12"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Templates Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="templates-grid">
            {filteredTemplates.map((template: Template) => {
              const CategoryIcon = categoryIcons[template.category as keyof typeof categoryIcons] || Code;
              
              return (
                <Card 
                  key={template.id} 
                  className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                  data-testid={`template-card-${template.id}`}
                >
                  <div className="relative">
                    {template.imageUrl ? (
                      <img 
                        src={template.imageUrl} 
                        alt={template.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
                        <CategoryIcon className="h-16 w-16 text-primary/60" />
                      </div>
                    )}
                    
                    {template.isPremium && (
                      <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                        Premium
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm line-clamp-1" data-testid={`template-name-${template.id}`}>
                        {template.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className={difficultyColors[template.difficulty as keyof typeof difficultyColors]}>
                        {template.difficulty}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Download className="h-3 w-3" />
                        <span>{template.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button asChild size="sm" className="w-full" data-testid={`button-use-template-${template.id}`}>
                      <Link href={`/builder?template=${template.id}`}>
                        Use Template
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTemplates.length === 0 && (
          <div className="text-center py-16" data-testid="templates-empty-state">
            <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or browse all templates.
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-card/30 py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Create your own custom mod with our AI-powered builder
          </p>
          <Button asChild size="lg" data-testid="button-create-custom">
            <Link href="/builder">
              <Zap className="mr-2 h-4 w-4" />
              Create Custom Mod
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
