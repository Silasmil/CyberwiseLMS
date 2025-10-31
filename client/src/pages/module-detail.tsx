import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Clock, BookOpen, FileText, Play, ExternalLink, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, isAfter } from "date-fns";

export default function ModuleDetail() {
  const [match, params] = useRoute("/courses/:courseId/modules/:moduleId");
  const { courseId, moduleId } = params || {};

  const { data: module, isLoading } = useQuery({
    queryKey: [`/api/modules/${moduleId}`],
    enabled: !!moduleId,
  });

  const { data: lessons } = useQuery({
    queryKey: [`/api/modules/${moduleId}/lessons`],
    enabled: !!moduleId,
  });

  const { data: assignments } = useQuery({
    queryKey: [`/api/modules/${moduleId}/assignments`],
    enabled: !!moduleId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="font-heading text-2xl font-bold mb-2">Module Not Found</h2>
        <p className="text-muted-foreground mb-6">The module you're looking for doesn't exist.</p>
        <Link href={`/courses/${courseId}`}>
          <Button>Back to Course</Button>
        </Link>
      </div>
    );
  }

  const releaseDate = new Date(module.releaseDate);
  const isUnlocked = isAfter(new Date(), releaseDate);

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/courses/${courseId}`}>
          <Button variant="ghost" size="sm" className="mb-4" data-testid="link-back-course">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
        </Link>
        
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="font-heading font-semibold text-primary">M{module.moduleNumber}</span>
              </div>
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold">{module.title}</h1>
              </div>
            </div>
            <p className="text-muted-foreground">{module.description}</p>
          </div>
          {isUnlocked ? (
            <Badge variant="default">Available</Badge>
          ) : (
            <Badge variant="secondary">Locked</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {module.estimatedHours} hours
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {lessons?.length || 0} lessons
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {assignments?.length || 0} assignments
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {isUnlocked ? "Available now" : `Unlocks ${format(releaseDate, "MMMM d, yyyy")}`}
          </span>
        </div>
      </div>

      {!isUnlocked && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            This module will be available on {format(releaseDate, "MMMM d, yyyy")}. 
            {module.preludeTitle && " Check out the prelude content below to get a head start!"}
          </AlertDescription>
        </Alert>
      )}

      {module.preludeTitle && !isUnlocked && (
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Module Prelude: {module.preludeTitle}
                </CardTitle>
                <CardDescription className="mt-2">
                  Get a head start before the module unlocks
                </CardDescription>
              </div>
              <Badge variant="outline">Preview</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {module.preludeDescription && (
              <p className="text-sm">{module.preludeDescription}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              {module.preludeVideoUrl && (
                <Button variant="default" asChild data-testid="button-prelude-video">
                  <a href={module.preludeVideoUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Video
                  </a>
                </Button>
              )}
              {module.preludeResourceUrl && (
                <Button variant="outline" asChild data-testid="button-prelude-resource">
                  <a href={module.preludeResourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Resource
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
          <CardDescription>What you'll learn in this module</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {module.objectives?.map((objective: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {isUnlocked && (
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lessons" data-testid="tab-lessons">Lessons</TabsTrigger>
            <TabsTrigger value="assignments" data-testid="tab-assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-4 mt-6">
            {lessons && lessons.length > 0 ? (
              <div className="space-y-3">
                {lessons.map((lesson: any, index: number) => {
                  const icons = {
                    video: Play,
                    reading: BookOpen,
                    lab: FileText,
                    external: ExternalLink,
                  };
                  const Icon = icons[lesson.type as keyof typeof icons] || BookOpen;

                  return (
                    <Card key={lesson.id} className="hover-elevate" data-testid={`card-lesson-${lesson.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base mb-1">
                                Lesson {lesson.lessonNumber}: {lesson.title}
                              </CardTitle>
                              <Badge variant="secondary" className="text-xs capitalize">
                                {lesson.type}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild data-testid={`button-lesson-${lesson.id}`}>
                            <a href={lesson.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open
                            </a>
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
                  <h3 className="font-heading text-lg font-semibold mb-2">No lessons available</h3>
                  <p className="text-sm text-muted-foreground">Lessons will be added soon.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4 mt-6">
            {assignments && assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment: any) => {
                  const dueDate = new Date(assignment.dueDate);
                  const isOverdue = isAfter(new Date(), dueDate);

                  return (
                    <Card key={assignment.id} data-testid={`card-assignment-${assignment.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="mb-2">{assignment.title}</CardTitle>
                            <CardDescription>{assignment.description}</CardDescription>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                              <span className={`flex items-center gap-1 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                                <Calendar className="h-4 w-4" />
                                Due: {format(dueDate, "MMM d, yyyy h:mm a")}
                              </span>
                              <span className="text-muted-foreground">
                                Max Score: {assignment.maxScore}
                              </span>
                              {assignment.submissionStatus && (
                                <Badge variant={assignment.submissionStatus === "graded" ? "default" : "secondary"}>
                                  {assignment.submissionStatus}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/assignments/${assignment.id}`}>
                          <Button data-testid={`button-assignment-${assignment.id}`}>
                            {assignment.submissionStatus ? "View Submission" : "Submit Assignment"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground/40 mb-4" />
                  <h3 className="font-heading text-lg font-semibold mb-2">No assignments</h3>
                  <p className="text-sm text-muted-foreground">This module has no assignments.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
