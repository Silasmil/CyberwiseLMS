import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses"],
  });

  const filteredCourses = courses?.filter((course: any) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = Array.from(new Set(courses?.map((c: any) => c.category) || []));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">
          Track your progress and access course materials
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-courses"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-category-filter">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category: string) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course: any) => (
            <Card key={course.id} className="overflow-hidden hover-elevate transition-all" data-testid={`card-course-${course.id}`}>
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-b">
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="h-16 w-16 text-primary/40" />
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="line-clamp-1">{course.name}</CardTitle>
                  <Badge variant="secondary" className="flex-shrink-0">{course.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress || 0}%</span>
                  </div>
                  <Progress value={course.progress || 0} />
                </div>
                <Link href={`/courses/${course.id}`}>
                  <Button className="w-full gap-2" data-testid={`button-open-course-${course.id}`}>
                    Open Course
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {searchQuery || categoryFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You're not enrolled in any courses yet. Contact the administrator for course access."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
