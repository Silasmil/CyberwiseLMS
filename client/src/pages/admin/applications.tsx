import { useState } from "react";
import { useQuery, useMutation } from "@tantml:invoke>
<invoke name="queryClient">
import { CheckCircle, XCircle, Eye, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

export default function Applications() {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: applications, isLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/admin/applications/${id}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      setSelectedApplication(null);
      toast({
        title: "Application Approved",
        description: "Student has been sent their admission credentials.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: error.message,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/admin/applications/${id}/reject`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      setSelectedApplication(null);
      toast({
        title: "Application Rejected",
        description: "Applicant has been notified.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Rejection Failed",
        description: error.message,
      });
    },
  });

  const filteredApplications = applications?.filter((app: any) => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Applications</h1>
          <p className="text-muted-foreground">Review and manage student applications</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-status-filter">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-2 p-6">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filteredApplications.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app: any) => (
                  <TableRow key={app.id} data-testid={`row-application-${app.id}`}>
                    <TableCell className="font-medium">{app.fullName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{app.email}</TableCell>
                    <TableCell className="text-sm">{app.location}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {app.experienceLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(app.submittedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === "approved" ? "default" :
                          app.status === "rejected" ? "destructive" :
                          "secondary"
                        }
                        className="capitalize"
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedApplication(app)}
                        data-testid={`button-view-${app.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="font-heading text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-sm text-muted-foreground">
              {statusFilter !== "all" ? "Try adjusting your filter" : "No applications have been submitted yet"}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review applicant information</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-sm font-medium mt-1">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm font-medium mt-1">{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm font-medium mt-1">{selectedApplication.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-sm font-medium mt-1">{selectedApplication.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
                  <p className="text-sm font-medium mt-1 capitalize">{selectedApplication.experienceLevel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                  <p className="text-sm font-medium mt-1">
                    {format(new Date(selectedApplication.submittedAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Reason for Joining</label>
                <p className="text-sm mt-2 p-4 bg-muted/50 rounded-lg">{selectedApplication.reason}</p>
              </div>

              {selectedApplication.cvUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CV/Resume</label>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <a href={selectedApplication.cvUrl} target="_blank" rel="noopener noreferrer">
                      View CV
                    </a>
                  </Button>
                </div>
              )}

              {selectedApplication.status === "pending" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => approveMutation.mutate(selectedApplication.id)}
                    disabled={approveMutation.isPending}
                    data-testid="button-approve"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {approveMutation.isPending ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => rejectMutation.mutate(selectedApplication.id)}
                    disabled={rejectMutation.isPending}
                    data-testid="button-reject"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                  </Button>
                </div>
              )}

              {selectedApplication.status !== "pending" && (
                <div className="pt-4 border-t">
                  <Badge
                    variant={selectedApplication.status === "approved" ? "default" : "destructive"}
                    className="capitalize"
                  >
                    {selectedApplication.status}
                  </Badge>
                  {selectedApplication.status === "approved" && selectedApplication.admissionNumber && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Admission Number: <span className="font-mono font-medium">{selectedApplication.admissionNumber}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
