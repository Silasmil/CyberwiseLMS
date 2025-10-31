import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Download, ExternalLink, Pin, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Resources() {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources"],
  });

  const pinnedResources = resources?.filter((r: any) => r.isPinned) || [];
  const generalResources = resources?.filter((r: any) => !r.isPinned) || [];

  const ResourceCard = ({ resource }: { resource: any }) => {
    const icons = {
      netacad: BookOpen,
      lab: FileText,
      document: FileText,
      video: Play,
      external: ExternalLink,
    };
    const Icon = icons[resource.type as keyof typeof icons] || FileText;

    return (
      <Card className="hover-elevate" data-testid={`card-resource-${resource.id}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <CardTitle className="text-lg line-clamp-1 flex-1">{resource.title}</CardTitle>
                  {resource.isPinned && (
                    <Pin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  )}
                </div>
                <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                <Badge variant="secondary" className="mt-2 text-xs capitalize">
                  {resource.type}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full sm:w-auto" asChild data-testid={`button-resource-${resource.id}`}>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              {resource.type === "lab" ? <Download className="mr-2 h-4 w-4" /> : <ExternalLink className="mr-2 h-4 w-4" />}
              {resource.type === "lab" ? "Download" : "Open"}
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Resources & Labs</h1>
        <p className="text-muted-foreground">
          Access course materials, lab downloads, and learning resources
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all-resources">All Resources</TabsTrigger>
            {pinnedResources.length > 0 && (
              <TabsTrigger value="pinned" data-testid="tab-pinned-resources">
                <Pin className="mr-2 h-4 w-4" />
                Pinned
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {resources && resources.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {resources.map((resource: any) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground/40 mb-4" />
                  <h3 className="font-heading text-lg font-semibold mb-2">No resources available</h3>
                  <p className="text-sm text-muted-foreground">Resources will be added as you progress through courses.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {pinnedResources.length > 0 && (
            <TabsContent value="pinned" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {pinnedResources.map((resource: any) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
