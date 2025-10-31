import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Clock, BookOpen, FileText, Calendar, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isBefore } from "date-fns";

export default function CourseDetail() {
  const [match, params] = useRoute("/courses/:courseId");
  const courseId = params?.courseId;

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}/modules`],
    enabled: !!courseId,
  });

  if (courseLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="font-heading text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
        <Link href="/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/courses">
          <Button variant="ghost" size="sm" className="mb-4" data-testid="link-back-courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{course.name}</h1>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
          <Badge variant="secondary">{course.category}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>Your overall progress in this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{course.progress || 0}%</span>
            </div>
            <Progress value={course.progress || 0} />
            <p className="text-xs text-muted-foreground">
              Complete at least {course.completionThreshold || 80}% to earn your certificate
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules" data-testid="tab-modules">Modules</TabsTrigger>
          <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="space-y-4 mt-6">
          {modulesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : modules && modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module: any) => {
                const releaseDate = new Date(module.releaseDate);
                const isUnlocked = isBefore(releaseDate, new Date());
                
                return (
                  <Card key={module.id} className={!isUnlocked ? "opacity-60" : ""} data-testid={`card-module-${module.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="font-heading font-semibold text-primary">M{module.moduleNumber}</span>
                          </div>
                          <div className="flex-1">
                            <CardTitle className="mb-2">{module.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {module.estimatedHours}h
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {module.lessons?.length || 0} lessons
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {module.assignments?.length || 0} assignments
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {isUnlocked ? "Available" : `Unlocks ${format(releaseDate, "MMM d, yyyy")}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {module.progress !== undefined && (
                            <Badge variant={module.progress === 100 ? "default" : "secondary"}>
                              {module.progress}% Complete
                            </Badge>
                          )}
                          {module.preludeTitle && !isUnlocked && (
                            <Badge variant="outline" className="text-xs">
                              <Play className="h-3 w-3 mr-1" />
                              Prelude Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {isUnlocked && (
                      <CardContent>
                        <Link href={`/courses/${courseId}/modules/${module.id}`}>
                          <Button className="w-full sm:w-auto" data-testid={`button-start-module-${module.id}`}>
                            {module.progress > 0 ? "Continue Module" : "Start Module"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    )}
                    {!isUnlocked && module.preludeTitle && (
                      <CardContent>
                        <Link href={`/courses/${courseId}/modules/${module.id}`}>
                          <Button variant="outline" className="w-full sm:w-auto" data-testid={`button-prelude-${module.id}`}>
                            <Play className="mr-2 h-4 w-4" />
                            View Prelude
                          </Button>
                        </Link>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="font-heading text-lg font-semibold mb-2">No modules available</h3>
                <p className="text-sm text-muted-foreground">Modules will appear here once they're added to the course.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>Access NetAcad course materials and lab downloads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.netacadCourseUrl && (
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">NetAcad Course</h4>
                    <p className="text-sm text-muted-foreground mb-3">Access the full course on Cisco NetAcad</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={course.netacadCourseUrl} target="_blank" rel="noopener noreferrer" data-testid="link-netacad-course">
                        Open Course
                      </a>
                    </Button>
                  </div>
                </div>
              )}
              {course.netacadLabUrl && (
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Lab Downloads</h4>
                    <p className="text-sm text-muted-foreground mb-3">Download lab files and resources</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={course.netacadLabUrl} target="_blank" rel="noopener noreferrer" data-testid="link-netacad-labs">
                        Download Labs
                      </a>
                    </Button>
                  </div>
                </div>
              )}
              {!course.netacadCourseUrl && !course.netacadLabUrl && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No external resources available for this course yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
