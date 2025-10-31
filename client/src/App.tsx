import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { StudentLayout } from "@/components/layout/student-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { isAuthenticated, isAdmin } from "@/lib/auth";

import Home from "@/pages/home";
import Apply from "@/pages/apply";
import Login from "@/pages/login";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import ModuleDetail from "@/pages/module-detail";
import Resources from "@/pages/resources";
import Discussions from "@/pages/discussions";
import Certificates from "@/pages/certificates";
import Applications from "@/pages/admin/applications";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Redirect to="/dashboard" />;
  }

  return adminOnly ? (
    <AdminLayout>
      <Component />
    </AdminLayout>
  ) : (
    <StudentLayout>
      <Component />
    </StudentLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/apply" component={Apply} />
      <Route path="/login" component={Login} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/courses">
        {() => <ProtectedRoute component={Courses} />}
      </Route>
      <Route path="/courses/:courseId">
        {() => <ProtectedRoute component={CourseDetail} />}
      </Route>
      <Route path="/courses/:courseId/modules/:moduleId">
        {() => <ProtectedRoute component={ModuleDetail} />}
      </Route>
      <Route path="/resources">
        {() => <ProtectedRoute component={Resources} />}
      </Route>
      <Route path="/discussions">
        {() => <ProtectedRoute component={Discussions} />}
      </Route>
      <Route path="/certificates">
        {() => <ProtectedRoute component={Certificates} />}
      </Route>

      <Route path="/admin">
        {() => <ProtectedRoute component={Dashboard} adminOnly={true} />}
      </Route>
      <Route path="/admin/applications">
        {() => <ProtectedRoute component={Applications} adminOnly={true} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
