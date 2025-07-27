"use client"

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSearch } from "@/hooks/useSearch";
import { categories } from "@/data/sample-functions";
import { UtilityFunction, Language, Difficulty, Category } from "@/types";
import { formatDate } from "@/lib/utils";
import { 
  Search, 
  Copy, 
  ExternalLink, 
  Star,
  Filter,
  Code,
  FileText,
  Clock,
  User,
  Heart,
  Eye,
  ChevronRight,
  MessageCircle,
  ThumbsUp
} from "lucide-react";

const languages: Language[] = ["javascript", "typescript", "python"];
const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

interface UtilsLibraryProps {
  initialSearchQuery?: string;
}

export default function UtilsLibrary({ 
  initialSearchQuery = ""
}: UtilsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Use the search hook for fuzzy search
  const { results: searchResults, search } = useSearch();

  // Trigger search when filters change
  React.useEffect(() => {
    const searchFilters = {
      query: searchQuery.trim(),
      language: selectedLanguage !== "all" ? [selectedLanguage] : undefined,
      category: selectedCategory !== "all" ? [selectedCategory] : undefined,
      difficulty: selectedDifficulty !== "all" ? [selectedDifficulty] : undefined,
    };
    
    search(searchFilters);
  }, [searchQuery, selectedLanguage, selectedCategory, selectedDifficulty, search]);

  const filteredUtilities = useMemo(() => {
    const utilities = searchResults;
    // Additional client-side filtering is handled by the hook
    return utilities.sort((a, b) => b.usage_count - a.usage_count);
  }, [searchResults]);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const openPlayground = (utility: UtilityFunction) => {
    // Navigate to playground with utility ID instead of code
    const playgroundUrl = `/playground?utilityId=${utility.id}`;
    window.open(playgroundUrl, '_blank');
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getLanguageColor = (language: Language) => {
    switch (language) {
      case "javascript": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "typescript": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "python": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Utility Functions Library</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover, explore, and use a comprehensive collection of utility functions 
          for JavaScript, TypeScript, and Python. All functions are tested, documented, and ready to use.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search functions by name, description, or tags..."
            className="pl-10 h-12 text-lg bg-background text-foreground border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronRight className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg border border-border">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category | "all")}
                className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language | "all")}
                className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="all">All Languages</option>
                {languages.map(language => (
                  <option key={language} value={language}>
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | "all")}
                className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="all">All Levels</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-center text-muted-foreground">
        {filteredUtilities.length} function{filteredUtilities.length !== 1 ? 's' : ''} found
      </div>

      {/* Utility Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUtilities.map((utility) => (
          <Card key={utility.id} className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Code className="h-5 w-5 text-primary" />
                    {utility.name}
                    {utility.status === 'active' && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    {utility.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm text-muted-foreground">{utility.rating}</span>
                </div>
              </div>

              {/* Tags and Metadata */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={getLanguageColor(utility.language)}>
                  {utility.language}
                </Badge>
                <Badge className={getDifficultyColor(utility.difficulty)}>
                  {utility.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {categories.find(cat => cat.id === utility.category)?.name || utility.category}
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {utility.usage_count}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {utility.rating}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {utility.author.username}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(utility.updated_at)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Code Preview */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Code</h4>
                  <div className="relative">
                    <pre className="bg-muted text-foreground p-4 rounded-lg text-sm overflow-x-auto border border-border">
                      <code>{utility.code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-accent"
                      onClick={() => copyToClipboard(utility.code)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Example */}
                {utility.examples.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Example</h4>
                    <pre className="bg-primary/5 text-foreground p-3 rounded-lg text-sm overflow-x-auto border border-border">
                      <code>{utility.examples[0].code}</code>
                    </pre>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {utility.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats & Community Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{utility.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{utility.usage_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{utility.comments_count || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{utility.likes_count || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(utility.code)}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openPlayground(utility)}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Try in Playground
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="px-3"
                  >
                    <Link href={`/utils/${utility.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUtilities.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No functions found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search query or filters to find what you&apos;re looking for.
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setSelectedCategory("all");
            setSelectedLanguage("all");
            setSelectedDifficulty("all");
          }}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Load More */}
      {filteredUtilities.length > 0 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            Load More Functions
          </Button>
        </div>
      )}
    </div>
  );
}
