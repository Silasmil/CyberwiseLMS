import { useQuery } from "@tanstack/react-query";
import { Award, Download, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Certificates() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["/api/certificates"],
  });

  const { data: eligibleCourses, isLoading: eligibleLoading } = useQuery({
    queryKey: ["/api/certificates/eligible"],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">My Certificates</h1>
        <p className="text-muted-foreground">
          View and download your earned certificates
        </p>
      </div>

      <div>
        <h2 className="font-heading text-xl font-semibold mb-4">Earned Certificates</h2>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : certificates && certificates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {certificates.map((cert: any) => (
              <Card key={cert.id} className="border-primary/40 bg-gradient-to-br from-card to-primary/5" data-testid={`card-certificate-${cert.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="mb-1">{cert.courseName}</CardTitle>
                        <CardDescription>Certificate of Completion</CardDescription>
                      </div>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Earned
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Issued on {format(new Date(cert.issuedAt), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="pt-2">
                    <Button className="w-full" asChild data-testid={`button-download-${cert.id}`}>
                      <a href={cert.pdfUrl || `/api/certificates/${cert.id}/download`} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Award className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">No certificates yet</h3>
              <p className="text-sm text-muted-foreground">
                Complete courses to earn certificates
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="font-heading text-xl font-semibold mb-4">Eligible for Certification</h2>
        {eligibleLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : eligibleCourses && eligibleCourses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {eligibleCourses.map((course: any) => (
              <Card key={course.id} data-testid={`card-eligible-${course.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg mb-1">{course.name}</CardTitle>
                      <CardDescription>
                        {course.progress}% complete - {course.completionThreshold}% required
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    You've met the requirements for certification. Your certificate will be automatically generated.
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Certificate pending generation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">
                Complete at least 80% of a course and the capstone project to become eligible for certification
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
