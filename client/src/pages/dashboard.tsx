import { useQuery } from "@tanstack/react-query";
import { Calendar, BookOpen, FileText, MessageSquare, Award, Bell, Clock, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth";
import { format, isAfter, isBefore } from "date-fns";

export default function Dashboard() {
  const user = getCurrentUser();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: upcomingModules, isLoading: modulesLoading } = useQuery({
    queryKey: ["/api/dashboard/upcoming-modules"],
  });

  const { data: activeModule, isLoading: activeLoading } = useQuery({
    queryKey: ["/api/dashboard/active-module"],
  });

  const { data: announcements, isLoading: announcementsLoading } = useQuery({
    queryKey: ["/api/announcements"],
  });

  const { data: deadlines, isLoading: deadlinesLoading } = useQuery({
    queryKey: ["/api/dashboard/deadlines"],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user?.fullName?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Admission Number: <span className="font-mono font-medium text-foreground">{user?.admissionNumber}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-courses">{stats?.activeCourses || 0}</div>
                <p className="text-xs text-muted-foreground">Enrolled courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Modules</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-completed-modules">{stats?.completedModules || 0}</div>
                <p className="text-xs text-muted-foreground">Modules finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-pending-assignments">{stats?.pendingAssignments || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting submission</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-certificates">{stats?.certificates || 0}</div>
                <p className="text-xs text-muted-foreground">Earned certificates</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {activeLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ) : activeModule ? (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Active Module
                      <Badge variant="default">In Progress</Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">Continue your learning journey</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-1">{activeModule.title}</h3>
                  <p className="text-sm text-muted-foreground">{activeModule.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {activeModule.estimatedHours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {activeModule.lessons?.length || 0} lessons
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{activeModule.progress || 0}%</span>
                  </div>
                  <Progress value={activeModule.progress || 0} />
                </div>
                <div className="flex gap-2">
                  <Link href={`/courses/${activeModule.courseId}/modules/${activeModule.id}`}>
                    <Button data-testid="button-continue-module">
                      Continue Learning
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/courses/${activeModule.courseId}`}>
                    <Button variant="outline" data-testid="button-view-course">
                      View Course
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Modules
              </CardTitle>
              <CardDescription>Next modules in your learning path</CardDescription>
            </CardHeader>
            <CardContent>
              {modulesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingModules && upcomingModules.length > 0 ? (
                <div className="space-y-4">
                  {upcomingModules.slice(0, 5).map((module: any) => {
                    const releaseDate = new Date(module.releaseDate);
                    const isUnlocked = isBefore(releaseDate, new Date());
                    
                    return (
                      <div key={module.id} className="flex items-start gap-4 p-4 rounded-lg border hover-elevate">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-heading font-semibold text-primary">M{module.moduleNumber}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium mb-1 line-clamp-1">{module.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{isUnlocked ? "Available now" : `Unlocks ${format(releaseDate, "MMM d, yyyy")}`}</span>
                          </div>
                          {module.preludeTitle && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              Prelude Available
                            </Badge>
                          )}
                        </div>
                        {isUnlocked && (
                          <Link href={`/courses/${module.courseId}/modules/${module.id}`}>
                            <Button size="sm" variant="outline" data-testid={`button-module-${module.id}`}>
                              View
                            </Button>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No upcoming modules. Check your courses for more content.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcementsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : announcements && announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((announcement: any) => (
                    <div key={announcement.id} className="space-y-1 pb-4 border-b last:border-0 last:pb-0">
                      <h4 className="font-medium text-sm">{announcement.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(announcement.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No announcements yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deadlinesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : deadlines && deadlines.length > 0 ? (
                <div className="space-y-3">
                  {deadlines.slice(0, 5).map((deadline: any) => {
                    const dueDate = new Date(deadline.dueDate);
                    const isOverdue = isBefore(dueDate, new Date());
                    
                    return (
                      <div key={deadline.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{deadline.title}</p>
                          <p className={`text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                            {isOverdue ? "Overdue" : format(dueDate, "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No upcoming deadlines
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link href="/courses">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" data-testid="link-my-courses">
                  <BookOpen className="h-4 w-4" />
                  My Courses
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" data-testid="link-resources">
                  <FileText className="h-4 w-4" />
                  Resources
                </Button>
              </Link>
              <Link href="/discussions">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" data-testid="link-discussions">
                  <MessageSquare className="h-4 w-4" />
                  Discussions
                </Button>
              </Link>
              <Link href="/certificates">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" data-testid="link-certificates">
                  <Award className="h-4 w-4" />
                  Certificates
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
