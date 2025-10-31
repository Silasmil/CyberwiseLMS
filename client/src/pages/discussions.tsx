import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Plus, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Discussions() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/discussions"],
  });

  const filteredPosts = posts?.filter((post: any) => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Discussions</h1>
          <p className="text-muted-foreground">
            Ask questions, share knowledge, and connect with peers
          </p>
        </div>
        <Link href="/discussions/new">
          <Button data-testid="button-new-discussion">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-discussions"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post: any) => (
            <Card key={post.id} className="hover-elevate" data-testid={`card-discussion-${post.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {post.authorName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="mb-1 line-clamp-1">{post.title}</CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{post.authorName}</span>
                        <span>•</span>
                        <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <CardDescription className="line-clamp-2">{post.content}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {post.courseName && (
                      <Badge variant="secondary" className="text-xs">{post.courseName}</Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>{post.replyCount || 0}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/discussions/${post.id}`}>
                  <Button variant="outline" size="sm" data-testid={`button-discussion-${post.id}`}>
                    View Discussion
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No discussions found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search query" : "Be the first to start a discussion!"}
            </p>
            <Link href="/discussions/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Start a Discussion
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
